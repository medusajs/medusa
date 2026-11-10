import Handlebars from "handlebars"
import { PageEvent } from "typedoc"
import { MarkdownTheme } from "../../theme.js"
import { getDisplayName } from "../../utils.js"
import { escapeChars, getReflectionUrl } from "utils"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper("breadcrumbs", function (this: PageEvent) {
    const { entryPoints, entryDocument, project, readme } = theme

    if (!project) {
      return ""
    }

    const hasReadmeFile = !readme.endsWith("none")
    const breadcrumbs: string[] = []
    const globalsName = entryPoints.length > 1 ? "Modules" : "Exports"
    breadcrumbs.push(
      this.url === entryDocument
        ? project.name
        : `[${getDisplayName(project)}](${Handlebars.helpers.relativeURL(
            entryDocument
          )})`
    )
    if (hasReadmeFile) {
      breadcrumbs.push(
        this.url === getReflectionUrl(project)
          ? globalsName
          : `[${globalsName}](${Handlebars.helpers.relativeURL("modules.md")})`
      )
    }
    const breadcrumbsOut = breadcrumb(this, this.model, breadcrumbs)
    return breadcrumbsOut
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function breadcrumb(page: PageEvent, model: any, md: string[]) {
  if (model && model.parent) {
    breadcrumb(page, model.parent, md)
    const modelUrl = getReflectionUrl(model)
    if (modelUrl) {
      md.push(
        page.url === modelUrl
          ? `${escapeChars(model.name)}`
          : `[${escapeChars(model.name)}](${Handlebars.helpers.relativeURL(
              modelUrl
            )})`
      )
    }
  }
  return md.join(" / ")
}
