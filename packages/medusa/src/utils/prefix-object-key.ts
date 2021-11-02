// clones an object and prefixes all keys with a given value
function prefix(object: object, prefix: string): object {
  if (!object) {
    return null
  }
  const newObject: object = {}
  for (const entry of Object.entries(object)) {
    const [key, value] = entry
    newObject[`${prefix}.${key}`] = value
  }
  return newObject
}

export default prefix
