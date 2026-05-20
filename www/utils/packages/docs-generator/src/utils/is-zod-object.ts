import ts from "typescript"

export default function isZodObject(itemType: ts.Type): boolean {
  if (!itemType.symbol?.declarations?.length) {
    return false
  }

  const parent = itemType.symbol.declarations[0].parent

  if (!("typeName" in parent)) {
    return false
  }

  // `Prettify` for Zod v4 and `identity` for Zod v3
  return (
    (parent.typeName as ts.Identifier).getText().includes("Prettify") ||
    (parent.typeName as ts.Identifier).getText().includes("identity")
  )
}
