type Params = {
  obj: Record<string, unknown>
  value: unknown
  path: string
}

export default function setObjValue({
  obj,
  value,
  path,
}: Params): Record<string, unknown> {
  // split path by delimiter
  const splitPath = path.split(".")
  const targetKey = splitPath[0]

  if (!Object.hasOwn(obj, targetKey)) {
    obj[targetKey] = {}
  }

  if (splitPath.length === 1) {
    obj[targetKey] = value
    return obj
  }

  if (typeof obj[targetKey] !== "object") {
    throw new Error(
      `value of ${targetKey} is not an object, so can't set nested value`
    )
  }

  setObjValue({
    obj: obj[targetKey] as Record<string, unknown>,
    value,
    path: splitPath.slice(1).join("."),
  })

  return obj
}
