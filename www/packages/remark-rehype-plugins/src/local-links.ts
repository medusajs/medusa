import path from "path"
import type { Transformer } from "unified"
import type { LocalLinkOptions, UnistNode, UnistTree } from "types"
import { fixLinkUtil } from "./index.js"

export function localLinksRehypePlugin(options: LocalLinkOptions): Transformer {
  const { filePath, basePath, r2BaseUrl } = options || {}
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

    const nodesToProcess: { node: UnistNode; type: "a" | "link" }[] = []
    visit(tree as UnistTree, ["element", "link"], (node: UnistNode) => {
      if (node.tagName === "a") {
        if (node.properties?.href?.match(/page\.mdx?/)) {
          nodesToProcess.push({ node, type: "a" })
        }
      } else if (node.type === "link") {
        if (node.url?.match(/page\.mdx?/)) {
          nodesToProcess.push({ node, type: "link" })
        }
      }
    })

    for (const { node, type } of nodesToProcess) {
      if (type === "a") {
        node.properties!.href = await fixLinkUtil({
          currentPageFilePath,
          linkedPath: node.properties!.href,
          appsPath,
          r2BaseUrl,
        })
      } else {
        node.url = await fixLinkUtil({
          currentPageFilePath,
          linkedPath: node.url!,
          appsPath,
          r2BaseUrl,
        })
      }
    }
  }
}
