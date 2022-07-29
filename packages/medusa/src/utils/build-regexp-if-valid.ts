export function buildRegexpIfValid(str: string): RegExp | undefined {
  try {
    const m = str.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/)
    if (m) {
      const regexp = new RegExp(m[2],m[3])
      return regexp
    }
  } catch (e) {
  }

  return
}
