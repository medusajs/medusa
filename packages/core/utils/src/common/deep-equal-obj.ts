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

  // Dates expose no own enumerable keys, so the key comparison below would treat
  // any two Date instances as equal; compare their time value instead.
  if (obj1 instanceof Date || obj2 instanceof Date) {
    return (
      obj1 instanceof Date &&
      obj2 instanceof Date &&
      obj1.getTime() === obj2.getTime()
    )
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
