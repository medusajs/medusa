import Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme.js"
import { stringify } from "yaml"
import { Reflection } from "typedoc"
import { getPageFrontmatter } from "../../utils/frontmatter.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("frontmatter", function (this: Reflection) {
    const { frontmatterData } = theme.getFormattingOptionsForLocation()

    const resolvedFrontmatter = getPageFrontmatter({
      frontmatterData,
      reflection: this,
    })

    if (!resolvedFrontmatter) {
      return ""
    }

    return `---\n${stringify(resolvedFrontmatter).trim()}\n---\n\n`
  })
}
