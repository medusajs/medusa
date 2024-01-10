import { isObject } from "./is-object"

export function pickFromObject(path: string, object: Record<any, any>): any {
  const pathArray = path.split(".")
  let currentObject = { ...object }
  let finalValue: any = undefined
  let counter = 0

  for (const currentPath of pathArray) {
    counter = counter + 1

    if (isObject(currentObject[currentPath])) {
      currentObject = currentObject[currentPath]
    } else if (Array.isArray(currentObject[currentPath])) {
      const newPath = pathArray.slice(counter, pathArray.length)

      if (!newPath.length) {
        finalValue = currentObject[currentPath]
        break
      }

      finalValue = []
      for (const arrayItem of currentObject[currentPath]) {
        finalValue.push(pickFromObject(newPath.join("."), arrayItem))
      }

      finalValue = finalValue.flat(1)
      break
    } else {
      finalValue = currentObject[currentPath]
    }
  }

  return finalValue
}
