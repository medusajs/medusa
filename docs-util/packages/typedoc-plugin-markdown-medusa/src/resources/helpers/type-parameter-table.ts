import * as Handlebars from "handlebars"
import { TypeParameterReflection } from "typedoc"
import { stripLineBreaks } from "../../utils"

export default function () {
  Handlebars.registerHelper(
    "typeParameterTable",
    function (this: TypeParameterReflection[]) {
      return table(this)
    }
  )
}

function table(parameters: TypeParameterReflection[]) {
  const showTypeCol = hasTypes(parameters)

  const comments = parameters.map(
    (param: TypeParameterReflection) => !!param.comment?.hasVisibleComponent()
  )

  const hasComments = !comments.every((value) => !value)

  const headers = ["Name"]

  if (showTypeCol) {
    headers.push("Type")
  }

  if (hasComments) {
    headers.push("Description")
  }

  const rows = parameters.map((parameter: TypeParameterReflection) => {
    const row: string[] = []

    row.push(`\`${parameter.name}\``)

    if (showTypeCol) {
      const typeCol: string[] = []
      if (!parameter.type && !parameter.default) {
        typeCol.push(`\`${parameter.name}\``)
      }
      if (parameter.type) {
        typeCol.push(
          `extends ${Handlebars.helpers.type.call(parameter.type, "object")}`
        )
      }
      if (parameter.default) {
        if (parameter.type) {
          typeCol.push(" = ")
        }
        typeCol.push(Handlebars.helpers.type.call(parameter.default))
      }
      row.push(typeCol.join(""))
    }

    if (hasComments) {
      if (parameter.comment?.summary) {
        row.push(
          stripLineBreaks(
            Handlebars.helpers.comment(parameter.comment?.summary)
          ).replace(/\|/g, "\\|")
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

function hasTypes(parameters: TypeParameterReflection[]) {
  const types = (parameters as TypeParameterReflection[]).map(
    (param) => !!param.type || !!param.default
  )
  return !types.every((value) => !value)
}
