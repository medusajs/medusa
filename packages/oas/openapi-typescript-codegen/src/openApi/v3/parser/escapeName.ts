export const escapeName = (value: string): string => {
  if (value || value === "") {
    const validName = /^[a-zA-Z_$][\w$]+$/g.test(value)
    if (!validName) {
      return `'${value}'`
    }
  }
  return value
}
