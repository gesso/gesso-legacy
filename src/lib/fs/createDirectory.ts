import * as fs from "fs"

const createDirectory = async (
  path: string,
  options: {
    recursive: boolean
  }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: options.recursive }, err => {
      if (err) {
        reject(err)
      }
      resolve(path)
    })
  })
}

export default createDirectory
