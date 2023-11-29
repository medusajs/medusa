import { MarkdownTheme } from "../../theme"
import * as Handlebars from "handlebars"
import { Reflection } from "typedoc"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("titleLevel", function (this: Reflection): string {
    const { currentTitleLevel } = theme

    // let titleLevel = currentTitleLevel

    // if (isChild) {
    //   titleLevel++
    //   theme.setCurrentTitleLevel(titleLevel + 1)
    // }

    return Array(currentTitleLevel).fill("#").join("")
  })
}
