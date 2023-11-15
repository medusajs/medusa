export function autoGapFiller(inputArgs: any[], func: Function): any[] {
  const inputArgsLength = inputArgs.length
  const funcLength = func.length
  const context = 1

  const gap = inputArgsLength + context - funcLength
  if (gap > 0) {
    const filler = Array(gap).fill(undefined)
    return [...inputArgs, ...filler]
  }

  return inputArgs
}
