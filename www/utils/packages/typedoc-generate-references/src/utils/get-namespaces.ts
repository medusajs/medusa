import { Dirent, readdirSync } from "fs"
import { rootPathPrefix } from "../constants/general.js"
import { NamespaceGenerateDetails } from "types"
import { capitalize, kebabToTitle } from "utils"
import path from "path"
import pkg from 'pluralize'
const { singular } = pkg

export function getCoreFlowNamespaces(): NamespaceGenerateDetails[] {
  const namespaces: NamespaceGenerateDetails[] = []
  const rootFlowsPath: {
    flowsPath: string
    pattern: string
  }[] = [
    {
      flowsPath: path.join(
        rootPathPrefix,
        "packages",
        "core",
        "core-flows",
        "src"
      ),
      pattern: "**/packages/core/core-flows/src/",
    },
    {
      flowsPath: path.join(
        rootPathPrefix,
        "packages",
        "plugins",
        "loyalty",
        "src",
        "workflows"
      ),
      pattern: "**/packages/plugins/loyalty/src/workflows/",
    },
  ]

  for (const { flowsPath, pattern } of rootFlowsPath) {
    // retrieve directories
    const directories = readdirSync(flowsPath, {
      withFileTypes: true,
    })

    const loopDirectories = (dirs: Dirent[], parentDirs: string[] = []) => {
      dirs.forEach((directory) => {
        if (!directory.isDirectory() || directory.name === "hooks") {
          return
        }

        const namespaceName = singular(kebabToTitle(directory.name))
        const pathPatternPrefix = `${pattern}${
          parentDirs.length ? `${parentDirs.join("/")}/` : ""
        }${directory.name}`
        const pathPattern = `${pathPatternPrefix}/**`
        const existingNamespace = namespaces.find((ns) => ns.name === namespaceName)
        if (existingNamespace) {
          if (existingNamespace.pathPattern !== pathPattern) {
            existingNamespace.pathPattern = `(${existingNamespace.pathPattern}|${pathPattern})`
          }
        }

        const namespace: NamespaceGenerateDetails = {
          name: namespaceName,
          pathPattern,
          children: [],
        }

        const subDirs = readdirSync(
          path.join(flowsPath, ...parentDirs, directory.name),
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
  }

  return namespaces
}

export function getNamespaceNames(namespaces: NamespaceGenerateDetails[]): {
  mainNamespaces: string[]
  childNamespaces: string[]
} {
  const mainNamespaces: string[] = []
  const childNamespaces: string[] = []

  namespaces.map((namespace) => {
    mainNamespaces.push(namespace.name)
    childNamespaces.push(
      ...(namespace.children?.map((childNamespace) => childNamespace.name) ||
        [])
    )
  })

  return {
    mainNamespaces,
    childNamespaces,
  }
}
