import * as os from "os"
import * as path from "path"
import hasDirectory from "../lib/fs/hasDirectory"
import createDirectory from "../lib/fs/createDirectory"
import createDirectories from "../lib/fs/createDirectories"

const GESSO_HOME = path.join(os.homedir(), ".gesso")

/**
 * @name init
 * @description Creates new project in `~/.gesso/scripts`.
 */
export default async () => {
  try {
    const hasHomeDirectory = await hasDirectory(GESSO_HOME)
    console.log(
      `${GESSO_HOME} ${
        !hasHomeDirectory ? "does not exist. Creating." : "exists"
      }.`
    )
    // if (!hasDirectory) {
    // }
  } catch (err) {
    createDirectory(GESSO_HOME, { recursive: true }).then(path => {
      console.log(`Created path ${path}`)
    })
    createDirectories(
      [path.join(GESSO_HOME, "activity"), path.join(GESSO_HOME, "channel")],
      { recursive: true }
    ).then(path => {
      console.log(`Created path ${path}`)
      // TODO: Create `~/.gesso/config.json#repositories`.
    })
  }
}
