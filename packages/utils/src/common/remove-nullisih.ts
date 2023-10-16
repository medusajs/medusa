import { isDefined } from "./is-defined"

export const removeNullish = (
  obj: Record<string, unknown>
): Record<string, unknown> =>
  Object.entries(obj).reduce((resultObject, [currentKey, currentValue]) => {
    if (!isDefined(currentValue) || currentValue === null) {
      return resultObject
    }
    
    resultObject[currentKey] = currentValue
    
    return resultObject
  }, {})
