import type { RawSidebarItem, SidebarItem } from "types"
import { existsSync, mkdirSync, readdirSync, statSync } from "fs"
import path from "path"
import { getSidebarItemLink, sidebarAttachHrefCommonOptions } from "./index.js"
import getCoreFlowsRefSidebarChildren from "./utils/get-core-flows-ref-sidebar-children.js"

export type ItemsToAdd = SidebarItem & {
  sidebar_position?: number
}

const customGenerators: Record<string, () => Promise<ItemsToAdd[]>> = {
  "core-flows": getCoreFlowsRefSidebarChildren,
}

async function getSidebarItems(
  dir: string,
  nested = false
): Promise<ItemsToAdd[]> {
  const isRefDir = dir.startsWith("/references")
  const basePath = isRefDir ? path.resolve() : path.resolve("app")
  const fullPath = path.resolve(basePath, dir.replace(/^\//, ""))
  const items: ItemsToAdd[] = []

  const files = readdirSync(fullPath)
  let mainPageIndex = -1

  for (const file of files) {
    const filePath = path.join(fullPath, file)
    const fileBasename = path.basename(file)
    if (fileBasename.startsWith("_")) {
      continue
    }

    if (fileBasename !== "page.mdx" && statSync(filePath).isDirectory()) {
      const newItems = await getSidebarItems(
        filePath.replace(basePath, ""),
        true
      )
      if (nested && newItems.length > 1) {
        items.push({
          type: "sub-category",
          title:
            fileBasename.charAt(0).toUpperCase() + fileBasename.substring(1),
          children: newItems,
          loaded: true,
        })
      } else {
        items.push(
          ...(sidebarAttachHrefCommonOptions(newItems) as ItemsToAdd[])
        )
      }
      continue
    }

    const newItem = await getSidebarItemLink({
      filePath,
      basePath,
      fileBasename,
    })

    if (!newItem) {
      continue
    }

    items.push(newItem)

    mainPageIndex = items.length - 1
  }

  if (
    mainPageIndex !== -1 &&
    items.length > 1 &&
    items[0].type !== "separator"
  ) {
    // push all other items to be children of that page.
    const mainPageChildren = [
      ...items.splice(0, mainPageIndex),
      ...items.splice(1),
    ]
    mainPageChildren.sort(sortItems)
    items[0].children = mainPageChildren
  } else if (items.length > 1) {
    items.sort(sortItems)
  }

  return items
}

async function checkItem(item: RawSidebarItem): Promise<RawSidebarItem> {
  if (!item.type) {
    throw new Error(
      `ERROR: The following item doesn't have a type: ${JSON.stringify(
        item,
        undefined,
        2
      )}`
    )
  }
  if (item.type === "separator") {
    return item
  }
  if (item.autogenerate_path) {
    item.children = (await getSidebarItems(item.autogenerate_path)).map(
      (child) => {
        delete child.sidebar_position

        return child
      }
    )
  } else if (
    item.custom_autogenerate &&
    Object.hasOwn(customGenerators, item.custom_autogenerate)
  ) {
    item.children = await customGenerators[item.custom_autogenerate]()
  } else if (item.children) {
    item.children = await Promise.all(
      item.children.map(async (childItem) => await checkItem(childItem))
    )
  }

  return item
}

export async function generateSidebar(sidebar: RawSidebarItem[]) {
  const path = await import("path")
  const { writeFileSync } = await import("fs")

  const normalizedSidebar = await Promise.all(
    sidebar.map(async (item) => await checkItem(item))
  )

  const generatedDirPath = path.resolve("generated")

  if (!existsSync(generatedDirPath)) {
    mkdirSync(generatedDirPath)
  }

  // write normalized sidebar
  writeFileSync(
    path.resolve(generatedDirPath, "sidebar.mjs"),
    `export const generatedSidebar = ${JSON.stringify(
      normalizedSidebar,
      null,
      2
    )}`,
    {
      flag: "w",
    }
  )
}

function sortItems(itemA: ItemsToAdd, itemB: ItemsToAdd): number {
  const itemASidebarPosition = itemA.sidebar_position || 0
  const itemBSidebarPosition = itemB.sidebar_position || 0

  if (itemASidebarPosition > itemBSidebarPosition) {
    return 1
  }

  return itemASidebarPosition < itemBSidebarPosition ? -1 : 0
}
