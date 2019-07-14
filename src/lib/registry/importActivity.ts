import { Host } from "../../host"
import { IActivity } from "../queue/initialize"
import os from "os"
import path from "path"

const GESSO_ACTIVITY_PATH = path.resolve(os.homedir(), ".gesso", "activity")

interface IImportActivityInput {
  host: Host
  activity: IActivity
}

const importActivity = async (input: IImportActivityInput): Promise<string> => {
  // TODO: Install activity from registry sources (e.g., GitHub) defined in `~/.gesso/config.json`.
  return "" // Return the path upon success or throw ImportActivityError upon failure.
}

export default importActivity
