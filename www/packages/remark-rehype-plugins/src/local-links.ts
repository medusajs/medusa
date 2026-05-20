import path from "path"
import type { Transformer } from "unified"
import type { LocalLinkOptions, UnistNode, UnistTree } from "types"
import { fixLinkUtil } from "./index.js"

export function localLinksRehypePlugin(options: LocalLinkOptions): Transformer {
  const { filePath, basePath } = options || {}
  return async (tree, file) => {
    if (!file.cwd) {
      return
    }

    if (!file.history.length) {
      if (!filePath) {
        return
      }

      file.history.push(filePath)
    }

    const { visit } = await import("unist-util-visit")

    const currentPageFilePath = file.history[0].replace(
      `/${path.basename(file.history[0])}`,
      ""
    )
    const appsPath = basePath || path.join(file.cwd, "app")
    visit(tree as UnistTree, ["element", "link"], (node: UnistNode) => {
      if (node.tagName === "a") {
        if (!node.properties?.href?.match(/page\.mdx?/)) {
          return
        }

        node.properties.href = fixLinkUtil({
          currentPageFilePath,
          linkedPath: node.properties.href,
          appsPath,
        })
      } else if (node.type === "link") {
        if (!node.url?.match(/page\.mdx?/)) {
          return
        }

        node.url = fixLinkUtil({
          currentPageFilePath,
          linkedPath: node.url,
          appsPath,
        })
      }
    })
  }
}
