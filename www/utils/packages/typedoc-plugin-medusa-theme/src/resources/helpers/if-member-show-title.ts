import Handlebars from "handlebars"
import { DeclarationReflection } from "typedoc"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "ifMemberShowTitle",
    function (this: DeclarationReflection, options: Handlebars.HelperOptions) {
      return !this.hasOwnDocument ||
        (Handlebars.helpers.sectionEnabled("member_force_title") &&
          theme.location !== this.url)
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
