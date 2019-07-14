import * as fs from "fs"

// TODO: Create "Channel" abstracction with something like this:
//
//   ```
//   type PathLike = string | Buffer | URL`
//   ```
//
// From file: node_modules/@types/node/fs.d.ts

const writeFile = (filePath: string, content: string) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, err => {
      if (err) {
        reject(err)
      }
      resolve(filePath)
    })
  })
}

export default writeFile
