import {
  ExpressionJsVarItem,
  ExpressionJsVarLiteral,
  ExpressionJsVarObj,
} from "../types/index.js"

export function isExpressionJsVarLiteral(
  expression: unknown
): expression is ExpressionJsVarLiteral {
  return (
    typeof expression === "object" &&
    expression !== null &&
    Object.hasOwn(expression, "original")
  )
}

export function isExpressionJsVarObj(
  expression: unknown
): expression is ExpressionJsVarObj {
  return (
    typeof expression === "object" &&
    expression !== null &&
    !Object.hasOwn(expression, "original")
  )
}

export function isExpressionJsVarItem(
  expression: unknown
): expression is ExpressionJsVarItem {
  return (
    typeof expression === "object" &&
    expression !== null &&
    Object.hasOwn(expression, "original")
  )
}
