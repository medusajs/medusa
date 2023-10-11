import * as Handlebars from "handlebars"
import { MarkdownTheme } from "../../theme"
import { stringify } from "yaml"
import { replaceTemplateVariables } from "../../utils/reflection-template-strings"
import { Reflection } from "typedoc"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("frontmatter", function (this: Reflection) {
    const { frontmatterData } = theme.getFormattingOptionsForLocation()

    if (!frontmatterData) {
      return ""
    }

    // format frontmatter data in case it has any template variables

    return `---\n${stringify(
      resolveFrontmatterVariables(frontmatterData, this)
    ).trim()}\n---\n\n`
  })
}

function resolveFrontmatterVariables(
  frontmatterData: Record<string, unknown>,
  reflection: Reflection
): Record<string, unknown> {
  const tempFrontmatterData = Object.assign({}, frontmatterData)
  Object.keys(tempFrontmatterData).forEach((key) => {
    const value = tempFrontmatterData[key]
    if (!value) {
      return
    }

    switch (typeof value) {
      case "object":
        tempFrontmatterData[key] = resolveFrontmatterVariables(
          value as Record<string, unknown>,
          reflection
        )
        break
      case "string":
        tempFrontmatterData[key] = replaceTemplateVariables(reflection, value)
    }
  })

  return tempFrontmatterData
}
