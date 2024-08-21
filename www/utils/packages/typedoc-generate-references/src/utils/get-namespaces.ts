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

      if (directory.name === "definition") {
        loopDirectories(
          readdirSync(path.join(rootPathPrefix, directory.name), {
            withFileTypes: true,
          }),
          [...parentDirs, directory.name]
        )
        return
      }

      const namespaceName = kebabToTitle(directory.name)
      const pathPattern = `**/packages/core/core-flows/src/${parentDirs.join(
        "/"
      )}${directory.name}/**`

      const namespace: NamespaceGenerateDetails = {
        name: namespaceName,
        pathPattern,
        children: [],
      }

      const subDirs = readdirSync(path.join(rootFlowsPath, directory.name), {
        withFileTypes: true,
      })

      subDirs.forEach((dir) => {
        if (
          !dir.isDirectory() ||
          (dir.name !== "workflows" && dir.name !== "steps")
        ) {
          return
        }

        namespace.children!.push({
          name: `${capitalize(dir.name)}_${namespaceName}`,
          pathPattern: `**/packages/core/core-flows/src/${directory.name}/${dir.name}`,
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
  const names: string[] = []

  namespaces.forEach((namespace) => {
    names.push(namespace.name)

    if (namespace.children) {
      names.push(...getNamespaceNames(namespace.children))
    }
  })

  return names
}
