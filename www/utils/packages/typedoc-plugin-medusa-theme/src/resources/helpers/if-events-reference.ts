import Handlebars from "handlebars"
import { Reflection } from "typedoc"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifEventsReference",
    function (this: Reflection, options: Handlebars.HelperOptions) {
      const { isEventsReference = false } =
        theme.getFormattingOptionsForLocation()

      return isEventsReference ? options.fn(this) : options.inverse(this)
    }
  )
}
