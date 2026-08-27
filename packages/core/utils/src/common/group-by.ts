export function groupBy(
  array: Record<any, any>[],
  attribute: string | number
): Map<any, any> {
  return array.reduce<Map<any, any>>((map, obj) => {
    const key = obj[attribute]

    // Only skip nullish keys; 0 and "" are valid group keys and must not be dropped
    if (key === null || key === undefined) {
      return map
    }

    if (!map.get(key)) {
      map.set(key, [])
    }

    map.get(key).push(obj)

    return map
  }, new Map())
}
