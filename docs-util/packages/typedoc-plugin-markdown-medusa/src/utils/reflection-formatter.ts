import { Comment, ReflectionKind, ReflectionType } from "typedoc"
import * as Handlebars from "handlebars"
import { stripCode, stripLineBreaks } from "../utils"
import { Parameter, ParameterStyle, ReflectionParameterType } from "../types"
import getType, { getReflectionType } from "./type-utils"
import { getTypeChildren } from "utils"
import { MarkdownTheme } from "../theme"

const ALLOWED_KINDS: ReflectionKind[] = [
  ReflectionKind.EnumMember,
  ReflectionKind.TypeParameter,
  ReflectionKind.Property,
  ReflectionKind.Parameter,
  ReflectionKind.TypeAlias,
  ReflectionKind.TypeLiteral,
  ReflectionKind.Variable,
  ReflectionKind.Reference,
]

export default function reflectionFormatter(
  reflection: ReflectionParameterType,
  type: ParameterStyle = "table",
  level = 1,
  maxLevel?: number | undefined
): string | Parameter {
  switch (type) {
    case "list":
      return reflectionListFormatter(reflection, level)
    case "component":
      return reflectionComponentFormatter(reflection, level, maxLevel)
    case "table":
      return reflectionTableFormatter(reflection)
    default:
      return ""
  }
}

export function reflectionListFormatter(
  reflection: ReflectionParameterType,
  level = 1,
  maxLevel?: number | undefined
): string {
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
  }

  const hasChildren = "children" in reflection && reflection.children?.length

  if (
    (reflection.type || hasChildren) &&
    level + 1 <= (maxLevel || MarkdownTheme.MAX_LEVEL)
  ) {
    const children = hasChildren
      ? reflection.children
      : getTypeChildren(reflection.type!, reflection.project)
    const itemChildren: string[] = []
    let itemChildrenKind: ReflectionKind | null = null
    children?.forEach((childItem) => {
      if (!itemChildrenKind) {
        itemChildrenKind = childItem.kind
      }
      itemChildren.push(reflectionListFormatter(childItem, level + 1))
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

export function reflectionComponentFormatter(
  reflection: ReflectionParameterType,
  level = 1,
  maxLevel?: number | undefined
): Parameter {
  const defaultValue = getDefaultValue(reflection) || ""
  const optional =
    reflection.flags.isOptional || reflection.kind === ReflectionKind.EnumMember
  const comments = getComments(reflection)
  const componentItem: Parameter = {
    name: reflection.name,
    type: reflection.type
      ? getType(reflection.type, "object")
      : getReflectionType(reflection, "object"),
    description: comments
      ? stripLineBreaks(Handlebars.helpers.comments(comments, true, false))
      : "",
    optional,
    defaultValue,
    expandable: reflection.comment?.hasModifier(`@expandable`) || false,
    featureFlag: Handlebars.helpers.featureFlag(reflection.comment),
    children: [],
  }

  const hasChildren = "children" in reflection && reflection.children?.length

  if (
    (reflection.type || hasChildren) &&
    level + 1 <= (maxLevel || MarkdownTheme.MAX_LEVEL)
  ) {
    const children = hasChildren
      ? reflection.children
      : getTypeChildren(reflection.type!, reflection.project)

    children
      ?.filter((childItem) => childItem.kindOf(ALLOWED_KINDS))
      .forEach((childItem) => {
        componentItem.children?.push(
          reflectionComponentFormatter(childItem, level + 1, maxLevel)
        )
      })
  }

  return componentItem
}

export function reflectionTableFormatter(
  parameter: ReflectionParameterType
): string {
  const showDefaults = hasDefaultValues([parameter])

  const hasComments = !!parameter.comment?.hasVisibleComponent()

  const row: string[] = []

  const nbsp = " " // ? <== Unicode no-break space character
  const rest = parameter.flags.isRest ? "..." : ""
  const optional = parameter.flags.isOptional ? "?" : ""

  const isDestructuredParam = parameter.name == "__namedParameters"
  const isDestructuredParamProp =
    parameter.name.startsWith("__namedParameters.")

  if (isDestructuredParam) {
    row.push(`\`${rest}«destructured»\``)
  } else if (isDestructuredParamProp) {
    row.push(`›${nbsp}\`${rest}${parameter.name.slice(18)}${optional}\``)
  } else {
    row.push(`\`${rest}${parameter.name}${optional}\``)
  }

  row.push(
    parameter.type
      ? Handlebars.helpers.type.call(parameter.type, "object")
      : getReflectionType(parameter, "object")
  )

  if (showDefaults) {
    row.push(getDefaultValue(parameter) || "")
  }
  if (hasComments) {
    const comments = getComments(parameter)
    if (comments) {
      row.push(
        stripLineBreaks(Handlebars.helpers.comments(comments)).replace(
          /\|/g,
          "\\|"
        )
      )
    } else {
      row.push("-")
    }
  }
  return `| ${row.join(" | ")} |\n`
}

export function getTableHeaders(
  parameters: ReflectionParameterType[],
  showTypeHeader?: boolean
): string[] {
  const showDefaults = hasDefaultValues(parameters)
  const hasComments = parameters.some(
    (parameter) => !!parameter.comment?.hasVisibleComponent()
  )
  const headers = ["Name"]

  if (showTypeHeader) {
    headers.push("Type")
  }

  if (showDefaults) {
    headers.push("Default value")
  }

  if (hasComments) {
    headers.push("Description")
  }

  return headers
}

export function getDefaultValue(
  parameter: ReflectionParameterType
): string | null {
  const defaultComment = parameter.comment?.getTag(`@defaultValue`)
  if (!("defaultValue" in parameter) && !defaultComment) {
    return null
  }

  return "defaultValue" in parameter &&
    parameter.defaultValue !== undefined &&
    parameter.defaultValue !== "..."
    ? `${parameter.defaultValue}`
    : defaultComment
    ? defaultComment.content.map((content) => stripCode(content.text)).join()
    : null
}

export function hasDefaultValues(parameters: ReflectionParameterType[]) {
  const defaultValues = (parameters as ReflectionParameterType[]).map(
    (param) =>
      "defaultValue" in param &&
      param.defaultValue !== "{}" &&
      param.defaultValue !== "..." &&
      !!param.defaultValue
  )

  return !defaultValues.every((value) => !value)
}

export function getComments(
  parameter: ReflectionParameterType
): Comment | undefined {
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
