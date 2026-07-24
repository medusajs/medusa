import Handlebars from "handlebars"
import { PageEvent } from "typedoc"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifShowPageTitle",
    function (this: PageEvent, options: Handlebars.HelperOptions) {
      return theme.hidePageTitle ? options.inverse(this) : options.fn(this)
    }
  )
}
