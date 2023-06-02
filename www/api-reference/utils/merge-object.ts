export default function mergeObjects(keys: string[], values: any[]) {
  return keys.reduce(
    (obj, key, index) => ({ ...obj, [key]: values[index] }),
    {}
  )
}
