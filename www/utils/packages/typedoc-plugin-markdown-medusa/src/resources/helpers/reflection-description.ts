import * as Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme"
import { Reflection } from "typedoc"
import { replaceTemplateVariables } from "../../utils/reflection-template-strings"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "reflectionDescription",
    function (this: Reflection) {
      const { reflectionDescription } = theme.getFormattingOptionsForLocation()

      // parse variables in description
      return replaceTemplateVariables(this, reflectionDescription)
    }
  )
}
