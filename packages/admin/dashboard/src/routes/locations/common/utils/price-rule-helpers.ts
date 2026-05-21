import { castNumber } from "../../../../lib/cast-number"
import { ITEM_TOTAL_ATTRIBUTE } from "../constants"

const createPriceRule = (
  attribute: string,
  operator: string,
  value: string | number
) => {
  const rule = {
    attribute,
    operator,
    value: castNumber(value),
  }

  return rule
}

export const buildShippingOptionPriceRules = (rule: {
  gte?: string | number | null
  lte?: string | number | null
  gt?: string | number | null
  lt?: string | number | null
  eq?: string | number | null
}) => {
  const conditions = [
    { value: rule.gte, operator: "gte" },
    { value: rule.lte, operator: "lte" },
    { value: rule.gt, operator: "gt" },
    { value: rule.lt, operator: "lt" },
    { value: rule.eq, operator: "eq" },
  ]

  const conditionsWithValues = conditions.filter(
    ({ value }) => value !== undefined && value !== null && value !== ""
  ) as {
    value: string | number
    operator: string
  }[]

  return conditionsWithValues.map(({ operator, value }) =>
    createPriceRule(ITEM_TOTAL_ATTRIBUTE, operator, value)
  )
}
