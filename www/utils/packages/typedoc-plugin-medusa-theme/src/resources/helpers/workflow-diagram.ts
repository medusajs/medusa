import { MarkdownTheme } from "../../theme.js"
import Handlebars from "handlebars"
import {
  DocumentReflection,
  ReflectionKind,
  SignatureReflection,
} from "typedoc"
import { formatWorkflowDiagramComponent } from "../../utils/format-workflow-diagram-component.js"
import { findReflectionInNamespaces, getProjectChild } from "utils"

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
            })
          )
        }
      })

      return (
        `${Handlebars.helpers.titleLevel()} Steps\n\n` +
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
}: {
  document: DocumentReflection
  theme: MarkdownTheme
  index: number
}) {
  const type = document.comment?.modifierTags.has("@workflowStep")
    ? "workflow"
    : document.comment?.modifierTags.has("@hook")
      ? "hook"
      : "step"

  const namespaceRefl = theme.project
    ? findReflectionInNamespaces(
        theme.project
          .getChildrenByKind(ReflectionKind.Module)
          .find((moduleRef) => moduleRef.name === "core-flows") ||
          theme.project,
        document.name
      )
    : undefined

  const associatedReflection =
    namespaceRefl ||
    (theme.project ? getProjectChild(theme.project, document.name) : undefined)
  const depth = getDocumentTagValue(document, `@workflowDepth`) || `${index}`

  const summary =
    associatedReflection?.comment?.blockTags.find(
      (tag) => tag.tag === `@summary`
    )?.content || associatedReflection?.comment?.summary

  return {
    type,
    name: document.name,
    description: summary
      ? Handlebars.helpers.comment(summary)
      : associatedReflection?.comment
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
