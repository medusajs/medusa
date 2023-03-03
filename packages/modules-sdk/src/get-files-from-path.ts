import glob from "glob"

export const getFilesFromPath = (
  folderLocation: string,
  ignore?: string | string[],
  callback?: Function
): string[] => {
  const files = glob.sync(folderLocation, {
    ignore,
  })

  const paths: string[] = []
  for (const file of files) {
    paths.push(file)
    if (callback) {
      callback(file)
    }
  }

  return paths
}
