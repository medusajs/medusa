export function deepEqualObj(obj1: unknown, obj2: unknown): boolean {
  if (typeof obj1 !== typeof obj2) {
    return false
  }

  if (typeof obj1 !== "object" || obj1 === null) {
    return obj1 === obj2
  }

  if (typeof obj2 !== "object" || obj2 === null) {
    return obj2 === obj1
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
