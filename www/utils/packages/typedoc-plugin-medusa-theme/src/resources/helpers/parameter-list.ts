import Handlebars from "handlebars"
import { ReflectionParameterType } from "../../types.js"
import { parseParams } from "../../utils/params-utils.js"
import reflectionFormatter from "../../utils/reflection-formatter.js"

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
