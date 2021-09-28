import { isEqual } from "lodash"

export function getDifference(obj1, obj2) {
  const diff = Object.keys(obj1).reduce((result, key) => {
    if (check(obj1, obj2, key)) {
      const resultKeyIndex = result.indexOf(key)
      result.splice(resultKeyIndex, 1)
    }
    return result
  }, Object.keys(obj2))

  return diff
}

function check(obj1, obj2, key) {
  const bannedKeys = ["id", "updated_at", "created_at", "deleted_at"]
  return (
    isEqual(obj1[key], obj2[key]) ||
    bannedKeys.includes(key) ||
    (obj1[key] === null && obj2[key] === null)
  )
}
