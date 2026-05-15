import path from "path"
import { getFrontMatterFromString, getFileSlugSync } from "docs-utils"

export type FixLinkOptions = {
  currentPageFilePath: string
  linkedPath: string
  appsPath: string
  r2BaseUrl?: string
}

export async function fixLinkUtil({
  currentPageFilePath,
  linkedPath,
  appsPath: basePath,
  r2BaseUrl,
}: FixLinkOptions) {
  let fullLinkedFilePath = path.resolve(currentPageFilePath, linkedPath)
  // persist hash in new URL
  const hash = fullLinkedFilePath.includes("#")
    ? fullLinkedFilePath.substring(fullLinkedFilePath.indexOf("#"))
    : ""
  fullLinkedFilePath = fullLinkedFilePath.replace(hash, "")
  // get absolute path of the URL
  const linkedFilePath = fullLinkedFilePath.replace(basePath, "")
  let linkedFileSlug: string | undefined
  try {
    if (r2BaseUrl) {
      const res = await fetch(`${r2BaseUrl}${linkedFilePath}`)
      if (res.ok) {
        linkedFileSlug = (await getFrontMatterFromString(await res.text()))?.slug
      }
    } else {
      linkedFileSlug = getFileSlugSync(fullLinkedFilePath)
    }
  } catch {
    // fetch failed — fall back to path-based URL
  }

  const newLink =
    linkedFileSlug ||
    linkedFilePath.substring(
      0,
      linkedFilePath.indexOf(`/${path.basename(linkedFilePath)}`)
    )

  return `${newLink}${hash}`
}
