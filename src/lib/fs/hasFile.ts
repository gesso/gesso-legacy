import * as fs from "fs"

export const hasFile = async (filePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, 0, err => {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}

export default hasFile
