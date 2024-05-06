import {
  Comment,
  DeclarationReflection,
  ProjectReflection,
  ReflectionFlags,
  SomeType,
  TypeParameterReflection,
} from "typedoc"
import * as Handlebars from "handlebars"
import { Parameter } from "../types"
import {
  getDefaultValue,
  reflectionComponentFormatter,
} from "./reflection-formatter"
import { MarkdownTheme } from "../theme"
import { getProjectChild, getType, getTypeChildren } from "utils"

export type GetReflectionTypeParametersParams = {
  reflectionType: SomeType
  project: ProjectReflection
  comment?: Comment
  level?: number
  maxLevel?: number | undefined
  wrapObject?: boolean
  isReturn?: boolean
}

export function getReflectionTypeParameters({
  reflectionType,
  project,
  comment,
  level = 1,
  maxLevel,
  wrapObject,
  isReturn = true,
}: GetReflectionTypeParametersParams): Parameter[] {
  const typeName = getType({
    reflectionType,
    collapse: "object",
    wrapBackticks: false,
    escape: false,
    hideLink: true,
    project,
    getRelativeUrlMethod: Handlebars.helpers.relativeURL,
  })
  const type = getType({
    reflectionType: reflectionType,
    collapse: "object",
    project,
    escape: true,
    getRelativeUrlMethod: Handlebars.helpers.relativeURL,
  })

  const formatParameter = () => {
    let description = ""

    if (comment) {
      if (isReturn) {
        description = getReturnComment(comment)
      }

      if (!description.length) {
        description = Handlebars.helpers.comment(comment.summary)
      }
    } else if (!isReturn) {
      description = loadComment(typeName, project)
    }

    return {
      name: "name" in reflectionType ? reflectionType.name : typeName,
      type,
      optional:
        "flags" in reflectionType
          ? (reflectionType.flags as ReflectionFlags).isOptional
          : false,
      defaultValue:
        "declaration" in reflectionType
          ? getDefaultValue(
              reflectionType.declaration as DeclarationReflection
            ) || ""
          : "",
      description,
      expandable: comment?.hasModifier(`@expandable`) || false,
      featureFlag: Handlebars.helpers.featureFlag(comment),
      children: [],
    }
  }

  const componentItem: Parameter[] = []
  const canRetrieveChildren = level + 1 <= (maxLevel || MarkdownTheme.MAX_LEVEL)
  if (reflectionType.type === "reference") {
    if (reflectionType.typeArguments || reflectionType.refersToTypeParameter) {
      const parentKey = componentItem.push(formatParameter())
      const typeArgs = reflectionType.typeArguments
        ? reflectionType.typeArguments
        : "typeParameters" in reflectionType
          ? (reflectionType.typeParameters as TypeParameterReflection[])
          : undefined
      if (
        typeArgs &&
        !isOnlyVoid(typeArgs as unknown as SomeType[]) &&
        canRetrieveChildren
      ) {
        typeArgs.forEach((typeArg) => {
          const reflectionTypeArg =
            typeArg instanceof TypeParameterReflection ? typeArg.type : typeArg
          if (!reflectionTypeArg) {
            return
          }

          componentItem[parentKey - 1].children?.push(
            ...getReflectionTypeParameters({
              reflectionType: reflectionTypeArg,
              project,
              level: level + 1,
              maxLevel,
              isReturn: false,
            })
          )
        })
      }
    } else {
      const reflection = (reflectionType.reflection ||
        getProjectChild(project, reflectionType.name)) as DeclarationReflection
      const shouldWrapObject =
        wrapObject ||
        (wrapObject === undefined && level > 1 && canRetrieveChildren)
      const parentKey = shouldWrapObject
        ? componentItem.push(formatParameter())
        : undefined
      if (reflection) {
        const reflectionChildren = canRetrieveChildren
          ? reflection.children ||
            getTypeChildren({
              reflectionType,
              project,
              level,
              maxLevel,
            })
          : undefined
        if (reflectionChildren?.length) {
          reflectionChildren.forEach((childItem) => {
            const childParameter = reflectionComponentFormatter({
              reflection: childItem as DeclarationReflection,
              level,
              maxLevel,
              project,
            })
            parentKey
              ? componentItem[parentKey - 1].children?.push(childParameter)
              : componentItem.push(childParameter)
          })
        } else {
          const childParameter = reflectionComponentFormatter({
            reflection,
            level,
            maxLevel,
            project,
          })

          parentKey
            ? componentItem[parentKey - 1].children?.push(childParameter)
            : componentItem.push(childParameter)
        }
      } else if (!parentKey) {
        componentItem.push(formatParameter())
      }
    }
  } else if (reflectionType.type === "array") {
    const parentKey = componentItem.push(formatParameter())
    if (canRetrieveChildren) {
      const elementTypeItem = getReflectionTypeParameters({
        reflectionType: reflectionType.elementType,
        project,
        level: level + 1,
        maxLevel,
        isReturn: false,
      })
      componentItem[parentKey - 1].children?.push(...elementTypeItem)
    }
  } else if (reflectionType.type === "tuple") {
    let pushTo: Parameter[] = []
    if (level === 1) {
      const parentKey = componentItem.push(formatParameter())
      pushTo = componentItem[parentKey - 1].children!
    } else {
      const parentKey = wrapObject
        ? componentItem.push(formatParameter())
        : undefined
      pushTo = parentKey
        ? componentItem[parentKey - 1].children!
        : componentItem
    }
    if (canRetrieveChildren) {
      reflectionType.elements.forEach((element) => {
        const elementTypeItem = getReflectionTypeParameters({
          reflectionType: element,
          project,
          level: level + 1,
          maxLevel,
          isReturn: false,
        })
        pushTo.push(...elementTypeItem)
      })
    }
  } else if (reflectionType.type === "intersection") {
    const parentKey = wrapObject
      ? componentItem.push(formatParameter())
      : undefined
    reflectionType.types.forEach((childType) => {
      const childParameter = getReflectionTypeParameters({
        reflectionType: childType,
        project,
        level: level + 1,
        maxLevel,
        isReturn: false,
      })

      parentKey
        ? componentItem[parentKey - 1].children?.push(...childParameter)
        : componentItem.push(...childParameter)
    })
  } else if (reflectionType.type === "reflection") {
    const parentKey =
      type === "`object`" && typeName === "object"
        ? undefined
        : componentItem.push(formatParameter())
    reflectionType.declaration.children?.forEach((childItem) => {
      const childParameter = reflectionComponentFormatter({
        reflection: childItem as DeclarationReflection,
        level,
        maxLevel,
        project,
      })

      parentKey
        ? componentItem[parentKey - 1].children?.push(childParameter)
        : componentItem.push(childParameter)
    })
  } else {
    const parentKey = wrapObject
      ? componentItem.push(formatParameter())
      : undefined
    // put type as the only component.
    parentKey
      ? componentItem[parentKey - 1].children?.push(formatParameter())
      : componentItem.push(formatParameter())
  }

  return componentItem
}

export function getReturnComment(comment: Comment): string {
  if (!comment.blockTags?.length) {
    return ""
  }

  return comment.blockTags
    .filter((tag) => tag.tag === "@returns")
    .map((tag) => Handlebars.helpers.comment(tag.content))
    .join("\n\n")
}

export function loadComment(
  reflectionTypeName: string,
  project: ProjectReflection
): string {
  // try to load reflection from project
  const reflection = getProjectChild(project, reflectionTypeName)
  if (reflection) {
    return (
      reflection.comment?.summary
        .map((summaryPart) => summaryPart.text)
        .join("\n\n") || ""
    )
  }

  return ""
}

export function isOnlyVoid(reflectionTypes: SomeType[]) {
  return reflectionTypes.every(
    (type) => type.type === "intrinsic" && type.name === "void"
  )
}
