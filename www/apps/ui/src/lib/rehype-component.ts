import fs from "fs"
import path from "path"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"

import { ExampleRegistry } from "../registries/example-registry"
import { UnistNode, UnistTree } from "../types/unist"

export function rehypeComponent() {
  return async (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node.name === "ComponentExample") {
        const name = getNodeAttributeByName(node, "name")?.value as string

        if (!name) {
          return null
        }

        try {
          const component = ExampleRegistry[name]
          const src = component.file

          const filePath = path.join(process.cwd(), src)
          let source = fs.readFileSync(filePath, "utf8")

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
                code: source,
              },
            })
          )
        } catch (error) {
          console.error(error)
        }
      }
    })
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}
