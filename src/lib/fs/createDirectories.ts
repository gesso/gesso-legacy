import createDirectory from "./createDirectory"

const createDirectories = async (
  paths: string[],
  options: {
    recursive: boolean
  }
): Promise<string[]> => {
  return Promise.all(
    paths.map((path: string) =>
      createDirectory(path, {
        recursive: options.recursive
      })
    )
  )
}

export default createDirectories
