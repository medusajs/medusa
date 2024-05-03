import type { Transformer } from "unified"
import type {
  CrossProjectLinksOptions,
  UnistNode,
  UnistTree,
} from "./types/index.js"

const PROJECT_REGEX = /^!(?<area>[\w-]+)!/

export function crossProjectLinksPlugin({
  baseUrl,
  projectUrls,
}: CrossProjectLinksOptions): Transformer {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")
    visit(tree as UnistTree, "element", (node: UnistNode) => {
      if (node.tagName !== "a" || !node.properties?.href) {
        return
      }

      const projectArea = PROJECT_REGEX.exec(node.properties.href)

      if (!projectArea?.groups?.area) {
        return
      }

      const actualUrl = node.properties.href.replace(PROJECT_REGEX, "")

      const base =
        projectUrls &&
        Object.hasOwn(projectUrls, projectArea.groups.area) &&
        projectUrls[projectArea.groups.area]?.url
          ? projectUrls[projectArea.groups.area].url
          : baseUrl
      const path =
        projectUrls &&
        Object.hasOwn(projectUrls, projectArea.groups.area) &&
        projectUrls[projectArea.groups.area]?.path
          ? projectUrls[projectArea.groups.area].path
          : projectArea.groups.area

      node.properties.href = `${base}/${path}${actualUrl}`
    })
  }
}
