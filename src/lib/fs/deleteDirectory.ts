import * as fs from "fs"
import * as path from "path"

/**
 * Remove directory recursively
 * @param {string} directoryPath
 * @see https://stackoverflow.com/a/42505874/3027390
 */
const deleteDirectory = async (directoryPath: string): Promise<string> => {
  // TODO: Promisify.
  return new Promise((resolve, reject) => {
    if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach(entry => {
        var entry_path = path.join(directoryPath, entry)
        if (fs.lstatSync(entry_path).isDirectory()) {
          deleteDirectory(entry_path)
        } else {
          fs.unlinkSync(entry_path)
        }
      })
      fs.rmdirSync(directoryPath)
      resolve(directoryPath)
    }
  })
}

export default deleteDirectory
