import * as http from "http"
import express, { Express } from "express"
import bodyParser from "body-parser"
import Router from "./routes"
import cors from "cors"

export class Http {
  public app: Express | null
  public queues: any

  constructor(queues: any) {
    this.app = null
    this.queues = queues

    this.app = express()

    this.app.use(cors())

    this.app.use(
      bodyParser.raw({ type: "application/octet-stream", limit: "150mb" })
    )
    this.app.use(
      bodyParser.json({
        verify: (req: any, res: any, buffer) => {
          req.rawBody = buffer.toString()
        }
      })
    )
    this.app.use(bodyParser.urlencoded({ extended: false, limit: "200mb" }))

    const router = Router(this.queues)
    this.app.use("/", router)
  }

  public start = async (port: number = 8080): Promise<Express> => {
    const httpServer: http.Server = this.app.listen(port, () => {
      console.log(`Server started on port ${port}.`)
    })

    return this.app
  }
}
