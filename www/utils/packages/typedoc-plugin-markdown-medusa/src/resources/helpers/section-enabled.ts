import { SectionKey } from "types"
import { MarkdownTheme } from "../../theme"
import * as Handlebars from "handlebars"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "sectionEnabled",
    function (sectionName: string): boolean {
      const { sections } = theme.getFormattingOptionsForLocation()

      return (
        !sections ||
        !(sectionName in sections) ||
        sections[sectionName as SectionKey] ||
        false
      )
    }
  )
}
