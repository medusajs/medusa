import path from "path"

export type FixLinkOptions = {
  currentPageFilePath: string
  linkedPath: string
  appsPath: string
}

export function fixLinkUtil({
  currentPageFilePath,
  linkedPath,
  appsPath: basePath,
}: FixLinkOptions) {
  // get absolute path of the URL
  const linkedFilePath = path
    .resolve(currentPageFilePath, linkedPath)
    .replace(basePath, "")
  // persist hash in new URL
  const hash = linkedFilePath.includes("#")
    ? linkedFilePath.substring(linkedFilePath.indexOf("#"))
    : ""

  return `${linkedFilePath.substring(
    0,
    linkedFilePath.indexOf(`/${path.basename(linkedFilePath)}`)
  )}${hash}`
}
