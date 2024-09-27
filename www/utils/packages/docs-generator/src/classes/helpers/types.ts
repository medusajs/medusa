import ts from "typescript"

type ConstructorParams = {
  checker: ts.TypeChecker
}

export default class TypesHelper {
  private checker: ts.TypeChecker

  constructor({ checker }: ConstructorParams) {
    this.checker = checker
  }

  areTypesEqual(type1: ts.Type, type2: ts.Type): boolean {
    return "id" in type1 && "id" in type2 && type1.id === type2.id
  }

  /**
   * Retrieve the name of a type. This is useful when retrieving allowed/disallowed
   * properties in an Omit/Pick type.
   *
   * @param itemType - The type to retrieve its name.
   * @returns The type's name.
   */
  getTypeName(itemType: ts.Type): string {
    if (itemType.symbol || itemType.aliasSymbol) {
      return (itemType.aliasSymbol || itemType.symbol).name
    }

    if (itemType.isLiteral()) {
      return itemType.value.toString()
    }

    return this.checker.typeToString(itemType)
  }

  cleanUpTypes(types: ts.Type[]): ts.Type[] {
    let cleanedUpTypes = this.removeUndefinedNullTypes(types)

    cleanedUpTypes = this.removeExtraBoolean(cleanedUpTypes)

    cleanedUpTypes = this.removeStringRegExpTypeOverlaps(cleanedUpTypes)

    cleanedUpTypes = this.joinDateAndString(cleanedUpTypes)

    return cleanedUpTypes
  }

  private removeStringRegExpTypeOverlaps(types: ts.Type[]): ts.Type[] {
    return types.filter((itemType) => {
      // remove overlapping string / regexp types
      if (this.checker.typeToString(itemType) === "RegExp") {
        const hasString = types.some((t) => {
          return (
            t.flags === ts.TypeFlags.String ||
            t.flags === ts.TypeFlags.StringLiteral
          )
        })
        return !hasString
      }

      return true
    })
  }

  private joinDateAndString(types: ts.Type[]): ts.Type[] {
    if (types.length !== 2) {
      return types
    }

    let dateType: ts.Type | undefined
    let hasStringType = false

    types.forEach((tsType) => {
      if (
        tsType.flags === ts.TypeFlags.String ||
        tsType.flags === ts.TypeFlags.StringLiteral
      ) {
        hasStringType = true
      } else if (this.getTypeName(tsType) === "Date") {
        dateType = tsType
      }
    })

    return dateType && hasStringType ? [dateType] : types
  }

  private removeUndefinedNullTypes(types: ts.Type[]): ts.Type[] {
    return types.filter(
      (type) =>
        type.flags !== ts.TypeFlags.Undefined &&
        type.flags !== ts.TypeFlags.Null
    )
  }

  private removeExtraBoolean(types: ts.Type[]): ts.Type[] {
    let found = false
    return types.filter((tsType) => {
      if (tsType.flags !== ts.TypeFlags.BooleanLiteral) {
        return true
      }

      if (!found) {
        found = true
        return true
      }

      return false
    })
  }
}
