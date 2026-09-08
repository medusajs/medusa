import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("endSections", function () {
    const { endSections } = theme.getFormattingOptionsForLocation()

    if (!endSections?.length) {
      return ""
    }

    const lineBreaks = "\n\n"
    const separator = `---${lineBreaks}`

    return `${separator}${endSections.join(`${lineBreaks}${separator}`)}`
  })
}
