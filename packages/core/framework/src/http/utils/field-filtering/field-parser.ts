import { isDefined } from "@medusajs/utils"
import { ParsedFields } from "./index"

/**
 * Handles parsing of field strings into structured field sets
 * Supports various field modifiers:
 * - `+field` or ` field`: Add to defaults
 * - `-field`: Remove from defaults
 * - `*field` or `field.*`: Select all properties of a relation
 */
export class FieldParser {
  /**
   * Parse field string and defaults into structured field sets
   * @param fields - Comma-separated field string from query
   * @param defaults - Default fields to include
   * @returns ParsedFields with fields and starFields sets
   */
  static parse(
    fields: string | undefined,
    defaults: string[] = []
  ): ParsedFields {
    const starFields: Set<string> = new Set()
    let allFields = new Set(defaults) as Set<string>

    if (isDefined(fields)) {
      const customFields = fields.split(",").filter(Boolean)
      const shouldReplaceDefaultFields = this.shouldReplaceDefaults(customFields)
      const hasWildcard = customFields.some((field) => field === "*")

      if (shouldReplaceDefaultFields && !hasWildcard) {
        allFields = new Set(customFields.map((f) => f.replace(/^[+ -]/, "")))
      } else {
        if (hasWildcard) {
          for (const reqField of allFields) {
            if (reqField === "*" || reqField.includes(".") || reqField.startsWith("*")) {
              allFields.delete(reqField)
            }
          }
        }
        this.applyFieldModifiers(
          customFields.filter((field) => field !== "*"),
          allFields
        )
      }

      allFields.add("id")
    }

    this.extractStarFields(allFields, starFields)

    return { fields: allFields, starFields }
  }

  /**
   * Determines if custom fields should replace defaults
   * Fields replace defaults when any field doesn't have a modifier prefix
   */
  private static shouldReplaceDefaults(customFields: string[]): boolean {
    return (
      !customFields.length ||
      customFields.some((field) => {
        return !(
          field.startsWith("-") ||
          field.startsWith("+") ||
          field.startsWith(" ") ||
          field.startsWith("*") ||
          field.endsWith(".*")
        )
      })
    )
  }

  /**
   * Apply field modifiers (+, -, etc) to the field set
   */
  private static applyFieldModifiers(
    customFields: string[],
    allFields: Set<string>
  ): void {
    customFields.forEach((field) => {
      if (field.startsWith("+") || field.startsWith(" ")) {
        allFields.add(field.trim().replace(/^\+/, ""))
      } else if (field.startsWith("-")) {
        const fieldName = field.replace(/^-/, "")

        for (const reqField of allFields) {
          const isWildcard = reqField === "*"
          const reqFieldName = isWildcard
            ? "*"
            : reqField.replace(/^\*/, "")

          const shouldDelete = reqFieldName === fieldName ||
            (
              fieldName === "*"
                ? !reqField.includes(".") && !reqField.startsWith("*")
                : reqFieldName.startsWith(fieldName + ".")
            )

          if (shouldDelete) {
            allFields.delete(reqField)
          }
        }
      } else {
        allFields.add(field)
      }
    })
  }

  /**
   * Extract star fields (* prefix or .* suffix) from allFields into starFields set
   * Star fields represent "select all properties" for a relation
   */
  private static extractStarFields(
    allFields: Set<string>,
    starFields: Set<string>
  ): void {
    allFields.forEach((field) => {
      if (field !== "*" && (
        field.startsWith("*") || field.endsWith(".*")
      )) {
        starFields.add(field.replace(/(^\*|\.\*$)/, ""))
        allFields.delete(field)
      }
    })
  }
}
