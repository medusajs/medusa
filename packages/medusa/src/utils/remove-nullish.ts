import { isDefined } from "medusa-core-utils"

export const removeNullish = (
  obj: Record<string, unknown>
): Record<string, unknown> =>
  Object.entries(obj).reduce((resultObject, [currentKey, currentValue]) => {
    if (isDefined(currentValue)) {
      resultObject[currentKey] = currentValue
    }
    return resultObject
  }, {})
