import {
  Comment,
  DeclarationReflection,
  ReflectionKind,
  ProjectReflection,
  ReflectionType,
  SomeType,
} from "typedoc"
import * as Handlebars from "handlebars"
import { stripLineBreaks } from "../utils"
import { Parameter, ParameterStyle, ReflectionParameterType } from "../types"
import getType, { getReflectionType } from "./type-utils"

const MAX_LEVEL = 3

export default function reflectionFormatter(
  reflection: ReflectionParameterType,
  type: ParameterStyle = "table",
  level = 1
): string | Parameter {
  switch (type) {
    case "list":
      return reflectionListFormatter(reflection, level)
    case "component":
      return reflectionComponentFormatter(reflection, level)
    case "table":
      return reflectionTableFormatter(reflection)
    default:
      return ""
  }
}

export function reflectionListFormatter(
  reflection: ReflectionParameterType,
  level = 1
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

  if ((reflection.type || hasChildren) && level + 1 <= MAX_LEVEL) {
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
  level = 1
): Parameter {
  const defaultValue = getDefaultValue(reflection) || ""
  const optional = reflection.flags.isOptional
  const comments = getComments(reflection)
  const componentItem: Parameter = {
    name: reflection.name,
    type: reflection.type
      ? getType(reflection.type, "object")
      : getReflectionType(reflection, "object"),
    description: comments
      ? stripLineBreaks(Handlebars.helpers.comments(comments))
      : "",
    optional,
    defaultValue,
    children: [],
  }

  const hasChildren = "children" in reflection && reflection.children?.length

  if ((reflection.type || hasChildren) && level + 1 <= MAX_LEVEL) {
    const children = hasChildren
      ? reflection.children
      : getTypeChildren(reflection.type!, reflection.project)
    children?.forEach((childItem) => {
      componentItem.children?.push(
        reflectionComponentFormatter(childItem, level + 1)
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
  if (!("defaultValue" in parameter)) {
    return null
  }
  return parameter.defaultValue && parameter.defaultValue !== "..."
    ? `\`${parameter.defaultValue}\``
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

export function getTypeChildren(
  reflectionType: SomeType,
  project: ProjectReflection
) {
  let children: DeclarationReflection[] = []

  switch (reflectionType.type) {
    case "reference":
      // eslint-disable-next-line no-case-declarations
      const referencedReflection = project.getChildByName(reflectionType.name)

      if (
        referencedReflection instanceof DeclarationReflection &&
        referencedReflection.children
      ) {
        children = referencedReflection.children
      }
      break
    case "array":
      children = getTypeChildren(reflectionType.elementType, project)
  }

  return children
}
