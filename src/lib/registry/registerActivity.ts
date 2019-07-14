import os from "os"
import path from "path"
import { IActivity } from "../queue/initialize"
import { Host } from "../../host"
import importActivity from "./importActivity"

const GESSO_PATH = path.resolve(os.homedir(), ".gesso")
const GESSO_ACTIVITY_PATH: string = path.resolve(GESSO_PATH, "activity")

export interface IImportActivityInput {
  host: Host
  activity: IActivity
}

export interface IImportModuleDefault {
  activity: IActivity
}

/**
 * Registers an {@interface IActivity} object on a {@type Host}.
 *
 * @param {IImportActivityInput} input - Input.
 */
const registerActivity = async (
  input: IImportActivityInput
): Promise<IActivity> => {
  const { host, activity } = input
  // const activityPath = installActivity({
  //   host,
  //   activity
  // })
  const handleActivity = await importModuleDefault({
    activity
  })
  host.registry[activity.id] = {
    id: activity.id,
    execute: handleActivity
  } as IActivity
  return host.registry[activity.id]
}

/**
 * Import a Node module dynamically.
 *
 * @param {string} path - Absolute path of a Node module.
 */
const importModuleDefault = async (input: IImportModuleDefault) => {
  const modulePath = path.resolve(GESSO_ACTIVITY_PATH, input.activity.id)
  return await import(modulePath).then(module => {
    return module.default
  })
}

export default registerActivity
