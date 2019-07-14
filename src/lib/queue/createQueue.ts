import amqp from "amqplib/callback_api"

const options: amqp.Options.AssertQueue = {
  durable: false
}

const createQueue = (name: string, channel: amqp.Channel): Promise<string> => {
  // Assert a queue into existence. This operation is idempotent given
  // identical arguments; however, it will bork the channel if the queue
  // already exists but has different properties (values supplied in the
  // arguments field may or may not count for borking purposes; check the
  // borker’s, I mean broker’s, documentation).
  //
  // Source: https://www.squaremobius.net/amqp.node/channel_api.html#channel_assertQueue
  return new Promise((resolve, reject) => {
    channel.assertQueue(
      name,
      options,
      (err: any, ok: amqp.Replies.AssertQueue) => {
        if (err) {
          reject(err)
        }
        resolve(ok.queue)
      }
    )
  })
}

export default createQueue
