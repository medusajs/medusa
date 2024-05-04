export const isEqual = (a: any, b: any): boolean => {
  if (a === b) {
    return true
  }

  if (a && b && typeof a === "object" && typeof b === "object") {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) {
          return false
        }
      }
      return true
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) {
      return false
    }

    for (let i = 0; i < keysA.length; i++) {
      const key = keysA[i]
      if (!Object.prototype.hasOwnProperty.call(b, key)) {
        return false
      }
      if (!isEqual(a[key], b[key])) {
        return false
      }
    }
    return true
  }

  return a !== a && b !== b
}
