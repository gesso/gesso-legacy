import * as os from "os"
import * as path from "path"
import deleteDirectory from "../lib/fs/deleteDirectory"

const GESSO_ACTIVITY_ROOT = path.join(os.homedir(), ".gesso", "activity")

/**
 * @name init
 * @description Creates new activity in `~/.gesso/activity`.
 */
export default async (args: string[]) => {
  // await deleteFile(path.join(GESSO_ACTIVITY_ROOT, args[0]));
  await deleteDirectory(path.join(GESSO_ACTIVITY_ROOT, args[0]))
}

// c - connect
// i or o: connect input or output?
// <number> - the input or output node
