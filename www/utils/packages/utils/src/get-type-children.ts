/* eslint-disable no-case-declarations */
import { DeclarationReflection, ProjectReflection, SomeType } from "typedoc"
import { getProjectChild } from "./get-project-child"

type GetTypeChildrenOptions = {
  reflectionType: SomeType
  project: ProjectReflection | undefined
  level?: number
  maxLevel?: number
}

export function getTypeChildren({
  reflectionType,
  project,
  level = 1,
  maxLevel = 3,
}: GetTypeChildrenOptions): DeclarationReflection[] {
  let children: DeclarationReflection[] = []

  if (level > maxLevel) {
    return children
  }

  switch (reflectionType.type) {
    case "intersection":
      reflectionType.types.forEach((intersectionType) => {
        children.push(
          ...getTypeChildren({
            reflectionType: intersectionType,
            project,
            level: level + 1,
            maxLevel,
          })
        )
      })
      break
    case "union":
      reflectionType.types.forEach((childItem) => {
        // TODO this should ensure that the items are unique.
        children.push(
          ...getTypeChildren({
            reflectionType: childItem,
            project,
            level: level + 1,
            maxLevel,
          })
        )
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
          children = getTypeChildren({
            reflectionType: referencedReflection.type,
            project,
            level,
            maxLevel,
          })
        }
      } else if (reflectionType.typeArguments?.length) {
        // Only useful if the reflection type is `Pick<...>`.
        const toKeepChildren: string[] = []
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
                    getTypeChildren({
                      reflectionType: childItem,
                      project,
                      level: level + 1,
                      maxLevel,
                    }).forEach((child) => {
                      removeChild(child.name, children)
                    })
                  }
                })
            }
          } else if (reflectionType.name === "Pick") {
            if (index === 0 && !children.length) {
              children = getTypeChildren({
                reflectionType: typeArgument,
                project,
                level: level + 1,
                maxLevel,
              })
            } else {
              switch (typeArgument.type) {
                case "literal":
                  if (typeArgument.value) {
                    toKeepChildren.push(typeArgument.value?.toString())
                  }
                  break
                case "union":
                  typeArgument.types.forEach((childItem) => {
                    if (childItem.type === "literal") {
                      if (childItem.value) {
                        toKeepChildren.push(childItem.value?.toString())
                      }
                    } else {
                      getTypeChildren({
                        reflectionType: childItem,
                        project,
                        level: level + 1,
                        maxLevel,
                      }).forEach((child) => {
                        if (child.name) {
                          toKeepChildren.push(child.name)
                        }
                      })
                    }
                  })
              }
            }
          } else {
            const typeArgumentChildren = getTypeChildren({
              reflectionType: typeArgument,
              project,
              level: level + 1,
              maxLevel,
            })
            children.push(...typeArgumentChildren)
          }
        })

        if (toKeepChildren.length) {
          children = children.filter((child) =>
            toKeepChildren.includes(child.name)
          )
        }
      }
      break
    case "reflection":
      children = reflectionType.declaration.children || [
        reflectionType.declaration,
      ]
      break
    case "array":
      children = getTypeChildren({
        reflectionType: reflectionType.elementType,
        project,
        level: level + 1,
        maxLevel,
      })
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
