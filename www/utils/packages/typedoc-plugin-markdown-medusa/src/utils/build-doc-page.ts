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
import {
  getDmlProperties,
  getTypeChildren,
  isDmlEntity,
  isWorkflow,
  isWorkflowStep,
} from "utils"
import type { DocBlock, DocPage, DocTypeListItem } from "types"
import { MarkdownTheme } from "../theme.js"
import { ReflectionParameterType } from "../types.js"
import { getPageFrontmatter } from "./frontmatter.js"
import { parseParams } from "./params-utils.js"
import { reflectionComponentFormatter } from "./reflection-formatter.js"
import { getReflectionTypeParameters } from "./reflection-type-parameters.js"
import { splitContentBlocks } from "./parse-code-tabs.js"
import { buildStepBlocks, buildWorkflowBlocks } from "./build-workflow-blocks.js"
import { buildEventsListingBlock } from "./build-events-listing.js"

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

  // The page title is an <h1>, so content sections start at level 2. The
  // Handlebars helpers we reuse (examples, hooks, ...) derive heading levels
  // from `currentTitleLevel`, so set it here to match the MDX theme (which
  // increments past the title before rendering the body).
  theme.currentTitleLevel = 2

  const blocks: DocBlock[] = []

  // Formatting-driven description shown right after the title (title.hbs). It
  // can embed a <Note>, so run it through the block splitter.
  blocks.push(
    ...splitContentBlocks(
      String(Handlebars.helpers.reflectionDescription.call(model) || "")
    )
  )

  if (kind === "member") {
    // Member pages own their comment / example / source per signature.
    blocks.push(...buildMemberBlocks(model as DeclarationReflection, theme))
  } else {
    // Container / index pages: leading description, then member lists.
    const description = getCommentMarkdown(model)
    if (description) {
      blocks.push({ kind: "markdown", html: description })
    }
    blocks.push(
      ...splitContentBlocks(String(Handlebars.helpers.example(model) || ""))
    )

    // The events reference pages render the full events listing instead of the
    // usual namespace/member links.
    if (theme.getFormattingOptions(location).isEventsReference) {
      const eventsBlock = buildEventsListingBlock(model)
      if (eventsBlock) {
        blocks.push(eventsBlock)
      }
    } else {
      blocks.push(...buildContainerBlocks(model, theme))
    }
  }

  // Ensure heading ids are unique within the page (rehype-slug style), since
  // repeated section titles (e.g. per-hook "Example"/"Input") would otherwise
  // collide, producing duplicate DOM ids and duplicate TOC keys.
  dedupeHeadingIds(blocks)

  return {
    slug: theme.getRelativeUrl(model.url || location),
    title,
    frontmatter,
    toc: buildToc(blocks),
    blocks,
  }
}

/** Makes every `heading` block's id unique, appending `-1`, `-2`, ... */
function dedupeHeadingIds(blocks: DocBlock[]): void {
  const counts = new Map<string, number>()
  for (const block of blocks) {
    if (block.kind !== "heading") {
      continue
    }
    const base = block.id || slugId(block.text)
    const seen = counts.get(base) ?? 0
    counts.set(base, seen + 1)
    block.id = seen === 0 ? base : `${base}-${seen}`
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

  const { reflectionGroupRename } = theme.getFormattingOptionsForLocation()
  const groups = model.groups || []
  for (const group of groups) {
    // Apply the configured group rename (e.g. Functions -> Steps).
    const groupTitle = reflectionGroupRename?.[group.title] || group.title
    const linked = group.children
      .filter((child) => child.hasOwnDocument)
      .sort((a, b) => a.name.localeCompare(b.name))
    const inline = group.children.filter(
      (child): child is DeclarationReflection =>
        !child.hasOwnDocument && child instanceof DeclarationReflection
    )

    // Members that own a document (e.g. an interface's methods) become links.
    // Index pages list just the name + link (no description).
    if (linked.length) {
      // Index pages list their namespaces without a "Namespaces" header.
      if (groupTitle !== "Namespaces") {
        blocks.push({ kind: "heading", level: 2, text: groupTitle, id: slugId(groupTitle) })
      }
      blocks.push({
        kind: "linkList",
        items: linked.map((child) => ({
          title: child.name,
          href: theme.getRelativeUrl(child.url || ""),
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
      if (isWorkflow(signature)) {
        blocks.push(...buildWorkflowBlocks(theme, signature))
      } else if (isWorkflowStep(signature)) {
        blocks.push(...buildStepBlocks(theme, signature))
      } else {
        blocks.push(...buildSignatureBlocks(signature, model, theme))
      }
    }
    return blocks
  }

  // Plain declaration (type alias / variable / object literal): comment,
  // example, then its resolved type as a property TypeList.
  const description = getCommentMarkdown(model)
  if (description) {
    blocks.push({ kind: "markdown", html: description })
  }
  blocks.push(...deprecatedNoteBlocks(model))
  blocks.push(...versionNoteBlocks(model))
  blocks.push(...sourceCodeLinkBlocks(theme, model))
  blocks.push(
    ...splitContentBlocks(String(Handlebars.helpers.example(model) || ""))
  )

  // Expandable object properties (e.g. js-sdk `sdk.store.cart`): render each
  // method child as its own member section (heading + example/params/returns),
  // matching member.declaration with `expandProperties`.
  if (theme.getFormattingOptionsForLocation().expandProperties && model.type) {
    const memberChildren = getTypeChildren({
      reflectionType: model.type,
      project: model.project || theme.project,
    }).filter((child) => getMemberSignatures(child).length)

    if (memberChildren.length) {
      for (const child of memberChildren) {
        blocks.push(...buildExpandedMemberBlocks(child, theme))
      }
      return blocks
    }
  }

  // DML entity (data model) pages list the entity's properties directly,
  // rather than wrapping them under the `DmlEntity<...>` type (mirrors the
  // `member.dml` template).
  if (isDmlEntity(model) && model.type?.type === "reference") {
    const types = buildTypeListItems(
      getDmlProperties(model.type),
      model.project
    )
    if (types.length) {
      blocks.push({ kind: "typeList", sectionTitle: model.name, types })
    }
    return blocks
  }

  const types = buildTypeListItems(
    model.children && model.children.length ? model.children : [model],
    model.project
  )
  if (types.length) {
    blocks.push({ kind: "typeList", types })
  }

  return blocks
}

/** The callable signatures of a member (method, or property with a fn type). */
function getMemberSignatures(
  child: DeclarationReflection
): SignatureReflection[] {
  if (child.signatures?.length) {
    return child.signatures
  }
  if (child.type?.type === "reflection" && child.type.declaration.signatures) {
    return child.type.declaration.signatures
  }
  return []
}

/**
 * Renders an expanded object member (e.g. a `sdk.store.cart` method) as a
 * section: an `<h2>` with the member name, then each signature's blocks (comment,
 * example, parameters, returns) nested one level deeper.
 */
function buildExpandedMemberBlocks(
  child: DeclarationReflection,
  theme: MarkdownTheme
): DocBlock[] {
  const blocks: DocBlock[] = [
    { kind: "heading", level: 2, text: child.name, id: slugId(child.name) },
  ]

  const previousLevel = theme.currentTitleLevel
  theme.currentTitleLevel = 3
  for (const signature of getMemberSignatures(child)) {
    blocks.push(...buildSignatureBlocks(signature, child, theme, 3))
  }
  theme.currentTitleLevel = previousLevel

  return blocks
}

function buildSignatureBlocks(
  signature: SignatureReflection,
  owner: DeclarationReflection,
  theme: MarkdownTheme,
  level = 2
): DocBlock[] {
  const blocks: DocBlock[] = []

  const comment =
    getCommentMarkdown(signature) || getCommentMarkdown(owner)
  if (comment) {
    blocks.push({ kind: "markdown", html: comment })
  }

  // @deprecated + @since notes.
  blocks.push(...deprecatedNoteBlocks(signature))
  blocks.push(...versionNoteBlocks(signature))
  blocks.push(...sourceCodeLinkBlocks(theme, signature))

  // @example (may embed <CodeTabs>). For expanded members the example lives on
  // the owning property rather than the signature, so fall back to it.
  const example =
    String(Handlebars.helpers.example(signature) || "") ||
    (owner !== (signature as unknown)
      ? String(Handlebars.helpers.example(owner) || "")
      : "")
  blocks.push(...splitContentBlocks(example))

  const sections = theme.getFormattingOptionsForLocation().sections
  const sectionEnabled = (key: string) =>
    !sections || !(key in sections) || sections[key as never] !== false

  // Type Parameters (before Parameters; hidden for e.g. module service methods
  // that disable member_signature_typeParameters).
  const typeParameters = signature.typeParameters || []
  if (typeParameters.length && sectionEnabled("member_signature_typeParameters")) {
    const types = typeParameters
      .map(
        (typeParameter) =>
          reflectionComponentFormatter({
            reflection: typeParameter,
            type: "component",
            isTypeParams: true,
            project: signature.project,
          }) as DocTypeListItem
      )
      .filter(Boolean)
    if (types.length) {
      blocks.push({ kind: "heading", level, text: "Type Parameters", id: slugId(`${owner.name}-type-parameters`) })
      blocks.push({ kind: "typeList", sectionTitle: owner.name, types })
    }
  }

  // Parameters
  const parameters = signature.parameters || []
  if (parameters.length) {
    const types = buildTypeListItems(parameters, signature.project)
    if (types.length) {
      blocks.push({ kind: "heading", level, text: "Parameters", id: slugId(`${owner.name}-parameters`) })
      blocks.push({ kind: "typeList", sectionTitle: owner.name, types })
    }
  }

  // Returns (hidden when member_returns is disabled, e.g. DML methods). Built
  // from the return type via getReflectionTypeParameters — matching the MDX
  // `returns` helper, which (unlike the parameter formatter) does not attach
  // the signature's @example to the return value.
  if (
    signature.type &&
    sections?.member_returns !== false &&
    !signature.parent?.kindOf(ReflectionKind.Constructor)
  ) {
    const { maxLevel } = theme.getFormattingOptionsForLocation()
    const returnItems = getReflectionTypeParameters({
      reflectionType: signature.type,
      project: signature.project || (theme.project as never),
      comment: signature.comment,
      maxLevel,
    }) as DocTypeListItem[]
    if (returnItems.length) {
      blocks.push({ kind: "heading", level, text: "Returns", id: slugId(`${owner.name}-returns`) })
      blocks.push({ kind: "typeList", sectionTitle: owner.name, types: returnItems })
    }
  }

  // NOTE: the `<SourceCodeLink>` component is only rendered for workflows in
  // the MDX theme; regular members use a "Defined in" footer (member.sources),
  // which is not yet ported. Tracked as a follow-up.

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

/**
 * Emits the `@since` availability note (`version` helper) as a `note` block,
 * matching the MDX theme which renders it right after the member comment.
 */
export function versionNoteBlocks(reflection: Reflection): DocBlock[] {
  return splitContentBlocks(String(Handlebars.helpers.version(reflection) || ""))
}

/**
 * Emits the `@deprecated` note as a `note` block. The MDX theme renders it
 * inline with the comment (`comments` with tags -> `commentTag` produces a
 * `:::note[Deprecated]` admonition); we emit it explicitly since our comment
 * rendering omits block tags.
 */
export function deprecatedNoteBlocks(reflection: Reflection): DocBlock[] {
  const tag = reflection.comment?.blockTags.find(
    (blockTag) => blockTag.tag === "@deprecated"
  )
  if (!tag) {
    return []
  }
  return splitContentBlocks(String(Handlebars.helpers.commentTag(tag) || ""))
}

/** Extracts the GitHub source URL from the `sourceCodeLink` helper output. */
function extractSourceLink(reflection: Reflection): string | undefined {
  const rendered = String(
    Handlebars.helpers.sourceCodeLink.call(reflection) || ""
  )
  return rendered.match(/link="([^"]+)"/)?.[1]
}

/**
 * Emits a `sourceCodeLink` block when the location's formatting enables it
 * (`showSourceCodeLink`) and the reflection has a source. This replaces the
 * per-template hardcoding — the option is set in the merge config for the
 * references that showed the link (DML models, workflows).
 */
function sourceCodeLinkBlocks(
  theme: MarkdownTheme,
  reflection: Reflection
): DocBlock[] {
  if (!theme.getFormattingOptionsForLocation().showSourceCodeLink) {
    return []
  }
  const source = extractSourceLink(reflection)
  return source ? [{ kind: "sourceCodeLink", link: source }] : []
}

function getCommentMarkdown(reflection: Reflection): string {
  if (!reflection.comment) {
    return ""
  }
  return String(
    Handlebars.helpers.comments(reflection.comment, true, false) || ""
  ).trim()
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
