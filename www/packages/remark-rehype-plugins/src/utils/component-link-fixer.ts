import path from "path"
import { Transformer } from "unified"
import {
  ComponentLinkFixerLinkType,
  ExpressionJsVar,
  UnistNodeWithData,
  UnistTree,
} from "../types/index.js"
import { FixLinkOptions, fixLinkUtil } from "../index.js"
import getAttribute from "../utils/get-attribute.js"
import { estreeToJs } from "../utils/estree-to-js.js"
import {
  isExpressionJsVarLiteral,
  isExpressionJsVarObj,
} from "../utils/expression-is-utils.js"
import { ComponentLinkFixerOptions } from "../types/index.js"

const MD_LINK_REGEX = /\[(.*?)\]\((?<link>(![a-z]+!|\.).*?)\)/gm
const VALUE_LINK_REGEX = /^(![a-z]+!|\.)/gm

function matchMdLinks(
  str: string,
  linkOptions: Omit<FixLinkOptions, "linkedPath">
) {
  let linkMatches
  // reset regex
  MD_LINK_REGEX.lastIndex = 0
  while ((linkMatches = MD_LINK_REGEX.exec(str)) !== null) {
    if (!linkMatches.groups?.link) {
      return
    }

    const newUrl = fixLinkUtil({
      ...linkOptions,
      linkedPath: linkMatches.groups.link,
    })

    str = str.replace(linkMatches.groups.link, newUrl)
    // reset regex
    MD_LINK_REGEX.lastIndex = 0
  }

  return str
}

function matchValueLink(
  str: string,
  linkOptions: Omit<FixLinkOptions, "linkedPath">
) {
  // reset index
  VALUE_LINK_REGEX.lastIndex = 0
  if (!VALUE_LINK_REGEX.exec(str)) {
    return str
  }

  return fixLinkUtil({
    ...linkOptions,
    linkedPath: str,
  })
}

function traverseJsVar(
  item: ExpressionJsVar[] | ExpressionJsVar,
  linkOptions: Omit<FixLinkOptions, "linkedPath">,
  checkLinksType: ComponentLinkFixerLinkType
) {
  const linkFn = checkLinksType === "md" ? matchMdLinks : matchValueLink
  if (Array.isArray(item)) {
    item.forEach((item) => traverseJsVar(item, linkOptions, checkLinksType))
  } else if (isExpressionJsVarLiteral(item)) {
    item.original.value = linkFn(item.original.value as string, linkOptions)
    item.original.raw = JSON.stringify(item.original.value)
  } else {
    Object.values(item).forEach((value) => {
      if (Array.isArray(value) || isExpressionJsVarObj(value)) {
        return traverseJsVar(value, linkOptions, checkLinksType)
      }

      if (!isExpressionJsVarLiteral(value)) {
        return
      }

      value.original.value = linkFn(value.original.value as string, linkOptions)
      value.original.raw = JSON.stringify(value.original.value)
    })
  }
}

export function componentLinkFixer(
  componentName: string,
  attributeName: string,
  options?: ComponentLinkFixerOptions
): Transformer {
  const { filePath, basePath, checkLinksType = "md" } = options || {}
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
      if (node.name !== componentName) {
        return
      }

      const workflowAttribute = getAttribute(node, attributeName)

      if (
        !workflowAttribute ||
        typeof workflowAttribute.value === "string" ||
        !workflowAttribute.value.data?.estree
      ) {
        return
      }

      const linkOptions = {
        currentPageFilePath,
        appsPath,
      }

      const itemJsVar = estreeToJs(workflowAttribute.value.data.estree)

      if (!itemJsVar) {
        return
      }

      traverseJsVar(itemJsVar, linkOptions, checkLinksType)
    })
  }
}
