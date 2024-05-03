import path from "path"
import { Transformer } from "unified"
import {
  TypeListLinkFixerOptions,
  UnistNode,
  UnistNodeWithData,
  UnistTree,
} from "./types/index.js"
import { FixLinkOptions, fixLinkUtil } from "./index.js"

const LINK_REGEX = /\[(.*?)\]\((?<link>.*?)\)/gm

function matchLinks(
  str: string,
  linkOptions: Omit<FixLinkOptions, "linkedPath">
) {
  let linkMatches
  while ((linkMatches = LINK_REGEX.exec(str)) !== null) {
    if (!linkMatches.groups?.link) {
      return
    }

    const newUrl = fixLinkUtil({
      ...linkOptions,
      linkedPath: linkMatches.groups.link,
    })

    str = str.replace(linkMatches.groups.link, newUrl)
  }

  return str
}

function traverseTypes(
  types: Record<string, unknown>[],
  linkOptions: Omit<FixLinkOptions, "linkedPath">
) {
  return types.map((typeItem) => {
    typeItem.type = matchLinks(typeItem.type as string, linkOptions)
    typeItem.description = matchLinks(
      typeItem.description as string,
      linkOptions
    )
    if (typeItem.children) {
      typeItem.children = traverseTypes(
        typeItem.children as Record<string, unknown>[],
        linkOptions
      )
    }

    return typeItem
  })
}

export function typeListLinkFixerPlugin(
  options?: TypeListLinkFixerOptions
): Transformer {
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
    visit(tree as UnistTree, "mdxJsxFlowElement", (node: UnistNode) => {
      if (node.name !== "TypeList") {
        return
      }

      const typesAttributeIndex = node.attributes?.findIndex(
        (attribute) => attribute.name === "types"
      )
      if (typesAttributeIndex === undefined || typesAttributeIndex === -1) {
        return
      }
      const typesAttribute = node.attributes![typesAttributeIndex]

      if (
        !typesAttribute ||
        !(typesAttribute.value as Record<string, unknown>)?.value
      ) {
        return
      }

      const linkOptions = {
        currentPageFilePath,
        appsPath,
      }

      let newItems: Record<string, unknown>[]

      try {
        newItems = traverseTypes(
          JSON.parse(
            (typesAttribute.value as Record<string, unknown>).value as string
          ) as Record<string, unknown>[],
          linkOptions
        )
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
          `[type-list-link-fixer-plugin]: An error occurred while parsing items for page ${file.history[0]}: ${e}`
        )
        return
      }

      ;(
        node.attributes![typesAttributeIndex].value as Record<string, unknown>
      ).value = JSON.stringify(newItems)

      if (
        (node as UnistNodeWithData).attributes![typesAttributeIndex].value?.data
          ?.estree?.body?.length
      ) {
        const oldItems = (node as UnistNodeWithData).attributes[
          typesAttributeIndex
        ].value.data!.estree!.body![0].expression!.elements!

        ;(node as UnistNodeWithData).attributes[
          typesAttributeIndex
        ].value.data!.estree!.body![0].expression!.elements = newItems.map(
          (newItem, index) => {
            oldItems[index].properties = oldItems[index].properties.map(
              (property) => {
                if (Object.hasOwn(newItem, property.key.value)) {
                  property.value.value = newItem[property.key.value]
                  property.value.raw = JSON.stringify(
                    newItem[property.key.value]
                  )
                }

                return property
              }
            )

            return oldItems[index]
          }
        )
      }
    })
  }
}
