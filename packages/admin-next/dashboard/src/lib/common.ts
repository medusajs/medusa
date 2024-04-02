/**
 * Pick properties from an object and copy them to a new object
 * @param obj
 * @param keys
 */
export function pick(obj: Record<string, any>, keys: string[]) {
  const ret: Record<string, any> = {}

  keys.forEach((k) => {
    if (k in obj) {
      ret[k] = obj[k]
    }
  })

  return ret
}
