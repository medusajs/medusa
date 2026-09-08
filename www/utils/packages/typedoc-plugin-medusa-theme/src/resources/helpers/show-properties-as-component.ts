import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "showPropertiesAsComponent",
    function (title: string) {
      const { parameterStyle } = theme.getFormattingOptionsForLocation()

      return parameterStyle === "component" && title === "Properties"
    }
  )
}
