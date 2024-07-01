import * as Handlebars from "handlebars"
import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionGroup,
} from "typedoc"
import { MarkdownTheme } from "../../theme"
import { escapeChars } from "utils"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "toc",
    function (this: ProjectReflection | DeclarationReflection) {
      const md: string[] = []

      const { hideInPageTOC } = theme
      const { hideTocHeaders } = theme.getFormattingOptionsForLocation()

      const isVisible = this.groups?.some((group) =>
        group.allChildrenHaveOwnDocument()
      )

      function pushGroup(group: ReflectionGroup, md: string[]) {
        const children = group.children.map(
          (child) =>
            `- [${escapeChars(child.name)}](${Handlebars.helpers.relativeURL(
              child.url
            )})`
        )
        md.push(children.join("\n"))
      }

      if ((!hideInPageTOC && this.groups) || (isVisible && this.groups)) {
        if (!hideInPageTOC) {
          md.push(`## Table of contents\n\n`)
        }
        const headingLevel = hideInPageTOC ? `##` : `###`
        this.groups?.forEach((group) => {
          const groupTitle = group.title
          if (group.categories) {
            group.categories.forEach((category) => {
              md.push(`${headingLevel} ${category.title} ${groupTitle}\n\n`)
              pushGroup(category as ReflectionGroup, md)
              md.push("\n")
            })
          } else {
            if (!hideInPageTOC || group.allChildrenHaveOwnDocument()) {
              if (!hideTocHeaders) {
                md.push(`${headingLevel} ${groupTitle}\n\n`)
              }
              pushGroup(group, md)
              md.push("\n")
            }
          }
        })
      }
      return md.length > 0 ? md.join("\n") : null
    }
  )
}
