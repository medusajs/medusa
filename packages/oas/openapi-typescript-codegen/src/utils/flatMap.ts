/**
 * Calls a defined callback on each element of an array.
 * Then, flattens the result into a new array.
 */
export const flatMap = <U, T>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => U[]
): U[] => {
  const result: U[] = []
  array.map<U[]>(callback).forEach((arr) => {
    result.push(...arr)
  })
  return result
}
