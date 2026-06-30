import path from "path"
import { Transformer } from "unified"
import {
  UnistNodeWithData,
  UnistTree,
  ComponentLinkFixerOptions,
  ExpressionJsVarLiteral,
} from "types"
import { FixLinkOptions, fixLinkUtil } from "../index.js"
import getAttribute from "../utils/get-attribute.js"
import { estreeToJs } from "docs-utils"
import { performActionOnLiteral } from "./perform-action-on-literal.js"
import { MD_LINK_REGEX } from "../constants.js"

const VALUE_LINK_REGEX = /^(![a-z]+!|\.)/gm

async function matchMdLinks(
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

    const newUrl = await fixLinkUtil({
      ...linkOptions,
      linkedPath: linkMatches.groups.link,
    })

    str = str.replace(linkMatches.groups.link, newUrl)
    // reset regex
    MD_LINK_REGEX.lastIndex = 0
  }

  return str
}

async function matchValueLink(
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

export function componentLinkFixer(
  componentName: string,
  attributeName: string,
  options?: ComponentLinkFixerOptions
): Transformer {
  const { filePath, basePath, checkLinksType = "md", r2BaseUrl } = options || {}
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
    const linkFn = checkLinksType === "md" ? matchMdLinks : matchValueLink

    const nodesToProcess: UnistNodeWithData[] = []
    visit(tree as UnistTree, "mdxJsxFlowElement", (node: UnistNodeWithData) => {
      if (node.name === componentName) {
        nodesToProcess.push(node)
      }
    })

    const linkOptions = {
      currentPageFilePath,
      appsPath,
      r2BaseUrl,
    }

    for (const node of nodesToProcess) {
      const attribute = getAttribute(node, attributeName)

      if (!attribute) {
        continue
      }

      if (typeof attribute.value === "string") {
        attribute.value =
          (await linkFn(attribute.value, linkOptions)) || attribute.value
        continue
      }

      if (!attribute.value.data?.estree) {
        continue
      }

      const itemJsVar = estreeToJs(attribute.value.data.estree)

      if (
        !itemJsVar ||
        ("name" in itemJsVar &&
          typeof (itemJsVar as Record<string, unknown>).name === "string")
      ) {
        continue
      }

      const literals: ExpressionJsVarLiteral[] = []
      performActionOnLiteral(itemJsVar, (item) => {
        literals.push(item)
      })

      for (const item of literals) {
        const newValue = await linkFn(
          item.original.value as string,
          linkOptions
        )
        if (newValue !== undefined) {
          item.original.value = newValue
          item.original.raw = JSON.stringify(newValue)
        }
      }
    }
  }
}
