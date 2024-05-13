// Due to some types using Zod in their declaration
// The type name isn't picked properly by typescript

import ts from "typescript"
import isZodObject from "./is-zod-object.js"

// this ensures that the correct type name is used.
export default function getCorrectZodTypeName({
  typeReferenceNode,
  itemType,
}: {
  typeReferenceNode: ts.TypeReferenceNode
  itemType: ts.Type
}): string | undefined {
  if (!isZodObject(itemType)) {
    return
  }

  return typeReferenceNode.typeArguments?.[0] &&
    "typeName" in typeReferenceNode.typeArguments[0]
    ? (typeReferenceNode.typeArguments?.[0].typeName as ts.Identifier).getText()
    : undefined
}
