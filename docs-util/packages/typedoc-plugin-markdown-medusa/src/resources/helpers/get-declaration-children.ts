import * as Handlebars from "handlebars"
import { DeclarationReflection } from "typedoc"
import { getTypeChildren } from "utils"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "getDeclarationChildren",
    function (this: DeclarationReflection) {
      const { maxLevel } = theme.getFormattingOptionsForLocation()

      if (!this.children && !this.type) {
        return []
      }

      return (
        this.children ||
        getTypeChildren({
          reflectionType: this.type!,
          project: this.project,
          maxLevel,
        })
      )
    }
  )
}
