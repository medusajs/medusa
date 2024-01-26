import * as Handlebars from "handlebars"
import { ReflectionKind, SignatureReflection } from "typedoc"
import getCorrectDeclarationReflection from "../../utils/get-correct-declaration-reflection"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifShowReturns",
    function (this: SignatureReflection, options: Handlebars.HelperOptions) {
      this.parent =
        getCorrectDeclarationReflection(this.parent, theme) || this.parent
      return this.type && !this.parent?.kindOf(ReflectionKind.Constructor)
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
