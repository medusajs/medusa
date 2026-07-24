import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("mdxImports", function () {
    if (!theme.mdxOutput) {
      return ""
    }

    const { mdxImports } = theme.getFormattingOptionsForLocation()

    return mdxImports?.join("\n") || ""
  })
}
