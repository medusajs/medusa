import { MarkdownTheme } from "../../theme.js"
import Handlebars from "handlebars"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("incrementCurrentTitleLevel", function () {
    const { currentTitleLevel } = theme
    theme.setCurrentTitleLevel(currentTitleLevel + 1)
  })
}
