import amqp from "amqplib/callback_api"

const createChannel = (connection: amqp.Connection): Promise<amqp.Channel> => {
  return new Promise((resolve, reject) => {
    connection.createChannel((error, channel: amqp.Channel) => {
      if (error) {
        reject(error)
      }
      resolve(channel)
    })
  })
}

export default createChannel
