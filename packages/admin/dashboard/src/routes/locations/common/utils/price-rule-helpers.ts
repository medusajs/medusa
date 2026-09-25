import { castNumber } from "../../../../lib/cast-number"
import { ITEM_TOTAL_ATTRIBUTE, WEIGHT_TOTAL_ATTRIBUTE } from "../constants"

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

export const buildShippingOptionPriceRules = (
  rule: {
    gte?: string | number | null
    lte?: string | number | null
    gt?: string | number | null
    lt?: string | number | null
    eq?: string | number | null
  },
  attribute: string = ITEM_TOTAL_ATTRIBUTE
) => {
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
    createPriceRule(attribute, operator, value)
  )
}

export const buildWeightTotalPriceRules = (rule: {
  weight_total_gte?: string | number | null
  weight_total_lte?: string | number | null
}) => {
  const conditions = [
    { value: rule.weight_total_gte, operator: "gte" },
    { value: rule.weight_total_lte, operator: "lte" },
  ]

  const conditionsWithValues = conditions.filter(
    ({ value }) => value !== undefined && value !== null && value !== ""
  ) as {
    value: string | number
    operator: string
  }[]

  return conditionsWithValues.map(({ operator, value }) =>
    createPriceRule(WEIGHT_TOTAL_ATTRIBUTE, operator, value)
  )
}
