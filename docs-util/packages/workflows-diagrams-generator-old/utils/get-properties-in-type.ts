import ts from "typescript"

export default function (
  symbolType: ts.Type,
  checker: ts.TypeChecker
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  // TODO need to check type before retrieving properties + traverse "object" types for their descendent types.
  const properties = symbolType.getProperties()
  if (properties.length) {
    properties.forEach((property) => {
      result[property.escapedName.toString()] = checker.typeToString(
        checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration!)
      )
    })
  }

  return result
}
