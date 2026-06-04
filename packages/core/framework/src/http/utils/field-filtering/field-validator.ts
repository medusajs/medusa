import { FieldFilterContext, IFieldFilter } from "./index"

/**
 * Filter that only allows explicitly specified fields
 * Fields not in the allowed list are returned as not allowed
 */
export class AllowedFieldFilter implements IFieldFilter {
  private allowed: string[]

  constructor({ allowed }: { allowed: string[] }) {
    this.allowed = allowed
  }

  getNotAllowedFields(context: FieldFilterContext): string[] {
    const { parsedFields } = context
    const { fields, starFields } = parsedFields
    const fieldsToCheck = [...fields, ...Array.from(starFields)]
    const notAllowedFields: string[] = []

    fieldsToCheck.forEach((field) => {
      const hasAllowedField = this.allowed.includes(field)

      if (hasAllowedField) {
        return
      }

      // Select full relation - must match an allowed field fully
      // e.g product.variants must have product.variants in allowedFields
      if (starFields.has(field)) {
        if (hasAllowedField) {
          return
        }
        notAllowedFields.push(field)
        return
      }

      const fieldStartsWithAllowedField = this.allowed.some((allowedField) =>
        field.startsWith(allowedField)
      )

      if (!fieldStartsWithAllowedField) {
        notAllowedFields.push(field)
        return
      }
    })

    return notAllowedFields
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
