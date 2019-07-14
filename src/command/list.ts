import * as fs from "fs"
import * as os from "os"
import * as path from "path"

const GESSO_ACTIVITY_ROOT = path.join(os.homedir(), ".gesso", "activity")

const getDirectories = (source: string): Promise<string[]> => {
  return Promise.resolve(
    fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent: any) => dirent.name)
  )
}

/**
 * @name init
 * @description Creates new activity in `~/.gesso/activity`.
 */
export default async () => {
  const activityPaths: string[] = await getDirectories(GESSO_ACTIVITY_ROOT)
  console.log(`total ${activityPaths.length}`)
  activityPaths.forEach((activityPath: string, index: number) => {
    console.log(`[${index}] ${activityPath}`)
  })
}
