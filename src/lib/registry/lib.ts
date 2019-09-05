import os from "os"
import path from "path"
import * as fs from "fs"
import { GESSO_PATH, GESSO_REGISTRY_PATH } from "../../index"

const getDirectories = (path: string): Promise<string[]> => {
  return Promise.resolve(
    fs
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent: any) => dirent.isDirectory())
      .map((dirent: any) => dirent.name)
  )
}

// TODO: Make this synchronous.
export const importProcedures = async (registryPath: string) => {
  const procedurePaths = await getDirectories(registryPath)
  const procedures = []
  for await (const procedurePath of procedurePaths) {
    const procedure = await importModule(procedurePath)
    procedures.push(procedure)
  }
  return procedures
}

/**
 * Import a Node module dynamically.
 *
 * @param {string} path - Absolute path of a Node module.
 */
export const importModule = async (path: string) => {
  // TODO: Compile TS files when importing.
  console.info(`Importing procedure module ${path}.`)
  return import("path").then(pathModule => {
    const moduleAbsolutePath = pathModule.resolve(GESSO_REGISTRY_PATH, path)
    console.info(`Importing procedure from path ${moduleAbsolutePath}.`)
    return import(moduleAbsolutePath).then(module => {
      return module
    })
  })
}

export const readFile = async (path: string) => {
  return import("path").then(pathModule => {
    const moduleAbsolutePath = pathModule.resolve(
      GESSO_PATH,
      "src",
      "test",
      "demo",
      "registry",
      path,
      "index.ts"
    )
    console.info(`Importing procedure from path ${moduleAbsolutePath}.`)
    const sourceFileString = fs.readFileSync(moduleAbsolutePath)
    return Promise.resolve(sourceFileString)
    // return import(moduleAbsolutePath).then(module => {
    //   return module
    // })
  })
}

// <MOVE_TO_FILE>
function copyFileSync(source: string, target: string) {
  let targetFile: string = target

  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source))
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source))
}

function copyFolderRecursiveSync(source: string, target: string) {
  let files = []

  // check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source))
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder)
  }

  // copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source)
    files.forEach(file => {
      const curSource = path.join(source, file)
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder)
      } else {
        copyFileSync(curSource, targetFolder)
      }
    })
  }
}
// </MOVE_TO_FILE>
