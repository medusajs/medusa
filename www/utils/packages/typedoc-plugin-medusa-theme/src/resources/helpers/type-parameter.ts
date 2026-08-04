import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"
import { TypeParameterReflection } from "typedoc"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "typeParameter",
    function (
      this: TypeParameterReflection[],
      options: Handlebars.HelperOptions
    ) {
      const { parameterStyle } = theme.getFormattingOptionsForLocation()

      if (parameterStyle === "list") {
        return Handlebars.helpers.typeParameterList.call(this)
      } else if (parameterStyle === "component") {
        return Handlebars.helpers.typeParameterComponent.call(this, options)
      } else {
        return Handlebars.helpers.typeParameterTable.call(this)
      }
    }
  )
}
