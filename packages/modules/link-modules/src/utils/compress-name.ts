import { camelToSnakeCase, simpleHash } from "@medusajs/framework/utils"

export function compressName(name: string, limit = 58) {
  if (name.length <= limit) {
    return name.toLowerCase()
  }

  const hash = simpleHash(name).toLowerCase()
  const hashLength = hash.length

  // Remove consecutive duplicates
  const parts = name.toLowerCase().split("_")
  const deduplicatedParts: string[] = []

  for (let i = 0; i < parts.length; i++) {
    if (i === 0 || parts[i] !== parts[i - 1]) {
      deduplicatedParts.push(parts[i])
    }
  }

  let result = deduplicatedParts.join("_")

  // If still greater than the limit, truncate each part to 4 characters
  if (result.length > limit) {
    const allParts = camelToSnakeCase(name).split("_")
    result = allParts.map((part) => part.substring(0, 4)).join("_")
  }

  name = result
  const nameLength = name.length
  const diff = nameLength + hashLength - limit

  if (diff > 0) {
    return name.slice(0, nameLength - diff) + hash
  }

  return (name + hash).toLowerCase()
}
