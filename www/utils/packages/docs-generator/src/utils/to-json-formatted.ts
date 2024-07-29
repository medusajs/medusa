/**
 * Retrieves the stringified JSON of a variable formatted.
 *
 * @param item The item to stringify
 * @returns The formatted JSON string
 */
export default function toJsonFormatted(item: unknown): string {
  return JSON.stringify(item, undefined, "\t")
}
