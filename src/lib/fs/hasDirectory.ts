import * as fs from "fs"

const hasDirectory = async (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, err => {
      if (err) {
        reject(err)
      }
      resolve(path)
    })
  })
}

export default hasDirectory
