import { MarkdownTheme } from "../../theme.js"
import Handlebars from "handlebars"
import { Reflection } from "typedoc"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("titleLevel", function (this: Reflection): string {
    const { currentTitleLevel } = theme

    return Array(currentTitleLevel).fill("#").join("")
  })
}
