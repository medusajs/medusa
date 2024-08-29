import { Dirent, readdirSync } from "fs"
import { rootPathPrefix } from "../constants/general.js"
import { NamespaceGenerateDetails } from "types"
import { capitalize, kebabToTitle } from "utils"
import path from "path"

export function getCoreFlowNamespaces(): NamespaceGenerateDetails[] {
  const namespaces: NamespaceGenerateDetails[] = []
  const rootFlowsPath = path.join(
    rootPathPrefix,
    "packages",
    "core",
    "core-flows",
    "src"
  )

  // retrieve directories
  const directories = readdirSync(rootFlowsPath, {
    withFileTypes: true,
  })

  const loopDirectories = (dirs: Dirent[], parentDirs: string[] = []) => {
    dirs.forEach((directory) => {
      if (!directory.isDirectory()) {
        return
      }

      const namespaceName = kebabToTitle(directory.name)
      const pathPatternPrefix = `**/packages/core/core-flows/src/${
        parentDirs.length ? `${parentDirs.join("/")}/` : ""
      }${directory.name}`
      const pathPattern = `${pathPatternPrefix}/**`

      const namespace: NamespaceGenerateDetails = {
        name: namespaceName,
        pathPattern,
        children: [],
      }

      const subDirs = readdirSync(
        path.join(rootFlowsPath, ...parentDirs, directory.name),
        {
          withFileTypes: true,
        }
      )

      subDirs.forEach((dir) => {
        if (
          !dir.isDirectory() ||
          (dir.name !== "workflows" && dir.name !== "steps")
        ) {
          return
        }

        namespace.children!.push({
          name: `${capitalize(dir.name)}_${namespaceName}`,
          pathPattern: `${pathPatternPrefix}/${dir.name}/**`,
        })
      })

      namespaces.push(namespace)
    })
  }

  loopDirectories(directories)

  return namespaces
}

export function getNamespaceNames(
  namespaces: NamespaceGenerateDetails[]
): string[] {
  return namespaces.map((namespace) => namespace.name)
}
