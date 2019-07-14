import amqp from "amqplib/callback_api"
import { IConnectOptions } from "../../type"

// const connectionOptions: amqp.Options.Connect = {
//   protocol: "amqp",
//   hostname: "localhost",
//   port: 5672,
//   username: "guest",
//   password: "guest",
//   locale: "en_US",
//   heartbeat: 0
// }

const connect = async (options: IConnectOptions): Promise<amqp.Connection> => {
  return new Promise((resolve, reject) => {
    amqp.connect(options, (connectError, connection: amqp.Connection) => {
      if (connectError) {
        reject(connectError)
      }
      resolve(connection)
    })
  })
}

export default connect
