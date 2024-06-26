import * as Handlebars from "handlebars"
import { DeclarationReflection } from "typedoc"
import { isDmlEntity } from "utils"

export default function () {
  Handlebars.registerHelper(
    "ifDmlEntity",
    function (this: DeclarationReflection, options: Handlebars.HelperOptions) {
      return isDmlEntity(this) ? options.fn(this) : options.inverse(this)
    }
  )
}
