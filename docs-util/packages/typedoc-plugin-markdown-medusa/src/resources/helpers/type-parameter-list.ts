import * as Handlebars from "handlebars"
import { TypeParameterReflection } from "typedoc"
import reflectionFomatter from "../../utils/reflection-formatter"

export default function () {
  Handlebars.registerHelper(
    "typeParameterList",
    function (this: TypeParameterReflection[]) {
      return list(this)
    }
  )
}

function list(parameters: TypeParameterReflection[]) {
  const items = parameters.map((parameter) => reflectionFomatter(parameter))

  return items.join("\n")
}
