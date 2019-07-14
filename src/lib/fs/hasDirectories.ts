import hasDirectory from "./hasDirectory"

const hasDirectories = async (paths: string[]): Promise<string[]> => {
  return Promise.all(paths.map((path: string) => hasDirectory(path)))
}

export default hasDirectories
