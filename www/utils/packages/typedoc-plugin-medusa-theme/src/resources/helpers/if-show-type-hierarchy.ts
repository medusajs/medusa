import Handlebars from "handlebars"
import { DeclarationHierarchy, DeclarationReflection } from "typedoc"
import { PageEvent } from "typedoc"

export default function () {
  Handlebars.registerHelper(
    "ifShowTypeHierarchy",
    function (
      this: PageEvent<DeclarationReflection>,
      options: Handlebars.HelperOptions
    ) {
      const typeHierarchy = this.model?.typeHierarchy as DeclarationHierarchy
      return typeHierarchy && typeHierarchy.next
        ? options.fn(this)
        : options.inverse(this)
    }
  )
}
