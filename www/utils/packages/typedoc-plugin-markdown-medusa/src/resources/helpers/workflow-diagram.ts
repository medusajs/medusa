import { MarkdownTheme } from "../../theme"
import * as Handlebars from "handlebars"
import { SignatureReflection } from "typedoc"
import { formatWorkflowDiagramComponent } from "../../utils/format-workflow-diagram-component"
import { getProjectChild } from "utils"

export default function (theme: MarkdownTheme) {
  Handlebars.registerHelper(
    "workflowDiagram",
    function (this: SignatureReflection): string {
      const { workflowDiagramComponent } =
        theme.getFormattingOptionsForLocation()
      if (!this.parent?.documents?.length) {
        return ""
      }

      const steps: Record<string, unknown>[] = []

      this.parent.documents.forEach((document, index) => {
        const type = document.comment?.modifierTags.has("@workflowStep")
          ? "workflow"
          : document.comment?.modifierTags.has("@hook")
            ? "hook"
            : "step"

        const associatedReflection = theme.project
          ? getProjectChild(theme.project, document.name)
          : undefined

        steps.push({
          type,
          name: document.name,
          description: associatedReflection?.comment
            ? Handlebars.helpers.comments(associatedReflection.comment, true)
            : "",
          link:
            type === "hook" || !associatedReflection?.url
              ? `#${document.name}`
              : Handlebars.helpers.relativeURL(associatedReflection.url),
          // TODO change
          depth: index,
        })
      })

      return formatWorkflowDiagramComponent({
        component: workflowDiagramComponent,
        componentItem: {
          name: this.name,
          steps,
        },
      })
    }
  )
}
