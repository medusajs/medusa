export default function flattenArray(arr: any[]) {
  return arr.map((value) => {
    if (Array.isArray(value)) {
      return Object.assign({}, ...value)
    }

    return value
  })
}
