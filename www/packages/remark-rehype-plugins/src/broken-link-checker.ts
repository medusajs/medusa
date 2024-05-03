import { existsSync } from "fs"
import path from "path"
import type { Transformer } from "unified"
import type { UnistNode, UnistTree } from "./types/index.js"

export function brokenLinkCheckerPlugin(): Transformer {
  return async (tree, file) => {
    const { visit } = await import("unist-util-visit")

    const currentPageFilePath = file.history[0].replace(
      `/${path.basename(file.history[0])}`,
      ""
    )

    visit(tree as UnistTree, "element", (node: UnistNode) => {
      if (node.tagName !== "a" || !node.properties?.href?.match(/page\.mdx?/)) {
        return
      }
      // get absolute path of the URL
      const linkedFilePath = path
        .resolve(currentPageFilePath, node.properties.href)
        .replace(/#.*$/, "")
      // check if the file exists
      if (!existsSync(linkedFilePath)) {
        throw new Error(
          `Broken link found! ${node.properties.href} linked in ${file.history[0]}`
        )
      }
    })
  }
}
