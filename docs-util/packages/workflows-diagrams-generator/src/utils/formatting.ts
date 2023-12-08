export const SPACING = "\t"

export function getLinePrefix(indentation = 0): string {
  return `\n${SPACING.repeat(indentation)}`
}
