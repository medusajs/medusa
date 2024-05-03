import path from "path"
import type { Transformer } from "unified"
import type { RawSidebarItemType } from "types"
import type { UnistTree } from "./types/index.js"

export function pageNumberRehypePlugin({
  sidebar,
}: {
  sidebar: RawSidebarItemType[]
}): Transformer {
  return async (tree, file) => {
    const { valueToEstree } = await import("estree-util-value-to-estree")
    let number = ""

    if (file.history.length) {
      // get page path
      const pageFilePath = file.history[0].replace(
        path.join(file.cwd, "app"),
        ""
      )
      let pagePath = pageFilePath.replace(`/${path.basename(pageFilePath)}`, "")

      if (!pagePath.length) {
        pagePath = "/"
      }

      const pageSidebarItem = findSidebarItem(sidebar, pagePath)

      if (pageSidebarItem?.number) {
        number = pageSidebarItem?.number
      }
    }

    ;(tree as UnistTree).children.unshift({
      type: "mdxjsEsm",
      value: `export const pageNumber = "${number}"`,
      data: {
        estree: {
          type: "Program",
          body: [
            {
              type: "ExportNamedDeclaration",
              declaration: {
                type: "VariableDeclaration",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: {
                      type: "Identifier",
                      name: "pageNumber",
                    },
                    init: valueToEstree(number),
                  },
                ],
                kind: "const",
              },
              specifiers: [],
              source: null,
            },
          ],
          sourceType: "module",
        },
      },
    })
  }
}

function findSidebarItem(
  sidebar: RawSidebarItemType[],
  path: string
): RawSidebarItemType | undefined {
  let foundItem = undefined
  for (const item of sidebar) {
    if (path === item.path) {
      foundItem = item
    } else if (item.children) {
      foundItem = findSidebarItem(item.children, path)
    }

    if (foundItem) {
      break
    }
  }

  return foundItem
}
