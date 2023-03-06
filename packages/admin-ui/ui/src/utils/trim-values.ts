export const trimValues = <T extends object>(obj: T) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim()
    } else if (obj[key] && obj[key].constructor.name === "Object") {
      trimValues(obj[key])
    }
  })

  return obj
}
