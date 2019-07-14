import { IMessage } from "../../type"
import { Host } from "../../host"
import { importActivity } from "../../lib/registry"
import getActivity from "./../../lib/registry/get"

export interface IActivity {
  id: string
  execute?: () => number
  // state?: {
  //   [key: string]: any
  // }
  // cache?: Cache<RedisCache>
}

interface IInitializeInput {
  host: Host
  activity?: IActivity
}

interface IEnqueueInput {
  host: Host
  activity?: IActivity
  message: IMessage
}

interface IHandleMessageInput {
  host: Host
  activity?: IActivity
  message: IMessage
}

// Start listening on "host queue" that is used to enable and manage activities (essentially installing and uninstalling an activity and listening/unlistening to the queue).
// Share connection (TCP) per gesso instance. Track this for re-use and reference in service.
// channel per activity (w. queue UUID). Store in LUT.
// queue per activity (w. queue UUID). Store in LUT.

// Store activity enabled/disabled state in Redis for global access to all hosts (across pod restarts).

const initialize = async (input: IInitializeInput) => {
  const { host, activity } = input
  console.log(`Activating queue: ${!activity ? host.id : activity.id}.`)
  await enqueue({
    host,
    ...(activity
      ? {
          activity
        }
      : {}),
    message: {
      type: "ANNOUNCE"
    } as IMessage
  })

  // Set up a consumer with a callback to be invoked with each message.
  //
  // Source: https://www.squaremobius.net/amqp.node/channel_api.html#channel_consume
  const queueName = !activity
    ? host.queue[host.id].name
    : host.queue[activity.id].name
  const channel = host.queue[queueName].channel
  channel.consume(
    queueName,
    async message => {
      try {
        const responseJson = message.content.toString()
        const incomingMessage = JSON.parse(responseJson)
        const output: IMessage = await handleMessage({
          host,
          ...(activity
            ? {
                activity
              }
            : {}),
          message: incomingMessage
        })
        await enqueue({
          host,
          ...(activity
            ? {
                activity
              }
            : {}),
          message: output
        })
      } catch (err) {
        // TODO: Print error to logs.
      }
    },
    {
      noAck: true
    }
  )
}

const handleMessage = async (input: IHandleMessageInput): Promise<IMessage> => {
  // TODO: Check if activity is present. If not, try to check it out. Then,
  //   execute the activity if it exists.
  // Load activity and execute it with the message.
  console.log(
    `[${input.host.id}] handleMessage ${
      input.activity && input.activity.id ? input.activity.id : "default"
    }`
  )
  if (!input.activity || !input.activity.id) {
    return await processHostMessage(input.message)
  } else {
    console.log(`[${input.host.id}] Getting activity ${input.activity.id}.`)
    const activity: IActivity = await getActivity({
      host: input.host,
      activity: input.activity
    })
    console.log(activity.execute)
    // TODO: Throw Error if `!activity || !activity.execute`.
    const activityInput = input.message.content
    // TODO: Confirm that setting the "this object" to `null` is the desired
    //   behavior. So far, it seems right to enforce and preserve functional
    //   execution property of activities.
    const activityOutput = await activity.execute.apply(null, activityInput)
    return {
      type: ""
    }
  }
}

const processHostMessage = async (message: IMessage) => {
  console.log(`Handling host queue message.`)
  // TODO: Process host queue message.
  // TODO: Install new activity if necessary.
  return {
    type: "ANNOUNCE",
    content: "foo"
  } as IMessage
}

const enqueue = async (input: IEnqueueInput) => {
  const { host, activity, message } = input
  const outgoingMessage: IMessage = {
    type: "EXECUTE",
    content: message.content
  }

  const queueName = !activity ? host.id : activity.id
  console.log(`Sending on queue: ${queueName}`)
  const channel = host.queue[queueName].channel

  // Send a single message with the content given as a buffer to the specific
  // queue named, bypassing routing. The options and return value are exactly
  // the same as for #publish.
  //
  // Source: https://www.squaremobius.net/amqp.node/channel_api.html#channel_sendToQueue
  const messageString = JSON.stringify(outgoingMessage)
  channel.sendToQueue(queueName, Buffer.from(messageString))
  // tslint:disable-next-line:no-console
  console.log(
    `Activity ${queueName} output: ${JSON.stringify(outgoingMessage, null, 2)}`
  )
}

export default initialize
