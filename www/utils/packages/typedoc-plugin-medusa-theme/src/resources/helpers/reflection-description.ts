import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"
import { Reflection } from "typedoc"
import { replaceTemplateVariables } from "../../utils/reflection-template-strings.js"

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
