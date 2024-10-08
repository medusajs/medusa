import { existsSync, readdirSync } from "fs"
import path from "path"
import { getSidebarItemLink, ItemsToAdd } from "../index.js"

export default async function getCoreFlowsRefSidebarChildren(): Promise<
  ItemsToAdd[]
> {
  const projPath = path.resolve()
  const basePath = path.join(projPath, "references", "core_flows")

  const directories = readdirSync(basePath, {
    withFileTypes: true,
  })

  const sidebarItems: ItemsToAdd[] = []

  sidebarItems.push(
    {
      type: "link",
      title: "Overview",
      path: "/medusa-workflows-reference",
      loaded: true,
      isPathHref: true,
    },
    {
      type: "separator",
    }
  )

  for (const directory of directories) {
    if (
      !directory.isDirectory() ||
      directory.name.startsWith("core_flows.") ||
      directory.name === "types" ||
      directory.name === "interfaces"
    ) {
      continue
    }

    const workflowItems: ItemsToAdd[] = []
    const stepItems: ItemsToAdd[] = []

    const readItemsFromChildDirs = async (type: "Steps" | "Workflows") => {
      const childNamespaceBasePath = path.join(
        basePath,
        directory.name,
        `${type}_${directory.name}`,
        "functions"
      )

      if (!existsSync(childNamespaceBasePath)) {
        return
      }
      const childDirs = readdirSync(childNamespaceBasePath, {
        withFileTypes: true,
      })

      for (const childDir of childDirs) {
        if (!childDir.isDirectory()) {
          continue
        }

        const childDirPath = path.join(childNamespaceBasePath, childDir.name)
        const childFile = readdirSync(childDirPath)

        if (!childFile.length) {
          continue
        }

        const sidebarItem = await getSidebarItemLink({
          filePath: path.join(childDirPath, childFile[0]),
          basePath: projPath,
          fileBasename: childFile[0],
        })

        if (sidebarItem) {
          if (childDir.name.endsWith("Workflow")) {
            workflowItems.push(sidebarItem)
          } else {
            stepItems.push(sidebarItem)
          }
        }
      }
    }

    await readItemsFromChildDirs("Steps")
    await readItemsFromChildDirs("Workflows")

    if (workflowItems.length || stepItems.length) {
      const item: ItemsToAdd = {
        type: "category",
        title: directory.name.replaceAll("_", " "),
        children: [],
        loaded: true,
        initialOpen: false,
      }

      if (workflowItems.length) {
        item.children!.push({
          type: "sub-category",
          title: "Workflows",
          children: workflowItems,
          loaded: true,
        })
      }

      if (stepItems.length) {
        item.children!.push({
          type: "sub-category",
          title: "Steps",
          children: stepItems,
          loaded: true,
        })
      }

      sidebarItems.push(item)
    }
  }

  return sidebarItems
}
