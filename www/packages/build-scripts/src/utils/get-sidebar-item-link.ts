import { getFrontMatterUtil } from "remark-rehype-plugins"
import { ItemsToAdd, sidebarAttachHrefCommonOptions } from "../index.js"
import { readFileSync } from "fs"
import findMetadataTitle from "./find-metadata-title.js"
import findPageHeading from "./find-page-heading.js"
import { InteractiveSidebarItem } from "types"

export async function getSidebarItemLink({
  filePath,
  basePath,
  fileBasename,
}: {
  filePath: string
  basePath: string
  fileBasename: string
}): Promise<ItemsToAdd | undefined> {
  const frontmatter = await getFrontMatterUtil(filePath)
  if (frontmatter.sidebar_autogenerate_exclude) {
    return
  }

  const fileContent = frontmatter.sidebar_label
    ? ""
    : readFileSync(filePath, "utf-8")

  const newItem = sidebarAttachHrefCommonOptions([
    {
      type: "link",
      path:
        frontmatter.slug ||
        filePath.replace(basePath, "").replace(`/${fileBasename}`, ""),
      title:
        frontmatter.sidebar_label ||
        findMetadataTitle(fileContent) ||
        findPageHeading(fileContent) ||
        "",
    },
  ])[0] as InteractiveSidebarItem

  return {
    ...newItem,
    sidebar_position: frontmatter.sidebar_position,
  }
}
