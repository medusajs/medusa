/**
 * Parses a filter value read from a URL query param (stored as JSON) into the
 * value to send to the API.
 *
 * A freshly-added filter is committed with an empty default value (e.g. "" for
 * a string filter, [] for a multiselect) so its chip renders and the value
 * picker opens. Those empty values must not reach the API, or they constrain
 * the query and blank the table before the user has entered anything. This
 * helper returns `undefined` for such empty values so the caller can omit them.
 *
 * @param raw - The raw query param value, or undefined when absent.
 * @returns The parsed value, or `undefined` when absent or empty.
 */
export function parseFilterParam(raw?: string | null): any {
  if (raw === undefined || raw === null || raw === "") {
    return undefined
  }

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    // Not JSON (e.g. a bare string written by hand); use the raw value.
    value = raw
  }

  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return undefined
  }

  return value
}
