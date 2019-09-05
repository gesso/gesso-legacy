import { Service } from "./bin/server/service"
import * as server from "./bin/server"

import os from "os"
import path from "path"
import * as fs from "fs"

export const GESSO_PATH = path.resolve(os.homedir(), ".gesso-test")
export const GESSO_REGISTRY_PATH: string = path.resolve(GESSO_PATH, "registry")

const start = async () => {
  const service: Service = new Service()
  await service.initialize()
  await service.createSchematic()
  await service.deploySchematic()
  await service.startEnvironment()

  await server.start(service.queues)
}

start()
