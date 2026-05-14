import {
  ArrayExpression,
  Estree,
  ExpressionJsVar,
  Identifier,
  JSXElementExpression,
  JSXExpressionContainer,
  LiteralExpression,
  UnistNode,
  UnistTree,
} from "types"
import type { Transformer } from "unified"
import { estreeToJs, expressionToJs } from "docs-utils"

type Options = {
  verbose?: boolean
}

export function validateHighlightsPlugin(options?: Options): Transformer {
  const { verbose } = options || {}
  return async (tree) => {
    const { visit } = await import("unist-util-visit")
    const highlightConsts = new Map<string, string[][]>()

    visit(tree as UnistTree, ["mdxjsEsm", "element"], (node: UnistNode) => {
      if (node.type === "mdxjsEsm") {
        if (node.data && "estree" in node.data && node.data.estree) {
          const highlightsJsVar = estreeToJs(node.data.estree)

          if (
            !highlightsJsVar ||
            !("name" in highlightsJsVar) ||
            typeof highlightsJsVar.name !== "string" ||
            !Array.isArray(highlightsJsVar.value)
          ) {
            return
          }

          const highlights = getHighlightsFromExpressionJsVar(
            highlightsJsVar.value
          )
          if (highlights) {
            highlightConsts.set(highlightsJsVar.name, highlights)
          }
        }
        return
      }

      if (
        node.tagName !== "pre" ||
        !node.children?.length ||
        !node.children[0].data ||
        !("estree" in node.children[0].data) ||
        !node.children[0].data.estree
      ) {
        return
      }

      const body = (node.children[0].data.estree as Estree).body?.[0]

      if (
        !body ||
        body.type !== "ExpressionStatement" ||
        !body.expression ||
        body.expression.type !== "JSXElement"
      ) {
        return
      }

      const bodyExpression = body.expression as JSXElementExpression

      if (
        !bodyExpression.children.length ||
        bodyExpression.children[0].type !== "JSXExpressionContainer"
      ) {
        return
      }

      const codeExpression = (
        bodyExpression.children[0] as JSXExpressionContainer
      ).expression

      if (codeExpression.type !== "Literal") {
        return
      }

      const highlightsAttr = bodyExpression.openingElement?.attributes.find(
        (attr) => attr.name.name === "highlights"
      )

      if (!highlightsAttr) {
        return
      }

      let highlights: string[][] | undefined
      if (
        highlightsAttr.value.expression.type !== "Identifier" &&
        highlightsAttr.value.expression.type === "ArrayExpression"
      ) {
        const highlightsJs = getExpressionJsVarFromArrExpression(
          highlightsAttr.value.expression as ArrayExpression
        )
        if (!highlightsJs || !Array.isArray(highlightsJs)) {
          return
        }
        highlights = getHighlightsFromExpressionJsVar(highlightsJs)

        if (!highlights) {
          return
        }
      } else {
        if (highlightsAttr.value.expression.type !== "Identifier") {
          return
        }
        const name = (highlightsAttr.value.expression as Identifier).name
        highlights = highlightConsts.get(name)

        if (!highlights) {
          return
        }
      }

      const code = (codeExpression as LiteralExpression).value as string

      validateCodeHighlights({
        highlights,
        code,
        verbose,
      })
    })
  }
}

const getExpressionJsVarFromArrExpression = (
  expression: ArrayExpression
): ExpressionJsVar[][] => {
  if (!Array.isArray(expression.elements)) {
    return []
  }
  return expression.elements.map((elm) => {
    const elmJsVar = expressionToJs(elm)
    if (!elmJsVar || !Array.isArray(elmJsVar)) {
      return []
    }
    return elmJsVar
  })
}

const getHighlightsFromExpressionJsVar = (
  expression: ExpressionJsVar[] | ExpressionJsVar[][]
): string[][] | undefined => {
  const highlights: string[][] = []
  const shouldExtractHighlights = !Array.isArray(expression[0])
  // the expression is an array where each three items are a highlight
  // so we need to split the expression into groups of three items first
  const highlightExpressions = shouldExtractHighlights
    ? (expression as ExpressionJsVar[]).reduce((acc, item, index) => {
        if (index % 3 === 0) {
          acc.push([])
        }
        acc[acc.length - 1].push(item)
        return acc
      }, [] as ExpressionJsVar[][])
    : (expression as ExpressionJsVar[][])

  if (!highlightExpressions.length) {
    return undefined
  }

  for (const highlightExpression of highlightExpressions) {
    if (highlightExpression.length !== 3) {
      continue
    }

    const highlight = []
    for (const item of highlightExpression) {
      if (typeof item.data !== "string") {
        continue
      }
      highlight.push(item.data)
    }
    highlights.push(highlight)
  }

  return !highlights.length ? undefined : highlights
}

/**
 * Validates that the highlights of each code block are correct. It validates:
 *
 * 1. The highlight's first parameter is a string number of a valid line number in the code block.
 * 2. The highlight's second parameter is a string that is a valid text in the line of the code block.
 */
const validateCodeHighlights = ({
  highlights,
  code,
  verbose,
}: {
  highlights: string[][]
  code: string
  verbose?: boolean
}): void => {
  try {
    const lines = code.trim().split("\n")
    for (const highlight of highlights) {
      if (highlight.length < 2) {
        throw new Error(`Highlight array must have at least 2 elements`)
      }

      const lineNumber = highlight[0]
      const text = highlight[1]

      if (typeof lineNumber !== "string" || typeof text !== "string") {
        throw new Error(`Highlight array must have at least 2 elements`)
      }

      if (isNaN(Number(lineNumber))) {
        throw new Error(`Highlight line number must be a number`)
      }

      const line = lines[Number(lineNumber) - 1]?.trim()
      if (line === undefined) {
        throw new Error(`Highlight line number ${lineNumber} not found in code`)
      }

      if (text.length && !line.includes(text)) {
        throw new Error(
          `Highlight text ${text} not found in line ${lineNumber}`
        )
      }
    }
  } catch (err) {
    throw new Error(
      formatError({
        message: (err as Error).message,
        code,
        verbose,
      })
    )
  }
}

const formatError = ({
  message,
  code,
  verbose,
}: {
  message: string
  code: string
  verbose?: boolean
}): string => {
  return `${message}${verbose ? `:\n${code}` : ""}`
}
