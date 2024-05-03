import * as Handlebars from "handlebars"
import { DeclarationReflection, ReferenceReflection } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "ifIsReference",
    function (
      this: DeclarationReflection | ReferenceReflection,
      options: Handlebars.HelperOptions
    ) {
      return this instanceof ReferenceReflection
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
