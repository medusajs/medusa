import Handlebars from "handlebars"
import {
  DeclarationReflection,
  ProjectReflection,
  ReflectionGroup,
  ReflectionKind,
} from "typedoc"
import { MarkdownTheme } from "../../theme.js"
import { escapeChars } from "utils"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "toc",
    function (this: ProjectReflection | DeclarationReflection) {
      const md: string[] = []

      const { hideInPageTOC } = theme
      const { hideTocHeaders, reflectionGroupRename = {} } =
        theme.getFormattingOptionsForLocation()

      const isNamespaceVisible =
        this.kind === ReflectionKind.Namespace &&
        theme.getMappings(this as DeclarationReflection)[
          ReflectionKind.Namespace
        ]
      const isVisible =
        isNamespaceVisible ||
        this.groups?.some((group) => {
          return group.allChildrenHaveOwnDocument()
        })

      function pushGroup(group: ReflectionGroup, md: string[]) {
        const children = group.children
          .sort((childA, childB) => {
            return childA.name.localeCompare(childB.name)
          })
          .map(
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
        this.groups
          ?.sort((groupA, groupB) => {
            return groupA.title.localeCompare(groupB.title)
          })
          .forEach((group) => {
            const groupTitle = Object.hasOwn(reflectionGroupRename, group.title)
              ? reflectionGroupRename[group.title]
              : group.title
            if (group.categories) {
              group.categories
                .sort((catA, catB) => {
                  return catA.title.localeCompare(catB.title)
                })
                .forEach((category) => {
                  md.push(`${headingLevel} ${category.title} ${groupTitle}\n\n`)
                  pushGroup(category as ReflectionGroup, md)
                  md.push("\n")
                })
            } else {
              if (!hideInPageTOC || isVisible) {
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
