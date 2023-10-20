import * as Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme"
import { TypeParameterReflection } from "typedoc"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "typeParameter",
    function (this: TypeParameterReflection[]) {
      const { parameterStyle } = theme.getFormattingOptionsForLocation()

      if (parameterStyle === "list") {
        return Handlebars.helpers.typeParameterList.call(this)
      } else if (parameterStyle === "component") {
        return Handlebars.helpers.typeParameterComponent.call(this)
      } else {
        return Handlebars.helpers.typeParameterTable.call(this)
      }
    }
  )
}
