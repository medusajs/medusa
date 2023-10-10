import { Comment, DeclarationReflection, ReflectionType } from "typedoc"
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
  let item = `${prefix} \`${reflection.name}\`: `
  const defaultValue = getDefaultValue(reflection)

  if (defaultValue || reflection.flags.isOptional) {
    item += `(${reflection.flags.isOptional ? "optional" : ""}${
      reflection.flags.isOptional && defaultValue ? "," : ""
    }${defaultValue ? `default: ${defaultValue}` : ""}) `
  }

  const comments = getComments(reflection)

  if (comments) {
    item += stripLineBreaks(Handlebars.helpers.comments(comments))
    const itemChildren: string[] = []
    comments.summary.forEach((commentSummary) => {
      if ("target" in commentSummary) {
        const targetReflection = commentSummary.target as DeclarationReflection
        if (targetReflection.children && level + 1 <= MAX_LEVEL) {
          targetReflection.children.forEach((childItem) => {
            itemChildren.push(reflectionFomatter(childItem, level + 1))
          })
        }
      }
    })
    if (itemChildren.length) {
      // TODO maybe we should check the type of the reflection and replace
      // `properties` with the text that makes sense for the type.
      item += ` ${
        reflection.type?.type === "array"
          ? "Its items accept the following properties"
          : "It accepts the following properties"
      }:\n${itemChildren.join("\n")}`
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
