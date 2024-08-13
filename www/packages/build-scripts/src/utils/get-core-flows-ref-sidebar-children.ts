import { getSidebarItemLink, ItemsToAdd } from "build-scripts"
import { existsSync, readdirSync } from "fs"
import path from "path"

export default async function getCoreFlowsRefSidebarChildren(): Promise<
  ItemsToAdd[]
> {
  const projPath = path.resolve()
  const basePath = path.join(projPath, "references", "core_flows")

  const directories = readdirSync(basePath, {
    withFileTypes: true,
  })

  const sidebarItems: ItemsToAdd[] = []

  for (const directory of directories) {
    if (
      !directory.isDirectory() ||
      directory.name.startsWith("core_flows.") ||
      directory.name === "types" ||
      directory.name === "interfaces"
    ) {
      continue
    }

    const namespaceBasePath = path.join(basePath, directory.name, "functions")

    if (!existsSync(namespaceBasePath)) {
      continue
    }

    const childDirs = readdirSync(namespaceBasePath, {
      withFileTypes: true,
    })

    const workflowItems: ItemsToAdd[] = []
    const stepItems: ItemsToAdd[] = []

    for (const childDir of childDirs) {
      if (!childDir.isDirectory()) {
        continue
      }

      const childDirPath = path.join(namespaceBasePath, childDir.name)
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

    if (workflowItems.length || stepItems.length) {
      const item: ItemsToAdd = {
        title: directory.name.replaceAll("_", " "),
        children: [],
      }

      if (workflowItems.length) {
        item.children!.push({
          title: "Workflows",
          children: workflowItems,
        })
      }

      if (stepItems.length) {
        item.children!.push({
          title: "Steps",
          children: stepItems,
        })
      }

      sidebarItems.push(item)
    }
  }

  return sidebarItems
}
