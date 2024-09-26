type IncrementType = "array" | "allOf" | "anyOf" | "oneOf" | "object"

export function maybeIncrementLevel(
  level: number,
  type: IncrementType
): number {
  if (type !== "object") {
    return level
  }

  return level + 1
}

export function isLevelExceeded(level: number, maxLevel: number) {
  return level > maxLevel
}
