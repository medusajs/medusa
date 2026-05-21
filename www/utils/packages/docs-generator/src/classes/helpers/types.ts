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

  /**
   * Same as {@link cleanUpTypes}, plus removes fully-permissive object types
   * (e.g. `Record<string, unknown>` / `Record<string, any>`) that contribute
   * no schema information when intersected with a structured object type.
   * Without this, intersections like `Record<string, unknown> & { id: string }`
   * emit an `allOf` with a redundant empty `{ type: object }` entry.
   */
  cleanUpIntersectionTypes(types: ts.Type[]): ts.Type[] {
    const cleanedUpTypes = this.cleanUpTypes(types)
    return this.removeUnconstrainedRecord(cleanedUpTypes)
  }

  private removeUnconstrainedRecord(types: ts.Type[]): ts.Type[] {
    if (types.length <= 1) {
      return types
    }
    const filtered = types.filter((t) => !this.isUnconstrainedRecord(t))
    return filtered.length > 0 ? filtered : types
  }

  private isUnconstrainedRecord(type: ts.Type): boolean {
    const aliasSymbol = type.aliasSymbol
    if (!aliasSymbol || aliasSymbol.escapedName !== "Record") {
      return false
    }
    const args = type.aliasTypeArguments
    if (!args || args.length !== 2) {
      return false
    }
    const [keyArg, valArg] = args
    const keyIsString = !!(keyArg.flags & ts.TypeFlags.String)
    const valIsUnknownOrAny = !!(
      valArg.flags &
      (ts.TypeFlags.Unknown | ts.TypeFlags.Any)
    )
    return keyIsString && valIsUnknownOrAny
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
