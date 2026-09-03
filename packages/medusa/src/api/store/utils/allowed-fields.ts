function normalizeField(field: string): string {
  return field.replace(/(^\*|\.\*$)/, "")
}

export function buildAllowedFields(...fieldLists: string[][]): string[] {
  return [...new Set(fieldLists.flat().map(normalizeField))]
}
