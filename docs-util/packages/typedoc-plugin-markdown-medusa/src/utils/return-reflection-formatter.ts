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
  const typeName = getType({
    reflectionType,
    collapse: "object",
    wrapBackticks: false,
    escape: false,
    hideLink: true,
    project,
    getRelativeUrlMethod: Handlebars.helpers.relativeURL,
  })
  // if (
  //   typeName === "Record&#60;string, unknown&#62; \\| PaymentProcessorError"
  // ) {
  //   console.log(reflectionType)
  // }
  const type = getType({
    reflectionType: reflectionType,
    collapse: "object",
    project,
    escape: true,
    getRelativeUrlMethod: Handlebars.helpers.relativeURL,
  })
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
        getProjectChild(project, reflectionType.name)) as DeclarationReflection
      if (reflection) {
        const reflectionChildren = canRetrieveChildren
          ? reflection.children ||
            getTypeChildren(reflectionType, project, level)
          : undefined
        if (reflectionChildren?.length) {
          reflectionChildren.forEach((childItem) => {
            componentItem.push(
              reflectionComponentFormatter({
                reflection: childItem as DeclarationReflection,
                level,
                maxLevel,
                project,
              })
            )
          })
        } else {
          componentItem.push(
            reflectionComponentFormatter({
              reflection,
              level,
              maxLevel,
              project,
            })
          )
        }
      } else {
        componentItem.push({
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
