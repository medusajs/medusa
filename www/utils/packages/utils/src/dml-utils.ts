import { DeclarationReflection, ReferenceType, ReflectionType } from "typedoc"

export function isDmlEntity(reflection: DeclarationReflection) {
  if (reflection.type?.type !== "reference") {
    return false
  }

  return reflection.type.name === "DmlEntity"
}

export function getDmlProperties(
  reflectionType: ReferenceType
): DeclarationReflection[] {
  if (
    !reflectionType.typeArguments?.length ||
    reflectionType.typeArguments[0].type !== "intersection"
  ) {
    return []
  }

  const schemaType = reflectionType.typeArguments[0].types[0] as ReflectionType

  return schemaType.declaration.children || []
}
