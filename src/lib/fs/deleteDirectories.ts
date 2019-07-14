import deleteDirectory from "./deleteDirectory"

const deleteDirectories = async (paths: string[]): Promise<string[]> => {
  return Promise.all(paths.map((path: string) => deleteDirectory(path)))
}

export default deleteDirectories
