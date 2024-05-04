export function groupBy(
  array: Record<any, any>[],
  attribute: string | number
): Map<any, any> {
  return array.reduce<Map<any, any>>((map, obj) => {
    const key = obj[attribute]

    if (!key) {
      return map
    }

    if (!map.get(key)) {
      map.set(key, [])
    }

    map.get(key).push(obj)

    return map
  }, new Map())
}
