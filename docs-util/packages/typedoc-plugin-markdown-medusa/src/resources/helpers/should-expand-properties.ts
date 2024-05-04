import * as Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("shouldExpandProperties", function (title: string) {
    const { currentTitleLevel } = theme
    const { expandProperties = false } = theme.getFormattingOptionsForLocation()

    return title === "Properties" && expandProperties && currentTitleLevel <= 3
  })
}
