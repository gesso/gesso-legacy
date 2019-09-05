import { NextFunction, Request, Response, Router } from "express"
import uuid from "uuid"

import {
  importProcedures,
  readFile,
  GESSO_REGISTRY_PATH
} from "../../../lib/registry/lib"

export default (queues: any) => {
  const router: Router = Router({ mergeParams: true })

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    console.log("Received request")
    res.sendStatus(200)
  })

  router.get(
    "/procedures",
    async (req: Request, res: Response, next: NextFunction) => {
      console.log(`Received request for procedures.`)
      // TODO: Retrieve procedures from the server.

      const modules = await importProcedures(GESSO_REGISTRY_PATH)
      const procedures = modules.map(module => {
        return module.procedure
      })
      res.status(200).json({ procedures })
    }
  )

  router.get(
    "/procedures/:procedureId",
    async (req: Request, res: Response, next: NextFunction) => {
      const procedureId: string = req.params.procedureId
      console.log(`Received request for procedure ${procedureId}.`)
      const modules = await importProcedures(GESSO_REGISTRY_PATH)
      const procedures = modules
        .map(module => {
          return module.procedure
        })
        .filter(procedure => {
          return procedure.id === procedureId
        })
      res.status(200).json({ procedure: procedures[0] })
    }
  )

  router.get(
    "/procedures/:procedureId/source",
    async (req: Request, res: Response, next: NextFunction) => {
      const procedureId: string = req.params.procedureId
      console.log(`Received request for procedure ${procedureId}.`)
      const sourceFileString = await readFile(procedureId)
      res.status(200).send(sourceFileString)
    }
  )

  router.post(
    "/procedures/:procedureId/input",
    async (req: Request, res: Response, next: NextFunction) => {
      const procedureId: string = req.params.procedureId
      console.log(`Received request queue input for procedure ${procedureId}.`)
      console.log(queues)
      queues[procedureId].push(req.body.input)
      console.log(req.body.input)
      const input = { id: uuid.v4() }
      res.status(202).json({ input, value: req.body.input })
    }
  )

  router.get(
    "/schematics",
    async (req: Request, res: Response, next: NextFunction) => {
      console.log(`Received request for schematics.`)
      res.status(200).json({})
    }
  )

  return router
}
