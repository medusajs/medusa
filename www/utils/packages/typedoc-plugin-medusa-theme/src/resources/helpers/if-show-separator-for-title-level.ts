import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifShowSeparatorForTitleLevel",
    function (this: unknown, options: Handlebars.HelperOptions) {
      const { currentTitleLevel } = theme

      return currentTitleLevel <= 2 ? options.fn(this) : options.inverse(this)
    }
  )
}
