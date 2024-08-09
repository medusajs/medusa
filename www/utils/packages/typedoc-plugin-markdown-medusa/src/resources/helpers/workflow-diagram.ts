import { MarkdownTheme } from "../../theme"
import * as Handlebars from "handlebars"
import {
  DeclarationReflection,
  DocumentReflection,
  SignatureReflection,
} from "typedoc"
import { formatWorkflowDiagramComponent } from "../../utils/format-workflow-diagram-component"
import { tryToGetNamespace } from "../../utils/workflow-utils"
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

      const stepsNamespace = theme.project
        ? tryToGetNamespace(theme.project, "step")
        : undefined

      const workflowsNamespace = theme.project
        ? tryToGetNamespace(theme.project, "workflow")
        : undefined

      this.parent.documents.forEach((document, index) => {
        if (document.name === "when") {
          const condition = getDocumentTagValue(document, "@whenCondition")
          const depth = getDocumentTagValue(document, "@workflowDepth")

          const whenStep = {
            type: "when",
            condition,
            depth,
            steps: [] as Record<string, unknown>[],
          }

          document.children?.forEach((childDocument) => {
            whenStep.steps.push(
              getStep({
                document: childDocument,
                theme,
                index,
                namespaces: {
                  step: stepsNamespace,
                  workflow: workflowsNamespace,
                },
              })
            )
          })

          steps.push(whenStep)
        } else {
          steps.push(
            getStep({
              document,
              theme,
              index,
              namespaces: {
                step: stepsNamespace,
                workflow: workflowsNamespace,
              },
            })
          )
        }
      })

      return (
        `${Handlebars.helpers.titleLevel()} Diagram\n\n` +
        formatWorkflowDiagramComponent({
          component: workflowDiagramComponent,
          componentItem: {
            name: this.name,
            steps,
          },
        })
      )
    }
  )
}

function getStep({
  document,
  theme,
  index,
  namespaces,
}: {
  document: DocumentReflection
  theme: MarkdownTheme
  index: number
  namespaces: {
    step?: DeclarationReflection
    workflow?: DeclarationReflection
  }
}) {
  const type = document.comment?.modifierTags.has("@workflowStep")
    ? "workflow"
    : document.comment?.modifierTags.has("@hook")
      ? "hook"
      : "step"

  const stepNamespace =
    type === "step"
      ? namespaces.step
      : type === "workflow"
        ? namespaces.workflow
        : undefined

  const associatedReflection =
    stepNamespace?.getChildByName(document.name) ||
    (theme.project ? getProjectChild(theme.project, document.name) : undefined)
  const depth = getDocumentTagValue(document, `@workflowDepth`) || `${index}`

  return {
    type,
    name: document.name,
    description: associatedReflection?.comment
      ? Handlebars.helpers.comments(associatedReflection.comment, true)
      : "",
    link:
      type === "hook" || !associatedReflection?.url
        ? `#${document.name}`
        : Handlebars.helpers.relativeURL(associatedReflection.url),
    depth: parseInt(depth),
  }
}

function getDocumentTagValue(
  document: DocumentReflection,
  tag: `@${string}`
): string | undefined {
  return document.comment
    ?.getTag(tag)
    ?.content.find((tagContent) => tagContent.kind === "text")?.text
}
