import { readFileSync } from "fs"
import { getFrontMatter, findPageTitle } from "docs-utils"
import { ItemsToAdd, sidebarAttachCommonOptions } from "../index.js"
import { FrontMatter, Sidebar } from "types"

/**
 * Reference pages are the JSON doc-model (`page.json`), not MDX, so their title
 * and sidebar frontmatter live inside the serialized `DocPage` rather than in a
 * `---` block. Read those fields from the JSON.
 */
function getReferencePageMeta(filePath: string): {
  frontmatter: FrontMatter
  title?: string
} {
  try {
    const page = JSON.parse(readFileSync(filePath, "utf-8")) as {
      title?: string
      frontmatter?: FrontMatter
    }
    return { frontmatter: page.frontmatter || {}, title: page.title }
  } catch {
    return { frontmatter: {}, title: undefined }
  }
}

export async function getSidebarItemLink({
  filePath,
  basePath,
  fileBasename,
}: {
  filePath: string
  basePath: string
  fileBasename: string
}): Promise<ItemsToAdd | undefined> {
  const isJsonReference = fileBasename.endsWith(".json")
  const { frontmatter, title } = isJsonReference
    ? getReferencePageMeta(filePath)
    : {
        frontmatter: await getFrontMatter(filePath),
        title: findPageTitle(filePath),
      }

  if (frontmatter.sidebar_autogenerate_exclude) {
    return
  }

  const newItem = sidebarAttachCommonOptions([
    {
      type: "link",
      path:
        frontmatter.slug ||
        filePath.replace(basePath, "").replace(`/${fileBasename}`, ""),
      title: frontmatter.sidebar_label || title || "",
      description: frontmatter.sidebar_description || "",
    },
  ])[0] as Sidebar.InteractiveSidebarItem

  return {
    ...newItem,
    sidebar_position: frontmatter.sidebar_position,
  }
}
