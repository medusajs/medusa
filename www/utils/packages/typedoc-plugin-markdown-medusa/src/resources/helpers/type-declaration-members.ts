import * as Handlebars from "handlebars"
import { DeclarationReflection, ReflectionType } from "typedoc"
import { MarkdownTheme } from "../../theme"
import { parseParams } from "../../utils/params-utils"
import { Parameter, ReflectionParameterType } from "../../types"
import reflectionFormatter from "../../utils/reflection-formatter"
import { escapeChars, stripLineBreaks } from "utils"
import { formatParameterComponent } from "../../utils/format-parameter-component"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "typeDeclarationMembers",
    function (
      this: DeclarationReflection[],
      options: Handlebars.HelperOptions
    ) {
      const { parameterComponent, maxLevel, parameterComponentExtraProps } =
        theme.getFormattingOptionsForLocation()
      const comments = this.map(
        (param) => !!param.comment?.hasVisibleComponent()
      )
      const hasComments = !comments.every((value) => !value)

      const properties = this.reduce(
        (acc: ReflectionParameterType[], current: ReflectionParameterType) =>
          parseParams(current, acc, false),
        []
      ) as DeclarationReflection[]

      let result = ""
      switch (theme.objectLiteralTypeDeclarationStyle) {
        case "list": {
          result = getListMarkdownContent(properties)
          break
        }
        case "component": {
          result = getComponentMarkdownContent({
            properties,
            parameterComponent,
            maxLevel,
            parameterComponentExtraProps,
            sectionTitle: options.hash.sectionTitle,
          })
          break
        }
        case "table": {
          result = getTableMarkdownContent(properties, hasComments)
          break
        }
      }
      return result
    }
  )
}

function getListMarkdownContent(properties: DeclarationReflection[]) {
  const items = properties.map((property) =>
    reflectionFormatter({
      reflection: property,
      type: "list",
    })
  )

  return items.join("\n")
}

function getComponentMarkdownContent({
  properties,
  parameterComponent,
  maxLevel,
  parameterComponentExtraProps,
  sectionTitle,
}: {
  properties: DeclarationReflection[]
  parameterComponent?: string
  maxLevel?: number | undefined
  parameterComponentExtraProps?: Record<string, unknown>
  sectionTitle: string
}) {
  const parameters = properties.map((property) =>
    reflectionFormatter({
      reflection: property,
      type: "component",
      level: 1,
      maxLevel,
    })
  )

  return formatParameterComponent({
    parameterComponent,
    componentItems: parameters as Parameter[],
    extraProps: parameterComponentExtraProps,
    sectionTitle,
  })
}

function getTableMarkdownContent(
  properties: DeclarationReflection[],
  hasComments: boolean
) {
  const headers = ["Name", "Type"]

  if (hasComments) {
    headers.push("Description")
  }
  const rows = properties.map((property) => {
    const propertyType = getPropertyType(property)
    const row: string[] = []
    const nameCol: string[] = []
    const name =
      property.name.match(/[\\`\\|]/g) !== null
        ? escapeChars(getName(property))
        : `\`${getName(property)}\``
    nameCol.push(name)
    row.push(nameCol.join(" "))
    row.push(
      Handlebars.helpers.type.call(propertyType).replace(/(?<!\\)\|/g, "\\|")
    )

    if (hasComments) {
      const comments = getComments(property)
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
  })

  const output = `\n| ${headers.join(" | ")} |\n| ${headers
    .map(() => ":------")
    .join(" | ")} |\n${rows.join("")}`
  return output
}

function getPropertyType(property: DeclarationReflection) {
  if (property.getSignature) {
    return property.getSignature.type
  }
  if (property.setSignature) {
    return property.setSignature.type
  }
  return property.type ? property.type : property
}

function getName(property: DeclarationReflection) {
  const md: string[] = []
  if (property.flags.isRest) {
    md.push("...")
  }
  if (property.getSignature) {
    md.push(`get ${property.getSignature.name}()`)
  } else if (property.setSignature) {
    md.push(
      `set ${
        property.setSignature.name
      }(${property.setSignature.parameters?.map((parameter) => {
        return `${parameter.name}:${Handlebars.helpers.type.call(
          parameter.type,
          "all",
          false
        )}`
      })})`
    )
  } else {
    md.push(property.name)
  }
  if (property.flags.isOptional) {
    md.push("?")
  }
  return md.join("")
}

function getComments(property: DeclarationReflection) {
  if (property.type instanceof ReflectionType) {
    if (property.type?.declaration?.signatures) {
      return property.type?.declaration.signatures[0].comment
    }
  }
  if (property.signatures?.length) {
    return property.signatures[0].comment
  }
  return property.comment
}
