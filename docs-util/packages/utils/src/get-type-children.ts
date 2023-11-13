import { DeclarationReflection, ProjectReflection, SomeType } from "typedoc"
import { getProjectChild } from "./get-project-child"

export function getTypeChildren(
  reflectionType: SomeType,
  project: ProjectReflection | undefined
): DeclarationReflection[] {
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
          : project
          ? getProjectChild(project, reflectionType.name)
          : undefined

      if (referencedReflection instanceof DeclarationReflection) {
        if (referencedReflection.children) {
          children = referencedReflection.children
        } else if (reflectionType.typeArguments?.length) {
          reflectionType.typeArguments.forEach((typeArgument, index) => {
            if (reflectionType.name === "Omit" && index > 0) {
              switch (typeArgument.type) {
                case "literal":
                  removeChild(typeArgument.value?.toString(), children)
                  break
                case "union":
                  typeArgument.types.forEach((childItem) => {
                    if (childItem.type === "literal") {
                      removeChild(childItem.value?.toString(), children)
                    } else {
                      getTypeChildren(childItem, project).forEach((child) => {
                        removeChild(child.name, children)
                      })
                    }
                  })
              }
            } else {
              const typeArgumentChildren = getTypeChildren(
                typeArgument,
                project
              )
              children.push(...typeArgumentChildren)
            }
          })
        } else if (referencedReflection.type) {
          children = getTypeChildren(referencedReflection.type, project)
        }
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

function removeChild(name: unknown, children: DeclarationReflection[]) {
  const childIndex = children.findIndex((child) => child.name === name)
  if (childIndex !== -1) {
    children.splice(childIndex, 1)
  }
}
