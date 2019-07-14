import * as fs from "fs"

// TODO: Create "Channel" abstracction with something like this:
//
//   ```
//   type PathLike = string | Buffer | URL`
//   ```
//
// From file: node_modules/@types/node/fs.d.ts

const readFile = (filePath: string) => {
  console.log("READ FILE")
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf8" }, (err: Error, data: string) => {
      if (err) {
        reject(err)
      }
      console.log(`READ FILE: ${data}`)
      resolve(data)
    })
  })
}

export default readFile
