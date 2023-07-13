export function toPascalCase(s: string): string {
  return s.replace(/(^\w|_\w)/g, (match) =>
    match.replace(/_/g, "").toUpperCase()
  )
}
