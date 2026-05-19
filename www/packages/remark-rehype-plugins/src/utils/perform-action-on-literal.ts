import { ExpressionJsVar, ExpressionJsVarLiteral } from "types"
import { isExpressionJsVarLiteral, isExpressionJsVarObj } from "docs-utils"

export const performActionOnLiteral = (
  item: ExpressionJsVar[] | ExpressionJsVar,
  action: (item: ExpressionJsVarLiteral) => void
) => {
  if (Array.isArray(item)) {
    item.forEach((i) => performActionOnLiteral(i, action))
  } else if (isExpressionJsVarLiteral(item)) {
    action(item)
  } else {
    Object.values(item).forEach((value) => {
      if (Array.isArray(value) || isExpressionJsVarObj(value)) {
        return performActionOnLiteral(value, action)
      }

      if (!isExpressionJsVarLiteral(value)) {
        return
      }

      action(value)
    })
  }
}
