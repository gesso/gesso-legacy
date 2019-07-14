// TODO(@mgub): Create ~/.gesso directory if it doesn't exist.

import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import * as uuid from "uuid"

const activityId: string = uuid.v4()

const GESSO_ACTIVITY_PATH = path.join(
  os.homedir(),
  ".gesso",
  "activity",
  activityId
)

interface ICreateCommandInput {
  name: string
}

/**
 * @name init
 * @description Creates new activity in `~/.gesso/activity`.
 *
 * Prompts:
 * - Use HTTP?
 * - Use queue? (Create an manage workers, send messages, etc.)
 * - Use cache?
 *
 * * `expose function` - makes function or object stream available as an input
 */
const create = (input: ICreateCommandInput) => {
  const hasActivityPathPromise = new Promise((resolve, reject) => {
    fs.access(GESSO_ACTIVITY_PATH, fs.constants.F_OK, err => {
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
  hasActivityPathPromise
    .then(hasActivityPath => {
      console.log(
        `${GESSO_ACTIVITY_PATH} ${
          !hasActivityPath ? "does not exist. Creating activity." : "exists"
        }.`
      )
      // if (!hasActivityDirectory) {
      // }
    })
    .catch(err => {
      mkdir(GESSO_ACTIVITY_PATH).then(directoryPath => {
        console.log(`Created activity path ${directoryPath}.`)
      })

      // Create Gesso configuration object.
      const gessoConfig = {
        id: activityId
      }
      const gessoConfigString: string = JSON.stringify(gessoConfig, null, 2)
      const writeFile = (directoryPath: string, content: string) => {
        return new Promise((resolve, reject) => {
          fs.writeFile(directoryPath, content, (err: Error) => {
            if (err) {
              reject(err)
            }
            resolve(directoryPath)
          })
        })
      }
      // writeFile(
      //   path.join(GESSO_ACTIVITY_PATH, "gesso.json"),
      //   gessoConfigString
      // );
      mkdir(path.join(GESSO_ACTIVITY_PATH, ".gesso")).then(directoryPath => {
        console.log(
          `Created channel path ${path.join(
            GESSO_ACTIVITY_PATH,
            ".gesso",
            "config.json"
          )}.`
        )
        writeFile(
          path.join(GESSO_ACTIVITY_PATH, ".gesso", "config.json"),
          JSON.stringify(
            {
              name: input.name,
              repository: "@gesso/activity",
              activity: "6d70161a-2ce5-4d10-87fc-bc660ab3c3f7",
              commit: "#64ae44d",
              description: "This "
            },
            null,
            2
          )
        )
      })
      writeFile(
        path.join(GESSO_ACTIVITY_PATH, "Dockerfile"),
        // TODO: Load Dockerfile string from file or checkout and copy to localhost.
        [
          "FROM node:carbon",
          // "REPO gesso/activity",
          "ARG NODE_ENV=production",
          "ENV NODE_ENV=$NODE_ENV",
          "RUN groupadd -r gesso && useradd -m -r -g gesso gesso",
          "WORKDIR /home/gesso/",
          "COPY . .",
          "RUN chown -R gesso /home/gesso/",
          "USER gesso",
          'CMD [ "node", "index.js" ]'
        ].join("\n")
      )
      writeFile(
        path.join(GESSO_ACTIVITY_PATH, "index.js"),
        // TODO: Load Dockerfile string from file or checkout and copy to localhost.
        [
          `"use strict";`,
          `Object.defineProperty(exports, "__esModule", { value: true });`,
          `exports.default = (message) => {`,
          `  const activityId = "${activityId}";`,
          `  console.log(\`Executing activity ${activityId}.\`);`,
          "  // TODO: Add input source counter.",
          `  console.log(\`${activityId} received from <source>: \${JSON.stringify(message, null, 2)}\`);`,
          `  return {`,
          `    content: \`[to:random-activity] Test output from task ${activityId}\``,
          `  };`,
          `};`,
          `//# sourceMappingURL=${activityId}.js.map`
        ].join("\n")
      )
      // writeFile(
      //   path.join(GESSO_ACTIVITY_PATH, "package.json"),
      //   ""
      // );
      // writeFile(
      //   path.join(GESSO_ACTIVITY_PATH, "tsconfig.json"),
      //   ""
      // );
      // writeFile(
      //   path.join(GESSO_ACTIVITY_PATH, "index.ts"),
      //   ""
      // );
    })
}

export default create
