import * as Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme"
import { DeclarationReference } from "typedoc"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "propertiesComponent",
    function (this: DeclarationReference) {
      console.log(this)
    }
  )
}
