function normalizeField(field: string): string {
  return field.replace(/(^\*|\.\*$)/, "")
}

export function buildAllowedFields(...fieldLists: string[][]): string[] {
  return [...new Set(fieldLists.flat().map(normalizeField))]
}

export function prefixAllowedFields(
  prefix: string,
  ...fieldLists: string[][]
): string[] {
  return buildAllowedFields(...fieldLists).map((field) => `${prefix}.${field}`)
}
