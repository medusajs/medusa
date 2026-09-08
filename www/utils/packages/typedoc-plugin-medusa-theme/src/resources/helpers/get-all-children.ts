import Handlebars from "handlebars"
import { DeclarationReflection, ReflectionGroup } from "typedoc"
import { getProjectChild } from "utils"
import { MarkdownTheme } from "../../theme.js"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("getAllChildren", function (this: ReflectionGroup) {
    const { sortMembers } = theme.getFormattingOptionsForLocation()
    if (!this.children) {
      return []
    }
    const children = [...this.children]
    const implementedTypes = (this.owningReflection as DeclarationReflection)
      .implementedTypes
    implementedTypes?.forEach((type) => {
      if (type.type !== "reference") {
        return
      }

      const referencedReflection = type.reflection
        ? type.reflection
        : getProjectChild(this.owningReflection.project, type.name)

      if (
        !referencedReflection ||
        !(referencedReflection instanceof DeclarationReflection)
      ) {
        return
      }

      const matchingGroup = referencedReflection.groups?.find(
        (group) => group.title === this.title
      )
      matchingGroup?.children?.forEach((child) => {
        if (
          !(child instanceof DeclarationReflection) ||
          children.find((c) => c.id === child.id || c.name === child.name)
        ) {
          return
        }
        children.push(child)
      })
    })

    if (sortMembers) {
      // sort alphabetically
      children.sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    }

    return children
  })
}
