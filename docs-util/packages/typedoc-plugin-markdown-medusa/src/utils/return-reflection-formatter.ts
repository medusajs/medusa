import {
  Comment,
  DeclarationReflection,
  ProjectReflection,
  ReflectionFlags,
  SomeType,
  TypeParameterReflection,
} from "typedoc"
import * as Handlebars from "handlebars"
import getType from "./type-utils"
import { Parameter } from "../types"
import {
  getDefaultValue,
  reflectionComponentFormatter,
} from "./reflection-formatter"
import { MarkdownTheme } from "../theme"

type ReturnReflectionComponentFormatterParams = {
  reflectionType: SomeType
  project: ProjectReflection
  comment?: Comment
  level: number
  maxLevel?: number | undefined
}

export function returnReflectionComponentFormatter({
  reflectionType,
  project,
  comment,
  level = 1,
  maxLevel,
}: ReturnReflectionComponentFormatterParams): Parameter[] {
  const typeName = getType(reflectionType, "object", false, true)
  const type = getType(reflectionType, "object")
  const componentItem: Parameter[] = []
  const canRetrieveChildren = level + 1 <= (maxLevel || MarkdownTheme.MAX_LEVEL)
  if (reflectionType.type === "reference") {
    if (reflectionType.typeArguments || reflectionType.refersToTypeParameter) {
      const parentKey = componentItem.push({
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
        description: comment ? getReturnComment(comment) : "",
        expandable: comment?.hasModifier(`@expandable`) || false,
        featureFlag: Handlebars.helpers.featureFlag(comment),
        children: [],
      })
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
          const typeArgComponent = returnReflectionComponentFormatter({
            reflectionType: reflectionTypeArg,
            project,
            level: level + 1,
            maxLevel,
          })

          componentItem[parentKey - 1].children?.push(...typeArgComponent)
        })
      }
    } else {
      const reflection = (reflectionType.reflection ||
        project.getChildByName(reflectionType.name)) as DeclarationReflection
      if (reflection) {
        if (reflection.children?.length) {
          reflection.children.forEach((childItem) => {
            componentItem.push(
              reflectionComponentFormatter(
                childItem as DeclarationReflection,
                level,
                maxLevel
              )
            )
          })
        } else {
          componentItem.push(
            reflectionComponentFormatter(
              reflection as DeclarationReflection,
              level,
              maxLevel
            )
          )
        }
      }
    }
  } else if (reflectionType.type === "array") {
    const parentKey = componentItem.push({
      name:
        "name" in reflectionType ? (reflectionType.name as string) : typeName,
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
      description: comment ? getReturnComment(comment) : "",
      expandable: comment?.hasModifier(`@expandable`) || false,
      featureFlag: Handlebars.helpers.featureFlag(comment),
      children: [],
    })
    if (canRetrieveChildren) {
      const elementTypeItem = returnReflectionComponentFormatter({
        reflectionType: reflectionType.elementType,
        project,
        level: level + 1,
        maxLevel,
      })
      componentItem[parentKey - 1].children?.push(...elementTypeItem)
    }
  } else if (reflectionType.type === "tuple") {
    let pushTo: Parameter[] = []
    if (level === 1) {
      const parentKey = componentItem.push({
        name:
          "name" in reflectionType ? (reflectionType.name as string) : typeName,
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
        description: comment ? getReturnComment(comment) : "",
        expandable: comment?.hasModifier(`@expandable`) || false,
        featureFlag: Handlebars.helpers.featureFlag(comment),
        children: [],
      })
      pushTo = componentItem[parentKey - 1].children!
    } else {
      pushTo = componentItem
    }
    if (canRetrieveChildren) {
      reflectionType.elements.forEach((element) => {
        const elementTypeItem = returnReflectionComponentFormatter({
          reflectionType: element,
          project,
          level: level + 1,
          maxLevel,
        })
        pushTo.push(...elementTypeItem)
      })
    }
  } else {
    // put type as the only component.
    componentItem.push({
      name: "name" in reflectionType ? reflectionType.name : typeName,
      type,
      optional:
        "flags" in reflectionType
          ? (reflectionType.flags as ReflectionFlags).isOptional
          : true,
      defaultValue:
        "declaration" in reflectionType
          ? getDefaultValue(reflectionType.declaration) || ""
          : "",
      description: comment ? getReturnComment(comment) : "",
      expandable: comment?.hasModifier(`@expandable`) || false,
      featureFlag: Handlebars.helpers.featureFlag(comment),
      children: [],
    })
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

export function isOnlyVoid(reflectionTypes: SomeType[]) {
  return reflectionTypes.every(
    (type) => type.type === "intrinsic" && type.name === "void"
  )
}
