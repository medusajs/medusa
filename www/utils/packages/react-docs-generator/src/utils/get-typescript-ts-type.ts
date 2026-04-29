import ts from "typescript"
import { TsType } from "../classes/typedoc-manager.js"

const MAX_LEVEL = 3

export function getTypescriptTsType(
  symbol: ts.Symbol | undefined
): TsType | null {
  if (!symbol) {
    return null
  }
  let convertedType: TsType | null = null
  if ("type" in symbol) {
    convertedType = convertTypeToTsType(symbol.type as ts.Type, 1)
  }
  if (
    !convertedType &&
    "links" in symbol &&
    symbol.links &&
    "type" in (symbol.links as Record<string, unknown>)
  ) {
    const symbolTypeLink = (symbol.links as Record<string, unknown>)
      .type as ts.Type

    convertedType = convertTypeToTsType(symbolTypeLink, 1)
  }

  return convertedType
}

function convertTypeToTsType(type: ts.Type, level = 1): TsType | null {
  if (level > MAX_LEVEL) {
    return null
  }

  // Handle union types
  if (type.isUnion()) {
    const elements: TsType[] = type.types
      .map((unionedType) => convertTypeToTsType(unionedType, level + 1))
      .filter((element): element is TsType => element !== null)

    // If all elements were filtered out, return null
    if (elements.length === 0) {
      return null
    }

    // Sort elements to put undefined at the end
    elements.sort((a, b) => {
      const aIsUndefined = a.name === "undefined"
      const bIsUndefined = b.name === "undefined"

      if (aIsUndefined && !bIsUndefined) {
        return 1
      }
      if (!aIsUndefined && bIsUndefined) {
        return -1
      }
      return 0
    })

    return {
      name: "union",
      raw: undefined,
      elements,
    }
  }

  // Handle intersection types
  if (type.isIntersection()) {
    const elements: TsType[] = type.types
      .map((intersectedType) => convertTypeToTsType(intersectedType, level + 1))
      .filter((element): element is TsType => element !== null)

    // If all elements were filtered out, return null
    if (elements.length === 0) {
      return null
    }

    return {
      name: "intersection",
      raw: undefined,
      elements,
    }
  }

  const typeFlags = type.flags

  // Handle string literal
  if (typeFlags & ts.TypeFlags.StringLiteral) {
    const literalType = type as ts.StringLiteralType
    return {
      name: "literal",
      value: `"${literalType.value}"`,
    }
  }

  // Handle number literal
  if (typeFlags & ts.TypeFlags.NumberLiteral) {
    const literalType = type as ts.NumberLiteralType
    return {
      name: "literal",
      value: literalType.value.toString(),
    }
  }

  // Handle boolean literal
  if (typeFlags & ts.TypeFlags.BooleanLiteral) {
    const literalType = type as ts.Type & { intrinsicName?: string }
    return {
      name: "literal",
      value: literalType.intrinsicName || "boolean",
    }
  }

  // Handle null
  if (typeFlags & ts.TypeFlags.Null) {
    return {
      name: "null",
    }
  }

  // Handle undefined
  if (typeFlags & ts.TypeFlags.Undefined) {
    return {
      name: "undefined",
    }
  }

  // Handle primitive types
  if (typeFlags & ts.TypeFlags.String) {
    return { name: "string" }
  }
  if (typeFlags & ts.TypeFlags.Number) {
    return { name: "number" }
  }
  if (typeFlags & ts.TypeFlags.Boolean) {
    return { name: "boolean" }
  }
  if (typeFlags & ts.TypeFlags.Void) {
    return { name: "void" }
  }
  if (typeFlags & ts.TypeFlags.Any) {
    return { name: "any" }
  }
  if (typeFlags & ts.TypeFlags.Unknown) {
    return null
  }
  if (typeFlags & ts.TypeFlags.Never) {
    return { name: "never" }
  }

  // Handle object types
  if (typeFlags & ts.TypeFlags.Object) {
    const objectType = type as ts.ObjectType

    // Handle reference types (named types)
    if (objectType.objectFlags & ts.ObjectFlags.Reference) {
      const typeRef = type as ts.TypeReference
      const typeName = typeRef.symbol?.name || "unknown"

      const elements: TsType[] = []
      if (typeRef.typeArguments) {
        typeRef.typeArguments.forEach((typeArg) => {
          const convertedType = convertTypeToTsType(typeArg, level + 1)
          if (convertedType) {
            elements.push(convertedType)
          }
        })
      }

      return {
        name: typeRef.symbol?.name || typeName,
        elements: elements.length > 0 ? elements : undefined,
        raw: undefined,
      }
    }
  }

  // Fallback: return the string representation of the type
  return null
}
