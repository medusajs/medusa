import { DeclarationReflection } from "typedoc"
import Handlebars from "handlebars"
import getCorrectDeclarationReflection from "../../utils/get-correct-declaration-reflection.js"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "hasMoreThanOneSignature",
    function (model: DeclarationReflection) {
      model = getCorrectDeclarationReflection(model, theme) || model
      return (model?.signatures?.length || 0) > 1
    }
  )
}
