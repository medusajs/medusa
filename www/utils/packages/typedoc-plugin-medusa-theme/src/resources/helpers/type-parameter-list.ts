import Handlebars from "handlebars"
import { TypeParameterReflection } from "typedoc"
import reflectionFormatter from "../../utils/reflection-formatter.js"

export default function () {
  Handlebars.registerHelper(
    "typeParameterList",
    function (this: TypeParameterReflection[]) {
      return list(this)
    }
  )
}

function list(parameters: TypeParameterReflection[]) {
  const items = parameters.map((parameter) =>
    reflectionFormatter({
      reflection: parameter,
      type: "list",
    })
  )

  return items.join("\n")
}
