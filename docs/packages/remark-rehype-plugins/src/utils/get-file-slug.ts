import { getFrontMatterUtil } from "./get-front-matter.js"

export async function getFileSlugUtil(
  filePath: string
): Promise<string | undefined> {
  const fileFrontmatter = await getFrontMatterUtil(filePath)

  if (fileFrontmatter.slug) {
    // add to slugs array
    return fileFrontmatter.slug
  }
}
