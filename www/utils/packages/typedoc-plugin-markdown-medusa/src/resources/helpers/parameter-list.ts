import * as Handlebars from "handlebars"
import { ReflectionParameterType } from "../../types"
import { parseParams } from "../../utils/params-utils"
import reflectionFormatter from "../../utils/reflection-formatter"

export default function () {
  Handlebars.registerHelper(
    "parameterList",

    function (this: ReflectionParameterType[]) {
      return list(
        this.reduce(
          (acc: ReflectionParameterType[], current) =>
            parseParams(current, acc),
          []
        )
      )
    }
  )
}

function list(parameters: ReflectionParameterType[]) {
  const items = parameters.map((parameter) => {
    return reflectionFormatter({
      reflection: parameter,
      type: "list",
    })
  })

  return items.join("\n")
}
