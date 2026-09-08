import Handlebars from "handlebars"
import { PageEvent } from "typedoc"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifNamedAnchors",
    function (this: PageEvent, options: Handlebars.HelperOptions) {
      return theme.namedAnchors ? options.fn(this) : options.inverse(this)
    }
  )
}
