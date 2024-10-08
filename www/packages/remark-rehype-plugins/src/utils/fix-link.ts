import path from "path"
import { getFileSlugSyncUtil } from "./get-file-slug.js"

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
  let fullLinkedFilePath = path.resolve(currentPageFilePath, linkedPath)
  // persist hash in new URL
  const hash = fullLinkedFilePath.includes("#")
    ? fullLinkedFilePath.substring(fullLinkedFilePath.indexOf("#"))
    : ""
  fullLinkedFilePath = fullLinkedFilePath.replace(hash, "")
  // get absolute path of the URL
  const linkedFilePath = fullLinkedFilePath.replace(basePath, "")
  const linkedFileSlug = getFileSlugSyncUtil(fullLinkedFilePath)

  const newLink =
    linkedFileSlug ||
    linkedFilePath.substring(
      0,
      linkedFilePath.indexOf(`/${path.basename(linkedFilePath)}`)
    )

  return `${newLink}${hash}`
}
