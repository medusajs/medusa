import {
  Comment,
  DeclarationReflection,
  ReflectionKind,
  ReflectionType,
} from "typedoc"
import * as Handlebars from "handlebars"
import { stripLineBreaks } from "../utils"
import { ReflectionParameterType } from "../types"

const MAX_LEVEL = 3

export default function reflectionFomatter(
  reflection: ReflectionParameterType,
  level = 1
) {
  const prefix = `${Array(level - 1)
    .fill("\t")
    .join("")}-`
  let item = `${prefix} \`${reflection.name}\``
  const defaultValue = getDefaultValue(reflection)
  const comments = getComments(reflection)

  if (defaultValue || reflection.flags.isOptional || comments) {
    item += ": "
  }

  if (defaultValue || reflection.flags.isOptional) {
    item += `(${reflection.flags.isOptional ? "optional" : ""}${
      reflection.flags.isOptional && defaultValue ? "," : ""
    }${defaultValue ? `default: ${defaultValue}` : ""}) `
  }

  if (comments) {
    item += stripLineBreaks(Handlebars.helpers.comments(comments))
    const itemChildren: string[] = []
    let itemChildrenKind: ReflectionKind | null = null
    comments.summary.forEach((commentSummary) => {
      if ("target" in commentSummary) {
        const targetReflection = commentSummary.target as DeclarationReflection
        if (targetReflection.children && level + 1 <= MAX_LEVEL) {
          targetReflection.children.forEach((childItem) => {
            if (itemChildrenKind === null) {
              itemChildrenKind = childItem.kind
            }
            itemChildren.push(reflectionFomatter(childItem, level + 1))
          })
        }
      }
    })
    if (itemChildren.length) {
      item += ` ${getItemExpandText(
        reflection.type?.type,
        itemChildrenKind
      )}:\n${itemChildren.join("\n")}`
    }
  }

  return item
}

function getDefaultValue(parameter: ReflectionParameterType): string | null {
  if (!("defaultValue" in parameter)) {
    return null
  }
  return parameter.defaultValue && parameter.defaultValue !== "..."
    ? `\`${parameter.defaultValue}\``
    : null
}

function getComments(parameter: ReflectionParameterType): Comment | undefined {
  if (parameter.type instanceof ReflectionType) {
    if (
      parameter.type?.declaration?.signatures &&
      parameter.type?.declaration?.signatures[0]?.comment
    ) {
      return parameter.type?.declaration?.signatures[0]?.comment
    }
  }
  return parameter.comment
}

// TODO we should add check for more types as necessary
function getItemExpandText(
  reflectionType?: string,
  childrenKind?: ReflectionKind | null
): string {
  switch (childrenKind) {
    case ReflectionKind.EnumMember:
      return "It can be one of the following values"
  }

  switch (reflectionType) {
    case "array":
      return "Its items accept the following properties"
    default:
      return "It accepts the following properties"
  }
}
