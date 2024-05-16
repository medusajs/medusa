/* eslint-disable no-case-declarations */
import {
  ArrayExpression,
  Estree,
  Expression,
  ExpressionJsVar,
  ExpressionJsVarLiteral,
  LiteralExpression,
  ObjectExpression,
} from "../types/index.js"

export function estreeToJs(estree: Estree) {
  // TODO improve on this utility. Currently it's implemented to work
  // for specific use cases as we don't have a lot of info on other
  // use cases.
  if (
    !estree.body?.length ||
    estree.body[0].type !== "ExpressionStatement" ||
    !estree.body[0].expression
  ) {
    return
  }

  return expressionToJs(estree.body[0].expression)
}

function expressionToJs(
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
      // ignore JSXElements
      return
    default:
      console.warn(
        `[expressionToJs] can't parse expression of type ${expression.type}`
      )
  }
}
