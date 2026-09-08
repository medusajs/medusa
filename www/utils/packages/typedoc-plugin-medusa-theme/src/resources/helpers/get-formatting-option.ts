import { MarkdownTheme } from "../../theme.js"
import Handlebars from "handlebars"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "getFormattingOption",
    function (optionName: string): unknown {
      const options = theme.getFormattingOptionsForLocation()

      return optionName in options
        ? options[optionName as keyof typeof options]
        : null
    }
  )
}
