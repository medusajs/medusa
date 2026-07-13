import Handlebars from "handlebars"
import {
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  SignatureReflection,
} from "typedoc"
import type { DocBlock, DocPage, DocTypeListItem } from "types"
import { MarkdownTheme } from "../theme.js"
import { ReflectionParameterType } from "../types.js"
import { getPageFrontmatter } from "./frontmatter.js"
import { parseParams } from "./params-utils.js"
import { reflectionComponentFormatter } from "./reflection-formatter.js"

type BuildDocPageOptions = {
  theme: MarkdownTheme
  page: PageEvent<ContainerReflection>
  kind: "reflection" | "member" | "index"
}

/**
 * Builds the {@link DocPage} for a single reference page from its TypeDoc
 * reflection.
 *
 * This mirrors the section order the MDX theme's `reflection.hbs` /
 * `reflection.member.hbs` templates produce, but assembles structured
 * {@link DocBlock}s instead of markdown text. It reuses the theme's registered
 * Handlebars helpers (`comments`, `reflectionTitle`, ...) for prose and
 * {@link reflectionComponentFormatter} for `TypeList` data, so link resolution
 * flows through the theme's overridden `getRelativeUrl` (final website slugs).
 *
 * NOTE: this is the extensible core. It currently covers the common page
 * shapes (index / namespace / module link lists, leaf members with parameter
 * and return type lists, prose, examples, source links, feature-flag badges).
 * The recursive member rendering and the workflow / DML / react-query member
 * variants are marked with TODOs below and reuse existing helpers when wired.
 */
export function buildDocPage({
  theme,
  page,
  kind,
}: BuildDocPageOptions): DocPage {
  const model = page.model
  const location = page.url

  const frontmatter =
    getPageFrontmatter({
      frontmatterData: theme.getFormattingOptions(location).frontmatterData,
      reflection: model,
    }) || {}

  const title = String(
    Handlebars.helpers.reflectionTitle.call(page, false) || model.name
  )

  const blocks: DocBlock[] = []

  // Leading comment / description prose.
  const description = getCommentMarkdown(model)
  if (description) {
    blocks.push({ kind: "markdown", html: description })
  }

  // @example block(s).
  const example = String(Handlebars.helpers.example(model) || "").trim()
  if (example) {
    // TODO: parse the example markdown (which embeds <CodeTabs>) into a
    // structured `codeTabs` block. Kept as prose for the first cut.
    blocks.push({ kind: "markdown", html: example })
  }

  if (kind === "member") {
    blocks.push(...buildMemberBlocks(model as DeclarationReflection, theme))
  } else {
    blocks.push(...buildContainerBlocks(model, theme))
  }

  const source = extractSourceLink(model)
  if (source) {
    blocks.push({ kind: "sourceCodeLink", link: source })
  }

  return {
    slug: theme.getRelativeUrl(model.url || location),
    title,
    frontmatter,
    toc: buildToc(blocks),
    blocks,
  }
}

/**
 * Container pages (project index, namespaces, modules, classes, interfaces,
 * enums) list their members. Members that own a document become links
 * (`linkList`); members rendered inline (anchors) are TODO — they need the
 * recursive `member.hbs` logic.
 */
function buildContainerBlocks(
  model: ContainerReflection,
  theme: MarkdownTheme
): DocBlock[] {
  const blocks: DocBlock[] = []

  const groups = model.groups || []
  for (const group of groups) {
    const linked = group.children.filter((child) => child.hasOwnDocument)
    const inline = group.children.filter(
      (child): child is DeclarationReflection =>
        !child.hasOwnDocument && child instanceof DeclarationReflection
    )

    // Members that own a document (e.g. an interface's methods) become links.
    if (linked.length) {
      blocks.push({ kind: "heading", level: 2, text: group.title, id: slugId(group.title) })
      blocks.push({
        kind: "linkList",
        items: linked.map((child) => ({
          title: child.name,
          href: theme.getRelativeUrl(child.url || ""),
          description: getSummary(child),
        })),
      })
    }

    // Members rendered on this page (e.g. an interface's properties or enum
    // members) become a `TypeList`, mirroring the `parameterComponent` helper:
    // flatten destructured params, drop nested (dotted) entries, then format.
    if (inline.length) {
      const types = buildTypeListItems(
        inline
          .reduce(
            (acc: ReflectionParameterType[], child) => parseParams(child, acc),
            []
          )
          .filter((param) => !param.name.includes(".")),
        model.project
      )

      if (types.length) {
        blocks.push({ kind: "heading", level: 2, text: group.title, id: slugId(group.title) })
        blocks.push({ kind: "typeList", sectionTitle: model.name, types })
      }
    }

    // TODO: workflow / DML / react-query member variants still need their
    // dedicated blocks (workflowDiagram, structured codeTabs). Tracked for
    // Phase 1 expansion.
  }

  return blocks
}

/**
 * Leaf member pages (functions, methods, variables, type aliases, properties).
 * Renders the callable signatures' parameters and return values as `TypeList`
 * blocks.
 */
function buildMemberBlocks(
  model: DeclarationReflection,
  theme: MarkdownTheme
): DocBlock[] {
  const blocks: DocBlock[] = []

  const signatures = model.signatures || []
  if (signatures.length) {
    for (const signature of signatures) {
      blocks.push(...buildSignatureBlocks(signature, model))
    }
    return blocks
  }

  // Plain declaration (type alias / variable / object literal): render its
  // resolved type as a property TypeList.
  const types = buildTypeListItems(
    model.children && model.children.length ? model.children : [model],
    model.project
  )
  if (types.length) {
    blocks.push({ kind: "typeList", types })
  }

  return blocks
}

function buildSignatureBlocks(
  signature: SignatureReflection,
  owner: DeclarationReflection
): DocBlock[] {
  const blocks: DocBlock[] = []

  const comment = getCommentMarkdown(signature)
  if (comment) {
    blocks.push({ kind: "markdown", html: comment })
  }

  // Parameters
  const parameters = signature.parameters || []
  if (parameters.length) {
    const types = buildTypeListItems(parameters, signature.project)
    if (types.length) {
      blocks.push({ kind: "heading", level: 4, text: "Parameters", id: slugId(`${owner.name}-parameters`) })
      blocks.push({ kind: "typeList", sectionTitle: owner.name, types })
    }
  }

  // Returns
  if (signature.type) {
    const returnItems = buildTypeListItems(
      [signature as unknown as ReflectionParameterType],
      signature.project
    )
    if (returnItems.length) {
      blocks.push({ kind: "heading", level: 4, text: "Returns", id: slugId(`${owner.name}-returns`) })
      blocks.push({ kind: "typeList", sectionTitle: owner.name, types: returnItems })
    }
  }

  return blocks
}

/**
 * Runs the reflection-formatter (component style) over a set of reflections and
 * returns the resulting `TypeList` item tree. Links inside `type` strings are
 * resolved to final website slugs via the theme's `getRelativeUrl` override
 * (the formatter passes `Handlebars.helpers.relativeURL` through).
 */
function buildTypeListItems(
  reflections: ReflectionParameterType[],
  project?: ProjectReflection
): DocTypeListItem[] {
  return reflections
    .map(
      (reflection) =>
        reflectionComponentFormatter({
          reflection,
          type: "component",
          project,
        }) as DocTypeListItem
    )
    .filter(Boolean)
}

function getCommentMarkdown(reflection: Reflection): string {
  if (!reflection.comment) {
    return ""
  }
  return String(
    Handlebars.helpers.comments(reflection.comment, true, false) || ""
  ).trim()
}

function getSummary(reflection: Reflection): string | undefined {
  const summaryTag = reflection.comment?.blockTags.find(
    (tag) => tag.tag === "@summary"
  )
  const summary = summaryTag?.content || reflection.comment?.summary
  if (!summary?.length) {
    return undefined
  }
  return String(Handlebars.helpers.comment(summary) || "").trim() || undefined
}

function extractSourceLink(reflection: Reflection): string | undefined {
  const rendered = String(Handlebars.helpers.sourceCodeLink.call(reflection) || "")
  const match = rendered.match(/link="([^"]+)"/)
  return match?.[1]
}

/** Builds a table of contents from the heading blocks. */
function buildToc(blocks: DocBlock[]): DocPage["toc"] {
  return blocks
    .filter((block): block is Extract<DocBlock, { kind: "heading" }> => block.kind === "heading")
    .map((heading) => ({
      title: heading.text,
      id: heading.id,
      level: heading.level,
    }))
}

function slugId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
