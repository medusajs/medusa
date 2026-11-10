import { existsSync } from "fs"
import path from "path"
import type { Transformer } from "unified"
import type { UnistNode, UnistTree } from "types"

const MD_CONTENT_OVERRIDE_FILE = "_md-content.mdx"

/**
 * Marks the rendered content of a page as human-only when an
 * `_md-content.mdx` file next to it overrides the Markdown served to agents.
 *
 * The page's content is wrapped in an element with the `data-markdown-ignore`
 * attribute, so tools comparing the HTML and Markdown versions of the page,
 * such as AFDocs' `markdown-content-parity` check, skip it.
 */
export function mdContentOverrideRehypePlugin(): Transformer {
  return async (tree, file) => {
    const filePath = file.history[0]
    if (
      !filePath ||
      path.basename(filePath) !== "page.mdx" ||
      !existsSync(path.join(path.dirname(filePath), MD_CONTENT_OVERRIDE_FILE))
    ) {
      return
    }

    const root = tree as UnistTree
    // `import` and `export` statements must stay at the root of the tree
    const esmNodes = root.children.filter((node) => node.type === "mdxjsEsm")
    const contentNodes = root.children.filter(
      (node) => node.type !== "mdxjsEsm"
    )

    root.children = [
      ...esmNodes,
      {
        type: "element",
        tagName: "div",
        properties: {
          // don't affect the page's layout
          style: "display: contents",
          dataMarkdownIgnore: "",
        },
        children: contentNodes,
      } as UnistNode,
    ]
  }
}
