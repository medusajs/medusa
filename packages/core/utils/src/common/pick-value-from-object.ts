import { isDefined } from "./is-defined"
import { isObject } from "./is-object"

export function pickValueFromObject(
  path: string,
  object: Record<any, any>
): any {
  const segments = path.split(".")
  let result: any = object

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    result = result[segment]

    if (!isDefined(result)) {
      return
    }

    if (i === segments.length - 1) {
      return result
    }

    if (Array.isArray(result)) {
      const subPath = segments.slice(i + 1).join(".")
      return result.map((item) => pickValueFromObject(subPath, item)).flat()
    }

    if (!isObject(result)) {
      return result
    }
  }

  return result
}
