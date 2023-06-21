export const kebabToCamelCase = (string) =>
  string.replace(/-./g, (match) => match[1].toUpperCase())
