import {
  Comment,
  DeclarationReflection,
  ProjectReflection,
  ReflectionFlags,
  SomeType,
} from "typedoc"
import * as Handlebars from "handlebars"
import getType from "./type-utils"
import { Parameter } from "../types"
import {
  getDefaultValue,
  reflectionComponentFormatter,
} from "./reflection-formatter"
import { MarkdownTheme } from "../theme"

export function returnReflectionComponentFormatter(
  reflectionType: SomeType,
  project: ProjectReflection,
  comment?: Comment,
  level = 1,
  maxLevel?: number | undefined
): Parameter[] {
  const typeName = getType(reflectionType, "object", false)
  const type = getType(reflectionType, "object")
  const componentItem: Parameter[] = []
  if (reflectionType.type === "reference") {
    // put type name as a title and its referenced items as children.
    if (reflectionType.typeArguments) {
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
      if (
        !isOnlyVoid(reflectionType.typeArguments) &&
        level + 1 <= (maxLevel || MarkdownTheme.MAX_LEVEL)
      ) {
        reflectionType.typeArguments.forEach((typeArg) => {
          const typeArgComponent = returnReflectionComponentFormatter(
            typeArg,
            project,
            undefined,
            level + 1,
            maxLevel
          )
          if (typeArgComponent.length) {
            componentItem[parentKey - 1].children?.push(...typeArgComponent)
          }
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
    if (level + 1 <= (maxLevel || MarkdownTheme.MAX_LEVEL)) {
      const elementTypeItem = returnReflectionComponentFormatter(
        reflectionType.elementType,
        project,
        undefined,
        level + 1,
        maxLevel
      )
      if (elementTypeItem.length) {
        componentItem[parentKey - 1].children?.push(...elementTypeItem)
      }
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
    if (level + 1 <= (maxLevel || MarkdownTheme.MAX_LEVEL)) {
      reflectionType.elements.forEach((element) => {
        const elementTypeItem = returnReflectionComponentFormatter(
          element,
          project,
          undefined,
          level + 1,
          maxLevel
        )
        if (elementTypeItem.length) {
          pushTo.push(...elementTypeItem)
        }
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
