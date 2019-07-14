import { IConfiguration } from "../type"

const configuration: IConfiguration = {
  host: {
    queue: {
      protocol: "amqp",
      host: "127.0.0.1",
      port: 5672,
      username: "guest",
      password: "guest",
      heartbeat: 10
    },
    cache: {
      host: "127.0.0.1",
      port: 6379,
      password: "",
      db: 0,
      family: 4
    }
  }
}

export default configuration
