export function buildRegexpIfValid(str: string): RegExp | undefined {
  try {
    const m = str.match(/^([\/~@;%#'])(.*?)\1([gimsuy]*)$/)
    if (m) {
      // Validate the flags as written first, so an invalid combination
      // (e.g. a duplicated flag) is still rejected.
      new RegExp(m[2], m[3])

      // `g` and `y` make `RegExp#test` stateful (they advance `lastIndex`
      // across calls), which corrupts repeated whole-value checks such as
      // CORS origin matching. Neither flag adds anything for a single
      // whole-value test, so they are stripped here.
      const flags = m[3].replace(/[gy]/g, "")
      return new RegExp(m[2], flags)
    }
  } catch (e) {}

  return
}
