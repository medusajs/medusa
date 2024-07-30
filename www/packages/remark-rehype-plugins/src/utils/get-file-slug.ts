import { getFrontMatterUtil } from "./get-front-matter.js"
import { matter } from "vfile-matter"
import { readSync } from "to-vfile"
import { FrontMatter } from "../types/index.js"

export async function getFileSlugUtil(
  filePath: string
): Promise<string | undefined> {
  const fileFrontmatter = await getFrontMatterUtil(filePath)

  if (fileFrontmatter.slug) {
    // add to slugs array
    return fileFrontmatter.slug
  }
}

export function getFileSlugSyncUtil(filePath: string): string | undefined {
  const content = readSync(filePath)

  matter(content)

  return ((content.data.matter as FrontMatter).slug as string) || undefined
}
