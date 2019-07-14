import {
  connect,
  createChannel,
  createQueue,
  initialize as initializeQueue
} from "./lib/queue"
import { IConfiguration } from "./type"
import { IHost, IRabbitQueue, Queue } from "./command/start"
import uuid from "uuid"
import { IActivity } from "./lib/queue/initialize"

export type Host = IHost<Queue<IRabbitQueue>>

export interface IStartActivityInput {
  host: Host | null
  activity: IActivity
}

/**
 * Initialize host and connect to host queue.
 *
 * @param options
 */
export const initialize = async (options: IConfiguration): Promise<Host> => {
  // Mirror in cache (Redis).
  // TODO: Move to cache and request as needed. Use Redis is primary host state store. Store backup locally to disk (and optionally, specified store).
  // TODO: Announce this host queue when the host starts. The UUID is expected to
  //   be unique for every host instance,
  const host: Host = {
    id: uuid.v4(),
    registry: {},
    // Interfaces: queue, cache (insance, host, host type, host set), store, state.
    queue: {}
  }
  console.log(`[${host.id}] Initializing host.`)

  // Initialize host queue.
  // Create unique host queue that will be announced to all other Gesso
  // hosts connected to the queue.
  host.queue[host.id] = {
    protocol: "amqp",
    connection: null,
    channel: null,
    name: null
  } as IRabbitQueue
  console.log(`[${host.id}] Initialized queue.`)

  // Configure host queue.
  host.queue[host.id].connection = await connect({
    heartbeat: options.host.queue.heartbeat,
    host: options.host.queue.host,
    password: options.host.queue.password,
    port: options.host.queue.port,
    protocol: options.host.queue.protocol,
    username: options.host.queue.username,
    locale: "en_US"
  })
  console.log(`[${host.id}] Connected to message broker.`)
  host.queue[host.id].channel = await createChannel(
    host.queue[host.id].connection
  )
  console.log(`[${host.id}] Initialized message channel.`)
  host.queue[host.id].name = await createQueue(
    // options.service.queue.name,
    host.id,
    host.queue[host.id].channel
  )
  console.log(`[${host.id}] Initialized message queue.`)
  // TODO: Start "announce" message on interval to enable host discovery.
  // return
  await initializeQueue({ host })
  console.log(`[${host.id}] Initialization complete.`)
  // TODO: By default, receive discovery messages and print the host's known peers.
  return host
}

/**
 * Start one or more {@interface IActivity} objects.
 *
 * @param input
 */
export const start = async (input: IStartActivityInput) => {
  const { host, activity } = input

  // TODO: Listen on queues for all hosted activities.

  // Initialize host queue.
  // Create unique host queue that will be announced to all other Gesso
  // hosts connected to the queue.
  host.queue[activity.id] = {
    protocol: "amqp",
    connection: null,
    channel: null,
    name: null
  } as IRabbitQueue
  console.log(`[${host.id}] Initialized activity queue.`)

  // Configure host queue.
  host.queue[activity.id].connection = null // Set the queue connection `null`. When the activity queue connection is `null`, use the host queue connection.
  host.queue[activity.id].channel = await createChannel(
    host.queue[activity.id].connection || host.queue[host.id].connection // Re-use the connection created for the host queue. Enable multiple connections? RMQ connection pool?
  )
  host.queue[activity.id].name = await createQueue(
    activity.id,
    host.queue[activity.id].channel
  )

  return await initializeQueue({ host, activity })
}
