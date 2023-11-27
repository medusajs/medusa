export function checkArraySameElms(
  arr1: Array<any>,
  arr2: Array<any>
): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  return arr1.every((value, index) => value === arr2[index])
}
