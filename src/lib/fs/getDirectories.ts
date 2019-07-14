import * as fs from "fs"

const getDirectories = (path: string): Promise<string[]> => {
  return Promise.resolve(
    fs
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent: any) => dirent.name)
  )
}

export default getDirectories
