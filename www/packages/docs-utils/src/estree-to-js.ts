/* eslint-disable no-case-declarations */
import {
  ArrayExpression,
  Estree,
  Expression,
  ExpressionJsVar,
  ExpressionJsVarLiteral,
  JSXElementExpression,
  JSXTextExpression,
  LiteralExpression,
  ObjectExpression,
  TemplateLiteralExpression,
  VariableDeclaration,
} from "types"

const ALLOWED_BODY_TYPES = ["ExpressionStatement", "ExportNamedDeclaration"]

export function estreeToJs(estree: Estree) {
  // TODO improve on this utility. Currently it's implemented to work
  // for specific use cases as we don't have a lot of info on other
  // use cases.
  if (
    !estree.body?.length ||
    !estree.body[0].type ||
    !ALLOWED_BODY_TYPES.includes(estree.body[0].type)
  ) {
    return
  }

  switch (estree.body[0].type) {
    case "ExpressionStatement":
      if (!estree.body[0].expression) {
        return
      }
      return expressionToJs(estree.body[0].expression)
    case "ExportNamedDeclaration":
      if (!estree.body[0].declaration) {
        return
      }
      return declarationToJs(estree.body[0].declaration)
  }
}

export function expressionToJs(
  expression: Expression
): ExpressionJsVar | ExpressionJsVar[] | undefined {
  switch (expression.type) {
    case "ArrayExpression":
      const arrVar: ExpressionJsVar[] = []
      ;(expression as ArrayExpression).elements.forEach((elm) => {
        const elmJsVar = expressionToJs(elm)
        if (!elmJsVar) {
          return
        }
        if (Array.isArray(elmJsVar)) {
          arrVar.push(...elmJsVar)
        } else {
          arrVar.push(elmJsVar)
        }
      })
      return arrVar
    case "ObjectExpression":
      const objVar: ExpressionJsVar = {}
      ;(expression as ObjectExpression).properties.forEach((property) => {
        const keyName = property.key.name ?? property.key.value

        if (!keyName) {
          return
        }
        const jsVal = expressionToJs(property.value)
        if (!jsVal) {
          return
        }

        objVar[keyName] = jsVal
      })
      return objVar
    case "Literal":
      return {
        original: expression,
        data: (expression as LiteralExpression).value,
      } as ExpressionJsVarLiteral
    case "JSXElement":
    case "JSXFragment":
      // Only take text children
      let text = ""
      ;(expression as JSXElementExpression).children.forEach((child) => {
        if (child.type !== "JSXText") {
          return
        }

        text += (child as JSXTextExpression).value
      })
      return {
        original: {
          type: "Literal",
          value: text,
          raw: `"${text}"`,
        },
        data: text,
      }
    case "TemplateLiteral":
      const templateExpression = expression as TemplateLiteralExpression
      let value = ""
      let raw = ""
      templateExpression.quasis.forEach((quasi) => {
        value += quasi.value.cooked
        raw += quasi.value.raw
      })
      return {
        original: {
          type: "Literal",
          value,
          raw,
        },
        data: value,
      }
  }
}

function declarationToJs(declaration: VariableDeclaration): {
  name: string
  value: ExpressionJsVar | ExpressionJsVar[] | undefined
} {
  if (!declaration.declarations.length) {
    throw new Error("No declarations found")
  }
  const name = declaration.declarations[0].id.name
  const value = expressionToJs(declaration.declarations[0].init)
  return {
    name,
    value,
  }
}
