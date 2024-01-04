import { DeclarationReflection, ProjectReflection, SomeType } from "typedoc"
import { getProjectChild } from "./get-project-child"

const MAX_LEVEL = 3

export function getTypeChildren(
  reflectionType: SomeType,
  project: ProjectReflection | undefined,
  level = 1
): DeclarationReflection[] {
  let children: DeclarationReflection[] = []

  if (level > MAX_LEVEL) {
    return children
  }

  switch (reflectionType.type) {
    case "intersection":
      reflectionType.types.forEach((intersectionType) => {
        children.push(...getTypeChildren(intersectionType, project, level + 1))
      })
      break
    case "reference":
      // eslint-disable-next-line no-case-declarations
      const referencedReflection = reflectionType.reflection
        ? "children" in reflectionType.reflection
          ? reflectionType.reflection
          : project
            ? project.getReflectionById(reflectionType.reflection.id)
            : undefined
        : project
          ? getProjectChild(project, reflectionType.name)
          : undefined

      if (referencedReflection instanceof DeclarationReflection) {
        if (referencedReflection.children) {
          children = referencedReflection.children
        } else if (referencedReflection.type) {
          children = getTypeChildren(
            referencedReflection.type,
            project,
            level + 1
          )
        }
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
                    getTypeChildren(childItem, project, level + 1).forEach(
                      (child) => {
                        removeChild(child.name, children)
                      }
                    )
                  }
                })
            }
          } else {
            const typeArgumentChildren = getTypeChildren(
              typeArgument,
              project,
              level + 1
            )
            children.push(...typeArgumentChildren)
          }
        })
      }
      break
    case "reflection":
      children = reflectionType.declaration.children || [
        reflectionType.declaration,
      ]
      break
    case "array":
      children = getTypeChildren(reflectionType.elementType, project, level + 1)
  }

  return filterChildren(children)
}

const REJECTED_CHILDREN_NAMES = ["__type"]

function filterChildren(children: DeclarationReflection[]) {
  return children.filter(
    (child) => !REJECTED_CHILDREN_NAMES.includes(child.name)
  )
}

function removeChild(name: unknown, children: DeclarationReflection[]) {
  const childIndex = children.findIndex((child) => child.name === name)
  if (childIndex !== -1) {
    children.splice(childIndex, 1)
  }
}
