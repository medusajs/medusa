/**
 * Strips the docblock syntax off a generated docblock, leaving its YAML content.
 *
 * The asterisk prefix must be removed per line: a blank line in a docblock is
 * ` *` without a trailing space once trailing whitespace is trimmed, so removing
 * every occurrence of ` * ` in the content leaves the asterisk of those lines
 * behind, which makes the YAML invalid.
 *
 * @param content - The docblock's content.
 * @returns The docblock's YAML content.
 */
export default function docblockToYaml(content: string): string {
  return content
    .replace(/^\s*\/\*\*\n/, "")
    .replace(/\*\/\s*$/, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\*[ \t]?/, ""))
    .join("\n")
    .trim()
}
