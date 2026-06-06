import { RuleWithOperator } from "@zjedene-medusa/types"

export const withOperator = (
  border,
  min = 400,
  max = 800
): RuleWithOperator[] => {
  if (border === "betweenEquals") {
    return [
      { operator: "gte", value: min },
      { operator: "lte", value: max },
    ]
  } else if (border === "between") {
    return [
      { operator: "gt", value: min },
      { operator: "lt", value: max },
    ]
  } else if (border === "excludingMin") {
    return [
      { operator: "gt", value: min },
      { operator: "lte", value: max },
    ]
  } else if (border === "excludingMax") {
    return [
      { operator: "gte", value: min },
      { operator: "lt", value: max },
    ]
  } else if (border === "gt") {
    return [{ operator: "gt", value: min }]
  } else if (border === "lt") {
    return [{ operator: "lt", value: min }]
  } else if (border === "lte") {
    return [{ operator: "lte", value: min }]
  } else if (border === "gte") {
    return [{ operator: "gte", value: min }]
  } else {
    return []
  }
}
