export function isValidRegex(str: string): boolean {
  try {
    const m = str.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);
    return m ? !!new RegExp(m[2],m[3])
        : false;
  } catch (e) {
    return false
  }
}
