import fs from "fs"
import path from "path"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"
import { Documentation } from "react-docgen"
import { ExampleRegistry, UnistNode, UnistTree } from "types"
import { workerCompatibleFetch } from "docs-utils"

type Options = {
  exampleRegistry: ExampleRegistry
  specsIndex: Record<string, string[]>
  specsBaseUrl?: string
}

export function uiRehypePlugin({
  exampleRegistry,
  specsIndex,
  specsBaseUrl,
}: Options) {
  return async (tree: UnistTree) => {
    const exampleNodes: UnistNode[] = []
    const referenceNodes: UnistNode[] = []

    visit(tree, (node: UnistNode) => {
      if (node.name === "ComponentExample") {
        exampleNodes.push(node)
      } else if (node.name === "ComponentReference") {
        referenceNodes.push(node)
      }
    })

    for (const node of exampleNodes) {
      const name = getNodeAttributeByName(node, "name")?.value as string
      if (!name) {
        continue
      }

      try {
        const component = exampleRegistry[name]
        const src = component.file

        let source = await workerCompatibleFetch<string | null>({
          url: `${specsBaseUrl}/${src}`,
          responseTransformer: async (res) => {
            return res.ok ? res.text() : null
          },
          fallbackAction: async () => {
            const filePath = path.join(process.cwd(), src)
            return fs.promises.readFile(filePath, "utf8")
          },
          useRemote: !!specsBaseUrl,
        })

        if (!source) {
          continue
        }

        source = source.replaceAll("export default", "export")

        // Trim newline at the end of file. It's correct, but it makes source display look off
        if (source.endsWith("\n")) {
          source = source.substring(0, source.length - 1)
        }

        node.children?.push(
          u("element", {
            tagName: "span",
            properties: {
              __src__: src,
              codeLinesJSON: JSON.stringify(source.split("\n")),
            },
          })
        )
      } catch (error) {
        console.error(error)
      }
    }

    for (const node of referenceNodes) {
      const mainComponent = getNodeAttributeByName(node, "mainComponent")
        ?.value as string

      if (!mainComponent) {
        continue
      }

      const specs: Documentation[] = []
      const specFiles = specsIndex[mainComponent] ?? []

      if (specsBaseUrl) {
        try {
          const specResults = await Promise.all(
            specFiles.map(async (fileName) => {
              const r = await fetch(
                `${specsBaseUrl}/specs/components/${mainComponent}/${fileName}`
              )
              return r.ok ? ((await r.json()) as Documentation) : null
            })
          )
          specs.push(...(specResults.filter(Boolean) as Documentation[]))
        } catch (error) {
          console.error(error)
        }
      } else {
        const componentSpecsDir = path.join(
          process.cwd(),
          "specs",
          "components",
          mainComponent
        )
        specFiles.forEach((specFileName) => {
          const specFile = fs.readFileSync(
            path.join(componentSpecsDir, specFileName),
            "utf-8"
          )
          specs.push(JSON.parse(specFile) as Documentation)
        })
      }

      node.attributes?.push({
        name: "specsSrc",
        value: JSON.stringify(specs),
        type: "mdxJsxAttribute",
      })
    }
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}
