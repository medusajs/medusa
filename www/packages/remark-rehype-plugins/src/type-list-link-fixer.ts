import path from "path"
import { Transformer } from "unified"
import {
  ExpressionJsVar,
  TypeListLinkFixerOptions,
  UnistNodeWithData,
  UnistTree,
} from "./types/index.js"
import { FixLinkOptions, fixLinkUtil } from "./index.js"
import getAttribute from "./utils/get-attribute.js"
import { estreeToJs } from "./utils/estree-to-js.js"
import {
  isExpressionJsVarLiteral,
  isExpressionJsVarObj,
} from "./utils/expression-is-utils.js"

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
  types: ExpressionJsVar[] | ExpressionJsVar,
  linkOptions: Omit<FixLinkOptions, "linkedPath">
) {
  if (Array.isArray(types)) {
    types.forEach((item) => traverseTypes(item, linkOptions))
  } else if (isExpressionJsVarLiteral(types)) {
    types.original.value = matchLinks(
      types.original.value as string,
      linkOptions
    )
    types.original.raw = JSON.stringify(types.original.value)
  } else {
    Object.values(types).forEach((value) => {
      if (Array.isArray(value) || isExpressionJsVarObj(value)) {
        return traverseTypes(value, linkOptions)
      }

      if (!isExpressionJsVarLiteral(value)) {
        return
      }

      value.original.value = matchLinks(
        value.original.value as string,
        linkOptions
      )
      value.original.raw = JSON.stringify(value.original.value)
    })
  }
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
    visit(tree as UnistTree, "mdxJsxFlowElement", (node: UnistNodeWithData) => {
      if (node.name !== "TypeList") {
        return
      }

      const typesAttribute = getAttribute(node, "types")

      if (
        !typesAttribute ||
        typeof typesAttribute.value === "string" ||
        !typesAttribute.value.data?.estree
      ) {
        return
      }

      const linkOptions = {
        currentPageFilePath,
        appsPath,
      }

      // let newItems: Record<string, unknown>[]

      const typesJsVar = estreeToJs(typesAttribute.value.data.estree)

      if (!typesJsVar) {
        return
      }

      traverseTypes(typesJsVar, linkOptions)
    })
  }
}
