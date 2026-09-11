import { FieldFilterContext, IFieldFilter } from "./index"

/**
 * Filter that only allows explicitly specified fields
 * Fields not in the allowed list are returned as not allowed
 *
 * A field is allowed only if its full path is in the allowed list as-is, both
 * for a plain selection and for a relation selected in full (`*region`). A
 * relation therefore never grants access to anything nested under it: `region`
 * allows `region` alone, while `region.id` needs `region.id` to be allowed too.
 */
export class AllowedFieldFilter implements IFieldFilter {
  private allowed: Set<string>

  constructor({ allowed }: { allowed: string[] }) {
    this.allowed = new Set(allowed)
  }

  getNotAllowedFields(context: FieldFilterContext): string[] {
    const { parsedFields } = context
    const { fields, starFields } = parsedFields
    const fieldsToCheck = [...fields, ...Array.from(starFields)]

    return fieldsToCheck.filter((field) => !this.allowed.has(field))
  }
}

/**
 * Filter that restricts specific fields
 * Fields containing any restricted segment are returned as not allowed
 */
export class RestrictedFieldFilter implements IFieldFilter {
  private restricted: string[]

  constructor({ restricted }: { restricted: string[] }) {
    this.restricted = restricted
  }

  getNotAllowedFields(context: FieldFilterContext): string[] {
    const { parsedFields } = context
    const { fields, starFields } = parsedFields
    const fieldsToCheck = [...fields, ...Array.from(starFields)]
    const notAllowedFields: string[] = []

    fieldsToCheck.forEach((field) => {
      const fieldSegments = field.split(".")
      const hasRestrictedField = this.restricted.some((restrictedField) =>
        fieldSegments.includes(restrictedField)
      )
      if (hasRestrictedField) {
        notAllowedFields.push(field)
        return
      }

      return
    })

    return notAllowedFields
  }
}

/**
 * Filter that disallows specific fields as a hard security boundary.
 * Any requested field whose path contains a disallowed segment is returned as
 * not allowed (e.g. `orders` matches both `orders` and `orders.customer.email`).
 *
 * A disallowed entry is either a string, matched against a whole segment, or a
 * regular expression, tested against each segment *and* against the full dotted
 * path. Matching a segment blocks a whole family of relations at once, e.g.
 * `/_link$/` blocks the link entities that would otherwise resolve the same data
 * under a different segment (`order_link.order`,
 * `payment_collection_link.payment_collection`, ...). Matching the full path makes
 * a relation's position expressible, which a segment can't capture: e.g.
 * `/\.orders(?:\.|$)/` blocks `orders` everywhere but at the root, so a route can
 * expose the caller's own `orders` without it becoming a pivot into everyone
 * else's through `orders.region.orders`.
 *
 * Behaves like {@link RestrictedFieldFilter}, but is enforced independently of
 * any feature flag so it can be relied upon to keep sensitive relations off
 * unauthenticated endpoints.
 */
export class DisallowedFieldFilter implements IFieldFilter {
  private disallowedSegments: Set<string>
  private disallowedPatterns: RegExp[]

  constructor({ disallowed }: { disallowed: (string | RegExp)[] }) {
    this.disallowedSegments = new Set(
      disallowed
        .filter((field): field is string => typeof field === "string")
        .map(DisallowedFieldFilter.normalize)
    )
    this.disallowedPatterns = disallowed
      .filter((field): field is RegExp => field instanceof RegExp)
      .map(DisallowedFieldFilter.toStatelessRegex)
  }

  private static normalize(value: string): string {
    return value.normalize("NFKC").trim().toLowerCase()
  }

  /**
   * The `g` and `y` flags make a regex stateful across `test` calls through its
   * `lastIndex`, which would make a field's outcome depend on the fields checked
   * before it. Those flags are dropped so matching is always deterministic.
   */
  private static toStatelessRegex(pattern: RegExp): RegExp {
    const flags = pattern.flags.replace(/[gy]/g, "")
    return flags === pattern.flags ? pattern : new RegExp(pattern.source, flags)
  }

  private isDisallowedSegment(segment: string): boolean {
    return (
      this.disallowedSegments.has(segment) ||
      this.disallowedPatterns.some((pattern) => pattern.test(segment))
    )
  }

  private isDisallowedField(field: string): boolean {
    const normalized = DisallowedFieldFilter.normalize(field)

    // A segment never contains a `.`, so a pattern that spans separators can only
    // ever match here. Patterns meant for a single segment match both ways, which
    // leaves segment-scoped entries such as `/_link$/` behaving as before.
    if (this.disallowedPatterns.some((pattern) => pattern.test(normalized))) {
      return true
    }

    return normalized
      .split(".")
      .some((segment) =>
        this.isDisallowedSegment(DisallowedFieldFilter.normalize(segment))
      )
  }

  getNotAllowedFields(context: FieldFilterContext): string[] {
    const { parsedFields } = context
    const { fields, starFields } = parsedFields
    const fieldsToCheck = [...fields, ...Array.from(starFields)]

    return fieldsToCheck.filter((field) => this.isDisallowedField(field))
  }
}
