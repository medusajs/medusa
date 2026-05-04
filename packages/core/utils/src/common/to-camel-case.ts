// Detects already-camelCased / -PascalCased input so we return it
// unchanged (idempotent) rather than mangling it via the lowercase
// fallthrough below. The captures allow digits anywhere after the
// first character of each segment so identifiers like `H264Widget`
// or `B2bCustomer` are correctly recognized as PascalCase — without
// digits the guard would fail and the fallthrough would lose the
// inner uppercase boundary across the digit.
const ALREADY_CAMEL = /^([a-zA-Z][a-zA-Z0-9]*)(([A-Z][a-z0-9]+)+)$/

export function toCamelCase(str: string): string {
  return ALREADY_CAMEL.test(str)
    ? str
    : str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
}
