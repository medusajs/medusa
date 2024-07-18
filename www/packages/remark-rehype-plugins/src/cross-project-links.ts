/* eslint-disable no-case-declarations */
import type { Transformer } from "unified"
import type {
  CrossProjectLinksOptions,
  ExpressionJsVar,
  UnistNode,
  UnistNodeWithData,
  UnistTree,
} from "./types/index.js"
import { estreeToJs } from "./utils/estree-to-js.js"
import getAttribute from "./utils/get-attribute.js"
import {
  isExpressionJsVarLiteral,
  isExpressionJsVarObj,
} from "./utils/expression-is-utils.js"

const PROJECT_REGEX = /^!(?<area>[\w-]+)!/

function matchAndFixLinks(
  link: string,
  { baseUrl, projectUrls, useBaseUrl = false }: CrossProjectLinksOptions
): string {
  const projectArea = PROJECT_REGEX.exec(link)

  if (!projectArea?.groups?.area) {
    return link
  }

  const actualUrl = link.replace(PROJECT_REGEX, "")

  const base =
    !useBaseUrl &&
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

  return `${base}/${path}${actualUrl}`
}

function linkElmFixer(node: UnistNode, options: CrossProjectLinksOptions) {
  if (!node.properties) {
    return
  }

  node.properties.href = matchAndFixLinks(node.properties.href, options)
}

function componentFixer(
  node: UnistNodeWithData,
  options: CrossProjectLinksOptions
) {
  if (!node.name) {
    return
  }

  switch (node.name) {
    case "CardList":
      const itemsAttribute = getAttribute(node, "items")

      if (
        !itemsAttribute?.value ||
        typeof itemsAttribute.value === "string" ||
        !itemsAttribute.value.data?.estree
      ) {
        return
      }

      const jsVar = estreeToJs(itemsAttribute.value.data.estree)

      if (!jsVar) {
        return
      }

      const fixProperty = (item: ExpressionJsVar) => {
        if (!isExpressionJsVarObj(item)) {
          return
        }

        Object.entries(item).forEach(([key, value]) => {
          if (key !== "href" || !isExpressionJsVarLiteral(value)) {
            return
          }

          value.original.value = matchAndFixLinks(
            value.original.value as string,
            options
          )
          value.original.raw = JSON.stringify(value.original.value)
        })
      }

      if (Array.isArray(jsVar)) {
        jsVar.forEach(fixProperty)
      } else {
        fixProperty(jsVar)
      }
      return
    case "Card":
      const hrefAttribute = getAttribute(node, "href")

      if (!hrefAttribute?.value || typeof hrefAttribute.value !== "string") {
        return
      }

      hrefAttribute.value = matchAndFixLinks(hrefAttribute.value, options)

      return
  }
}

export function crossProjectLinksPlugin(
  options: CrossProjectLinksOptions
): Transformer {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    visit(
      tree as UnistTree,
      ["element", "mdxJsxFlowElement"],
      (node: UnistNode) => {
        const isComponent = node.name === "Card" || node.name === "CardList"
        const isLink = node.tagName === "a" && node.properties?.href
        if (!isComponent && !isLink) {
          return
        }

        if (isComponent) {
          componentFixer(node as UnistNodeWithData, options)
        }

        linkElmFixer(node, options)
      }
    )
  }
}
