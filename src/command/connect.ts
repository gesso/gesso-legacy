// TODO(@mgub): Create ~/.gesso directory if it doesn't exist.

import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import * as uuid from "uuid"

const channel = {
  id: uuid.v4()
}

const GESSO_CHANNEL_PATH = path.join(
  os.homedir(),
  ".gesso",
  "channel",
  channel.id
)

interface ICreateCommandOptions {
  source: string
  target: string
}

/**
 * @name create
 * @description Creates new activity in `~/.gesso/activity`.
 *
 * Prompts:
 * - Use HTTP?
 * - Use queue? (Create an manage workers, send messages, etc.)
 * - Use cache?
 *
 * * `expose function` - makes function or object stream available as an input
 */
const connect = (options: ICreateCommandOptions) => {
  const hasChannelPathPromise = new Promise((resolve, reject) => {
    fs.access(GESSO_CHANNEL_PATH, fs.constants.F_OK, err => {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
  const mkdir = (directoryPath: string) => {
    return new Promise((resolve, reject) => {
      fs.mkdir(directoryPath, { recursive: true }, err => {
        if (err) {
          reject(err)
        }
        resolve(directoryPath)
      })
    })
  }
  hasChannelPathPromise
    .then(hasChannelPath => {
      console.log(
        `${GESSO_CHANNEL_PATH} ${
          !hasChannelPath ? "does not exist. Creating channel." : "exists"
        }.`
      )
      // if (!hasActivityDirectory) {
      // }
    })
    .catch(err => {
      mkdir(GESSO_CHANNEL_PATH).then(directoryPath => {
        console.log(`Created channel path ${directoryPath}.`)
      })
      // Create Gesso configuration object.
      const gessoConfig = {
        source: options.source,
        target: options.target
      }
      const writeFile = (filePath: string, content: string) => {
        return new Promise((resolve, reject) => {
          fs.writeFile(filePath, content, (err: Error) => {
            if (err) {
              reject(err)
            }
            resolve(filePath)
          })
        })
      }
      mkdir(path.join(GESSO_CHANNEL_PATH, ".gesso")).then(directoryPath => {
        console.log(
          `Created channel path ${path.join(
            GESSO_CHANNEL_PATH,
            ".gesso",
            "config.json"
          )}.`
        )
        writeFile(
          path.join(GESSO_CHANNEL_PATH, ".gesso", "config.json"),
          JSON.stringify(gessoConfig, null, 2)
        )
      })
    })
}

export default connect
