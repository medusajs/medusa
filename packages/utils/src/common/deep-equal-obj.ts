export function deepEqualObj(obj1: object, obj2: object): boolean {
  if (typeof obj1 !== typeof obj2) {
    return false
  }

  if (typeof obj1 !== "object" || obj1 === null) {
    return obj1 === obj2
  }

  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)

  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }

  for (const key of obj1Keys) {
    if (!obj2Keys.includes(key) || !deepEqualObj(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}
