import Handlebars from "handlebars"
import {
  DeclarationReflection,
  DocumentReflection,
  ReflectionKind,
  SignatureReflection,
} from "typedoc"
import {
  findReflectionInNamespaces,
  getProjectChild,
  getStepInputType,
  getStepOutputType,
  getWorkflowInputType,
  getWorkflowOutputType,
} from "utils"
import type { DocBlock, DocTypeListItem, DocWorkflowStep } from "types"
import { MarkdownTheme } from "../theme.js"
import { getReflectionTypeParameters } from "./reflection-type-parameters.js"
import { splitContentBlocks } from "./parse-code-tabs.js"

/**
 * Builds the blocks for a workflow signature page, mirroring the section order
 * of `member.workflow.hbs`: comment, examples (as structured `codeTabs`), the
 * steps `workflowDiagram`, and the input / output `TypeList`s.
 *
 * NOTE: workflow hooks and emitted-events sections are not yet emitted as
 * structured blocks (they build `<Table>` / nested markup in the MDX theme) —
 * tracked as a follow-up.
 */
export function buildWorkflowBlocks(
  theme: MarkdownTheme,
  signature: SignatureReflection
): DocBlock[] {
  const blocks: DocBlock[] = []

  const comment = getSignatureComment(signature)
  if (comment) {
    blocks.push({ kind: "markdown", html: comment })
  }

  // @deprecated + @since notes, then the locking note (member.workflow.hbs:
  // comment tags + version + workflowNotes, before the source link).
  blocks.push(...deprecatedNoteBlocks(signature))
  blocks.push(
    ...splitContentBlocks(String(Handlebars.helpers.version(signature) || ""))
  )
  blocks.push(
    ...splitContentBlocks(
      String(Handlebars.helpers.workflowNotes.call(signature) || "")
    )
  )

  if (theme.getFormattingOptionsForLocation().showSourceCodeLink) {
    const source = extractSourceLink(signature)
    if (source) {
      blocks.push({ kind: "sourceCodeLink", link: source })
    }
  }

  const examples = String(
    Handlebars.helpers.workflowExamples.call(signature) || ""
  )
  blocks.push(...splitContentBlocks(examples))

  const diagram = buildWorkflowDiagramBlock(theme, signature)
  if (diagram) {
    blocks.push({
      kind: "heading",
      level: 2,
      text: "Steps",
      id: slugId(`${signature.name}-steps`),
    })
    blocks.push(diagram)
  }

  const input = buildTypeParametersBlock(
    theme,
    signature,
    getWorkflowInputType(signature),
    "Input"
  )
  if (input) {
    blocks.push(...input)
  }

  const output = buildTypeParametersBlock(
    theme,
    signature,
    getWorkflowOutputType(signature),
    "Output"
  )
  if (output) {
    blocks.push(...output)
  }

  // Hooks: reuse the workflowHooks helper (headings + notes + TypeLists) and
  // split its output into structured blocks.
  const hooks = String(Handlebars.helpers.workflowHooks.call(signature) || "")
  blocks.push(...splitContentBlocks(hooks))

  // Emitted events: build a structured block from the @workflowEvent tags.
  const events = buildWorkflowEventsBlock(signature)
  if (events) {
    blocks.push({
      kind: "heading",
      level: 2,
      text: "Emitted Events",
      id: slugId(`${signature.name}-emitted-events`),
    })
    blocks.push(events)
  }

  return blocks
}

/**
 * Parses the `@workflowEvent` block tags of a workflow into a structured
 * `workflowEvents` block, mirroring the tag format the `workflowEvents` helper
 * decodes (`name -- description -- payload -- [deprecated] -- [since: x]`).
 */
function buildWorkflowEventsBlock(
  signature: SignatureReflection
): Extract<DocBlock, { kind: "workflowEvents" }> | undefined {
  const tags = signature.parent?.comment?.blockTags.filter(
    (tag) => tag.tag === "@workflowEvent"
  )
  if (!tags?.length) {
    return undefined
  }

  const events = tags.map((tag) => {
    const parts = tag.content
      .map((c) => c.text)
      .join(" ")
      .split("--")
    const rest = parts.slice(3).map((p) => p.trim())
    const deprecatedIndex = rest.findIndex((p) => p === "deprecated")
    const since = rest.find((p) => p.startsWith("since: "))

    return {
      name: parts[0].trim(),
      description: parts[1]?.trim() || undefined,
      payload:
        parts[2]?.trim().replace(/^```ts\n/, "").replace(/\n```$/, "") ||
        undefined,
      deprecated: deprecatedIndex !== -1 || undefined,
      deprecatedMessage:
        deprecatedIndex !== -1 ? rest[deprecatedIndex] || undefined : undefined,
      since: since ? since.replace("since: ", "").trim() : undefined,
    }
  })

  return { kind: "workflowEvents", events }
}

/**
 * Builds the blocks for a workflow step signature, mirroring `member.step.hbs`:
 * comment, examples (as structured `codeTabs`), and input / output `TypeList`s.
 */
export function buildStepBlocks(
  theme: MarkdownTheme,
  signature: SignatureReflection
): DocBlock[] {
  const blocks: DocBlock[] = []

  const comment = getSignatureComment(signature)
  if (comment) {
    blocks.push({ kind: "markdown", html: comment })
  }

  blocks.push(...deprecatedNoteBlocks(signature))
  blocks.push(
    ...splitContentBlocks(String(Handlebars.helpers.version(signature) || ""))
  )

  const examples = String(Handlebars.helpers.stepExamples.call(signature) || "")
  blocks.push(...splitContentBlocks(examples))

  const input = buildTypeParametersBlock(
    theme,
    signature,
    getStepInputType(signature),
    "Input"
  )
  if (input) {
    blocks.push(...input)
  }

  const output = buildTypeParametersBlock(
    theme,
    signature,
    getStepOutputType(signature),
    "Output"
  )
  if (output) {
    blocks.push(...output)
  }

  return blocks
}

function buildTypeParametersBlock(
  theme: MarkdownTheme,
  signature: SignatureReflection,
  type: ReturnType<typeof getWorkflowInputType>,
  title: string
): DocBlock[] | undefined {
  if (!type) {
    return undefined
  }

  const { maxLevel } = theme.getFormattingOptionsForLocation()
  const items = getReflectionTypeParameters({
    reflectionType: type,
    project: signature.project || (theme.project as never),
    maxLevel,
    wrapObject: true,
    isReturn: false,
  }) as DocTypeListItem[]

  if (!items.length) {
    return undefined
  }

  return [
    { kind: "heading", level: 2, text: title, id: slugId(`${signature.name}-${title}`) },
    {
      kind: "typeList",
      sectionTitle: signature.name,
      // Workflow/step input & output are expanded to the first level, matching
      // the `openedLevel: 1` the workflowInput/Output helpers passed.
      openedLevel: 1,
      types: items,
    },
  ]
}

/**
 * Collects the workflow's steps into a structured `workflowDiagram` block.
 * Reimplements the data collection from the `workflowDiagram` helper so the
 * output is structured JSON rather than a `<WorkflowDiagram>` MDX component.
 */
function buildWorkflowDiagramBlock(
  theme: MarkdownTheme,
  signature: SignatureReflection
): Extract<DocBlock, { kind: "workflowDiagram" }> | undefined {
  const documents = signature.parent?.documents
  if (!documents?.length) {
    return undefined
  }

  const steps: DocWorkflowStep[] = []

  documents.forEach((document, index) => {
    if (document.name === "when") {
      steps.push({
        type: "when",
        name: document.name,
        condition: getDocumentTagValue(document, "@whenCondition"),
        depth: parseInt(getDocumentTagValue(document, "@workflowDepth") || `${index}`),
        steps:
          document.children?.map((child) => getStep(theme, child, index)) || [],
      })
    } else {
      steps.push(getStep(theme, document, index))
    }
  })

  if (!steps.length) {
    return undefined
  }

  return {
    kind: "workflowDiagram",
    workflow: {
      name: signature.name,
      steps,
    },
  }
}

function getStep(
  theme: MarkdownTheme,
  document: DocumentReflection,
  index: number
): DocWorkflowStep {
  const type = document.comment?.modifierTags.has("@workflowStep")
    ? "workflow"
    : document.comment?.modifierTags.has("@hook")
      ? "hook"
      : "step"

  const namespaceRefl = theme.project
    ? findReflectionInNamespaces(
        theme.project
          .getChildrenByKind(ReflectionKind.Module)
          .find((moduleRef) => moduleRef.name === "core-flows") || theme.project,
        document.name
      )
    : undefined

  const associatedReflection =
    namespaceRefl ||
    (theme.project ? getProjectChild(theme.project, document.name) : undefined)

  const depth = getDocumentTagValue(document, "@workflowDepth") || `${index}`

  const summary =
    associatedReflection?.comment?.blockTags.find(
      (tag) => tag.tag === "@summary"
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
      type === "hook" || !(associatedReflection as DeclarationReflection)?.url
        ? `#${document.name}`
        : theme.getRelativeUrl((associatedReflection as DeclarationReflection).url!),
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

function getSignatureComment(signature: SignatureReflection): string {
  if (!signature.comment?.hasVisibleComponent()) {
    return ""
  }
  return String(
    Handlebars.helpers.comments(signature.comment, true, false) || ""
  ).trim()
}

/** Emits the `@deprecated` note (`:::note[Deprecated]`) as a `note` block. */
function deprecatedNoteBlocks(signature: SignatureReflection): DocBlock[] {
  const tag = signature.comment?.blockTags.find(
    (blockTag) => blockTag.tag === "@deprecated"
  )
  if (!tag) {
    return []
  }
  return splitContentBlocks(String(Handlebars.helpers.commentTag(tag) || ""))
}

function extractSourceLink(signature: SignatureReflection): string | undefined {
  const rendered = String(
    Handlebars.helpers.sourceCodeLink.call(signature) || ""
  )
  const match = rendered.match(/link="([^"]+)"/)
  return match?.[1]
}

function slugId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
