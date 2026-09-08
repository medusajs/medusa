import Handlebars from "handlebars"
import { DeclarationReflection } from "typedoc"
import { isDmlEntity } from "utils"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifDmlEntity",
    function (this: DeclarationReflection, options: Handlebars.HelperOptions) {
      const { internalType } = theme.getFormattingOptionsForLocation()
      return isDmlEntity(this) || internalType === "model-ref"
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
