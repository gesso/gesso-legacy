import { Http } from "../../interface/http"
// TODO: RabbitMQ interface

// Start different network interfaces.
export const start = async (queues: any) => {
  const http = new Http(queues)
  http.start()
}
