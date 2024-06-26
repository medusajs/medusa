import {
  Comment,
  DeclarationReflection,
  ProjectReflection,
  ReferenceType,
  ReflectionKind,
  ReflectionType,
} from "typedoc"
import * as Handlebars from "handlebars"
import { stripCode } from "../utils"
import { Parameter, ParameterStyle, ReflectionParameterType } from "../types"
import {
  getReflectionType,
  getType,
  getTypeChildren,
  stripLineBreaks,
} from "utils"
import { MarkdownTheme } from "../theme"
import { getDmlProperties, isDmlEntity } from "utils"

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

type ReflectionFormatterOptions = {
  reflection: ReflectionParameterType
  level?: number
  maxLevel?: number | undefined
  project?: ProjectReflection
  type?: ParameterStyle
}

export default function reflectionFormatter({
  type = "table",
  ...options
}: ReflectionFormatterOptions): string | Parameter {
  switch (type) {
    case "list":
      return reflectionListFormatter(options)
    case "component":
      return reflectionComponentFormatter(options)
    case "table":
      return reflectionTableFormatter(options)
    default:
      return ""
  }
}

export function reflectionListFormatter({
  reflection,
  level = 1,
  maxLevel,
}: ReflectionFormatterOptions): string {
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
      : getTypeChildren({
          reflectionType: reflection.type!,
          project: reflection.project,
        })
    const itemChildren: string[] = []
    let itemChildrenKind: ReflectionKind | null = null
    children?.forEach((childItem: DeclarationReflection) => {
      if (!itemChildrenKind) {
        itemChildrenKind = childItem.kind
      }
      itemChildren.push(
        reflectionListFormatter({
          reflection: childItem,
          level: level + 1,
          maxLevel,
        })
      )
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

export function reflectionComponentFormatter({
  reflection,
  level = 1,
  maxLevel,
  project,
}: ReflectionFormatterOptions): Parameter {
  const defaultValue = getDefaultValue(reflection) || ""
  const optional =
    reflection.flags.isOptional || reflection.kind === ReflectionKind.EnumMember
  const comments = getComments(reflection)
  const componentItem: Parameter = {
    name: reflection.name,
    type: reflection.type
      ? getType({
          reflectionType: reflection.type,
          collapse: "object",
          project: reflection.project,
          escape: true,
          getRelativeUrlMethod: Handlebars.helpers.relativeURL,
        })
      : getReflectionType({
          reflectionType: reflection,
          collapse: "object",
          // escape: true,
          project: reflection.project,
          getRelativeUrlMethod: Handlebars.helpers.relativeURL,
        }),
    description: comments
      ? Handlebars.helpers.comments(comments, true, false)
      : "",
    optional,
    defaultValue,
    expandable: reflection.comment?.hasModifier(`@expandable`) || false,
    featureFlag: Handlebars.helpers.featureFlag(reflection.comment),
    children: [],
  }

  const hasChildren = "children" in reflection && reflection.children?.length

  if (reflection.variant === "declaration" && isDmlEntity(reflection)) {
    componentItem.children = getDmlProperties(
      reflection.type as ReferenceType
    ).map((childItem) =>
      reflectionComponentFormatter({
        reflection: childItem,
        level: level + 1,
        maxLevel,
        project,
      })
    )
  } else if (
    (reflection.type || hasChildren) &&
    level + 1 <= (maxLevel || MarkdownTheme.MAX_LEVEL)
  ) {
    const children = hasChildren
      ? reflection.children
      : getTypeChildren({
          reflectionType: reflection.type!,
          project: project || reflection.project,
          maxLevel,
        })

    children
      ?.filter((childItem: DeclarationReflection) =>
        childItem.kindOf(ALLOWED_KINDS)
      )
      .forEach((childItem: DeclarationReflection) => {
        componentItem.children?.push(
          reflectionComponentFormatter({
            reflection: childItem,
            level: level + 1,
            maxLevel,
            project,
          })
        )
      })
  }

  return componentItem
}

export function reflectionTableFormatter({
  reflection: parameter,
}: ReflectionFormatterOptions): string {
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
      : getReflectionType({
          reflectionType: parameter,
          collapse: "object",
          wrapBackticks: true,
          getRelativeUrlMethod: Handlebars.helpers.relativeURL,
        })
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
