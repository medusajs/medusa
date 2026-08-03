import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("startSections", function () {
    const { startSections, shouldIncrementAfterStartSections } =
      theme.getFormattingOptionsForLocation()

    if (!startSections?.length) {
      return ""
    }

    const lineBreaks = "\n\n"
    const separator = `---${lineBreaks}`

    if (shouldIncrementAfterStartSections) {
      Handlebars.helpers.incrementCurrentTitleLevel()
    }

    return `${separator}${startSections.join(`${lineBreaks}${separator}`)}`
  })
}
