import { DeclarationReflection } from "typedoc"
import * as Handlebars from "handlebars"

export default function () {
  Handlebars.registerHelper(
    "hasMoreThanOneSignature",
    function (model: DeclarationReflection) {
      return (model.signatures?.length || 0) > 1
    }
  )
}
