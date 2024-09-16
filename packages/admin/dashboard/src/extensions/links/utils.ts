export function appendLinkableFields(fields: string = "", linkable: string[]) {
  return [fields, ...linkable.map((link) => `+${link}.*`)].join(",")
}
