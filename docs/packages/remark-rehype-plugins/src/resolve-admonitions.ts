import { Transformer } from "unified"
import { UnistNode } from "./types/index.js"

const ALLOWED_NODE_NAMES = ["note", "tip", "info", "warning"]

export function resolveAdmonitionsPlugin(): Transformer {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")
    visit(tree as UnistNode, (node: UnistNode) => {
      if (
        (node.type !== "containerDirective" &&
          node.type !== "leafDirective" &&
          node.type !== "textDirective") ||
        !node.name ||
        !ALLOWED_NODE_NAMES.includes(node.name)
      ) {
        return
      }

      let title: string | undefined
      node.children?.some((childNode, childIndex) => {
        if (childNode.data?.directiveLabel && childNode.children?.length) {
          title = childNode.children.find((item) => item.type === "text")?.value

          if (title) {
            node.children?.splice(childIndex, 1)
          }
        }

        return title !== undefined
      })

      if (!node.data) {
        node.data = {}
      }

      node.data.hName = "Note"
      node.data.hProperties = {
        title:
          title ||
          (node.name !== "note"
            ? `${node.name.charAt(0).toUpperCase()}${node.name.substring(1)}`
            : "Note"),
      }
    })
  }
}
