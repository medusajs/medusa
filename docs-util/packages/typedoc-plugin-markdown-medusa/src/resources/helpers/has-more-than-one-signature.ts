import { DeclarationReflection } from "typedoc"
import * as Handlebars from "handlebars"
import getCorrectDeclarationReflection from "../../utils/get-correct-declaration-reflection"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "hasMoreThanOneSignature",
    function (model: DeclarationReflection) {
      model = getCorrectDeclarationReflection(model, theme) || model
      return (model?.signatures?.length || 0) > 1
    }
  )
}
