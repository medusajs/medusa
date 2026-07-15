import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("shouldExpandDeclarationChildren", function () {
    const { currentTitleLevel } = theme
    const { expandMembers } = theme.getFormattingOptionsForLocation()

    return expandMembers && currentTitleLevel <= 3
  })
}
