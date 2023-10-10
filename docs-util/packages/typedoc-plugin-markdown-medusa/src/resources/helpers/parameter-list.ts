import * as Handlebars from "handlebars"
import reflectionFomatter from "../../utils/reflection-formatter"
import { ReflectionParameterType } from "../../types"
import { parseParams } from "../../utils/params-utils"

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
    return reflectionFomatter(parameter)
  })

  return items.join("\n")
}
