import { DeclarationReflection, ProjectReflection, SomeType } from "typedoc"

export function getTypeChildren(
  reflectionType: SomeType,
  project: ProjectReflection | undefined
) {
  let children: DeclarationReflection[] = []

  switch (reflectionType.type) {
    case "intersection":
      reflectionType.types.forEach((intersectionType) => {
        children.push(...getTypeChildren(intersectionType, project))
      })
      break
    case "reference":
      // eslint-disable-next-line no-case-declarations
      const referencedReflection =
        reflectionType.reflection && "children" in reflectionType.reflection
          ? reflectionType.reflection
          : project?.getChildByName(reflectionType.name)

      if (
        referencedReflection instanceof DeclarationReflection &&
        referencedReflection.children
      ) {
        children = referencedReflection.children
      }
      break
    case "reflection":
      children = reflectionType.declaration.children || [
        reflectionType.declaration,
      ]
      break
    case "array":
      children = getTypeChildren(reflectionType.elementType, project)
  }

  return children
}
