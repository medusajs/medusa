export const unique = <T>(val: T, index: number, arr: T[]): boolean => {
  return arr.indexOf(val) === index
}
