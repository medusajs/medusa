import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("shouldExpandProperties", function (title: string) {
    const { currentTitleLevel } = theme
    const { expandProperties = false } = theme.getFormattingOptionsForLocation()

    return title === "Properties" && expandProperties && currentTitleLevel <= 3
  })
}
