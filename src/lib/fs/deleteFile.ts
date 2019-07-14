import * as fs from "fs"

const deleteFile = async (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) {
        reject(err)
      }
      resolve(path)
    })
  })
}

export default deleteFile
