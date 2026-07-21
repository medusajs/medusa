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
    const formatting = theme.getFormattingOptions(location)

    // Formatting-driven prose wrapped around the reference body. `reflection.hbs`
    // renders `startSections` right after the title/description (before the
    // comment and members) and `endSections` at the very end.
    blocks.push(...buildSectionsBlocks(formatting.startSections))
    if (
      formatting.startSections?.length &&
      formatting.shouldIncrementAfterStartSections
    ) {
      theme.currentTitleLevel += 1
    }

    // Container / index pages: leading description, then member lists.
    blocks.push(...splitContentBlocks(getCommentMarkdown(model)))
    blocks.push(
      ...splitContentBlocks(String(Handlebars.helpers.example(model) || ""))
    )

    // The events reference pages render the full events listing instead of the
    // usual namespace/member links.
    if (formatting.isEventsReference) {
      const eventsBlock = buildEventsListingBlock(model)
      if (eventsBlock) {
        blocks.push(eventsBlock)
      }
    } else {
      // reflection.hbs renders the reflection's own type parameters before the
      // member lists.
      blocks.push(...reflectionTypeParameterBlocks(model, theme))
      // main.hbs = in-page member navigation (`toc`) + the member sections.
      blocks.push(...buildTocBlocks(model, theme))
      blocks.push(...buildMembersBlocks(model, theme))
    }

    blocks.push(...buildSectionsBlocks(formatting.endSections))
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
/**
 * The reflection's own type parameters (`reflection.hbs` `reflection_typeParameters`
 * section) — e.g. `BaseFilterable<T>`, `FindConfig<T>`, `StepResponse<TOutput>`.
 * Rendered as a `## Type parameters` heading + `TypeList`.
 */
function reflectionTypeParameterBlocks(
  model: ContainerReflection,
  theme: MarkdownTheme
): DocBlock[] {
  if (!Handlebars.helpers.sectionEnabled("reflection_typeParameters")) {
    return []
  }
  const typeParameters =
    (model as DeclarationReflection).typeParameters || []
  if (!typeParameters.length) {
    return []
  }
  const types = typeParameters
    .map(
      (typeParameter) =>
        reflectionComponentFormatter({
          reflection: typeParameter,
          type: "component",
          isTypeParams: true,
          project: model.project,
        }) as DocTypeListItem
    )
    .filter(Boolean)
  if (!types.length) {
    return []
  }
  return [
    {
      kind: "heading",
      level: theme.currentTitleLevel,
      text: "Type parameters",
      id: slugId("Type parameters"),
    },
    { kind: "typeList", sectionTitle: model.name, types },
  ]
}

/**
 * Whether the in-page member navigation (`toc`) renders for this reflection:
 * at least one group's children all own their own document, or the reflection
 * is a visible namespace (matching the theme with `hideInPageTOC` enabled).
 */
function isTocVisible(
  model: ContainerReflection,
  theme: MarkdownTheme
): boolean {
  const groups = model.groups
  if (!groups?.length) {
    return false
  }
  const isNamespaceVisible =
    model.kind === ReflectionKind.Namespace &&
    Boolean(
      theme.getMappings(model as DeclarationReflection)[ReflectionKind.Namespace]
    )
  return (
    isNamespaceVisible ||
    groups.some((group) => group.allChildrenHaveOwnDocument())
  )
}

/**
 * The in-page member navigation (`toc` helper): a link list per group. Only
 * rendered when {@link isTocVisible}. Groups are sorted by title; children by
 * name.
 */
function buildTocBlocks(
  model: ContainerReflection,
  theme: MarkdownTheme
): DocBlock[] {
  const groups = model.groups
  if (!groups?.length || !isTocVisible(model, theme)) {
    return []
  }

  const { reflectionGroupRename = {}, hideTocHeaders } =
    theme.getFormattingOptionsForLocation()

  const blocks: DocBlock[] = []
  const linkItems = (children: { name: string; url?: string }[]) =>
    [...children]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((child) => ({
        title: child.name,
        href: theme.getRelativeUrl(child.url || ""),
      }))

  const sortedGroups = [...groups].sort((a, b) =>
    a.title.localeCompare(b.title)
  )
  for (const group of sortedGroups) {
    const groupTitle = Object.hasOwn(reflectionGroupRename, group.title)
      ? reflectionGroupRename[group.title]
      : group.title

    if (group.categories) {
      for (const category of [...group.categories].sort((a, b) =>
        a.title.localeCompare(b.title)
      )) {
        blocks.push({
          kind: "heading",
          level: 2,
          text: `${category.title} ${groupTitle}`,
          id: slugId(`${category.title} ${groupTitle}`),
        })
        blocks.push({ kind: "linkList", items: linkItems(category.children) })
      }
      continue
    }

    // Index pages list their namespaces without a "Namespaces" header.
    if (!hideTocHeaders && groupTitle !== "Namespaces") {
      blocks.push({
        kind: "heading",
        level: 2,
        text: groupTitle,
        id: slugId(groupTitle),
      })
    }
    blocks.push({ kind: "linkList", items: linkItems(group.children) })
  }

  return blocks
}

/**
 * The rendered member sections (`members.hbs` -> `members.group.hbs`). Groups
 * whose children all own a document are skipped (they appear only in the `toc`
 * link list). Follows `members.group.hbs`: `getAllChildren` (merges implemented
 * types + sorts), an optional group heading (omitted when `expandMembers`),
 * then either an expanded member section per child or a single `TypeList`.
 */
function buildMembersBlocks(
  model: ContainerReflection,
  theme: MarkdownTheme
): DocBlock[] {
  const blocks: DocBlock[] = []

  const { reflectionGroupRename, expandMembers, expandProperties, parameterStyle } =
    theme.getFormattingOptionsForLocation()

  // When the `toc` renders, its helper sorts `groups` by title and each group's
  // `children` by name in place, so the member sections below inherit that
  // order. Mirror that here rather than mutating the reflection.
  const sorted = isTocVisible(model, theme)
  const groups = sorted
    ? [...(model.groups || [])].sort((a, b) => a.title.localeCompare(b.title))
    : model.groups || []

  for (const group of groups) {
    if (group.allChildrenHaveOwnDocument()) {
      continue
    }

    // Apply the configured group rename (e.g. Functions -> Steps).
    const groupTitle = reflectionGroupRename?.[group.title] || group.title

    let inline = (
      Handlebars.helpers.getAllChildren.call(group) as DeclarationReflection[]
    ).filter(
      (child) => !child.hasOwnDocument && child instanceof DeclarationReflection
    )
    if (sorted) {
      inline = [...inline].sort((a, b) => a.name.localeCompare(b.name))
    }
    if (!inline.length) {
      continue
    }

    // `ifCanShowConstructorTitle`: hide a lone constructor's group heading.
    const canShowGroupTitle =
      group.title.toLowerCase() !== "constructors" || group.children.length > 1
    const showGroupTitle = !expandMembers && canShowGroupTitle

    const previousLevel = theme.currentTitleLevel
    if (showGroupTitle) {
      blocks.push({
        kind: "heading",
        level: theme.currentTitleLevel,
        text: groupTitle,
        id: slugId(groupTitle),
      })
      theme.currentTitleLevel += 1
    }

    // `shouldExpandProperties` / `showPropertiesAsComponent`: Properties render
    // as a `TypeList` (component style) unless `expandProperties` expands them;
    // every other group (Methods, Constructors, enum members) is expanded.
    const expandThisGroup =
      group.title === "Properties" &&
      expandProperties &&
      theme.currentTitleLevel <= 3
    const asComponent =
      !expandThisGroup &&
      parameterStyle === "component" &&
      group.title === "Properties"

    if (asComponent) {
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
        blocks.push({ kind: "typeList", sectionTitle: model.name, types })
      }
    } else {
      for (const child of inline) {
        blocks.push(...buildMemberInline(child, theme))
      }
    }

    if (showGroupTitle) {
      theme.currentTitleLevel = previousLevel
    }
  }

  return blocks
}

/**
 * Renders a single inline member of a container page (mirrors `member.hbs`): an
 * optional name heading + badges, then the member's signatures (methods) or its
 * declaration (properties). Heading levels track `theme.currentTitleLevel`.
 */
function buildMemberInline(
  child: DeclarationReflection,
  theme: MarkdownTheme
): DocBlock[] {
  const blocks: DocBlock[] = []

  // `ifMemberShowTitle`: inline members (no own document) show their name.
  const showTitle =
    !child.hasOwnDocument ||
    (Boolean(Handlebars.helpers.sectionEnabled("member_force_title")) &&
      theme.location !== child.url)

  const previousLevel = theme.currentTitleLevel
  if (showTitle && child.name) {
    blocks.push({
      kind: "heading",
      level: theme.currentTitleLevel,
      text: child.name,
      id: slugId(child.name),
    })
    blocks.push(...badgeBlocks(child))
    theme.currentTitleLevel += 1
  }

  const signatures = child.signatures || []
  const accessorSignatures = [child.getSignature, child.setSignature].filter(
    (signature): signature is SignatureReflection => Boolean(signature)
  )
  if (signatures.length && Handlebars.helpers.sectionEnabled("member_signatures")) {
    for (const signature of signatures) {
      if (isWorkflow(signature)) {
        blocks.push(...buildWorkflowBlocks(theme, signature))
      } else if (isWorkflowStep(signature)) {
        blocks.push(...buildStepBlocks(theme, signature))
      } else {
        blocks.push(
          ...buildSignatureBlocks(signature, child, theme)
        )
      }
    }
  } else if (
    accessorSignatures.length &&
    Handlebars.helpers.sectionEnabled("member_getterSetter")
  ) {
    // Accessors (getters/setters) render each signature like a method
    // (member.getterSetter -> member.signature).
    for (const signature of accessorSignatures) {
      blocks.push(
        ...buildSignatureBlocks(signature, child, theme)
      )
    }
  } else if (Handlebars.helpers.sectionEnabled("member_declaration")) {
    blocks.push(...buildDeclarationInline(child, theme))
  }

  if (showTitle && child.name) {
    theme.currentTitleLevel = previousLevel
  }

  return blocks
}

/**
 * Renders a property/declaration inline member (mirrors `member.declaration.hbs`):
 * the declaration title, comment (+ deprecated/since notes), example, and any
 * callable signatures or nested properties of its type. Section toggles
 * (`member_declaration_*`) gate each part.
 */
function buildDeclarationInline(
  child: DeclarationReflection,
  theme: MarkdownTheme
): DocBlock[] {
  const blocks: DocBlock[] = []

  if (Handlebars.helpers.sectionEnabled("member_declaration_title")) {
    blocks.push(
      ...splitContentBlocks(
        String(Handlebars.helpers.declarationTitle.call(child) || "")
      )
    )
  }

  if (Handlebars.helpers.sectionEnabled("member_declaration_comment")) {
    // @deprecated is rendered inline with the comment; @since via `version`.
    blocks.push(...splitContentBlocks(getCommentMarkdown(child)))
    blocks.push(...versionNoteBlocks(child))
  }

  blocks.push(...sourceCodeLinkBlocks(theme, child))

  if (Handlebars.helpers.sectionEnabled("member_declaration_example")) {
    blocks.push(
      ...splitContentBlocks(String(Handlebars.helpers.example(child) || ""))
    )
  }

  // Callable signatures carried on the property's type (e.g. a method-shaped
  // property).
  if (
    Handlebars.helpers.sectionEnabled("member_declaration_signatures") &&
    child.type?.type === "reflection" &&
    child.type.declaration.signatures?.length
  ) {
    for (const signature of child.type.declaration.signatures) {
      blocks.push(...buildSignatureBlocks(signature, child, theme))
    }
    return blocks
  }

  // Object-typed property/variable: a `Properties` sub-heading (unless
  // `expandMembers`) + the nested members as a TypeList (member.declaration's
  // `member_declaration_typeDeclaration` branch).
  const typeChildren =
    child.type?.type === "reflection" ? child.type.declaration.children : undefined
  if (
    typeChildren?.length &&
    Handlebars.helpers.sectionEnabled("member_declaration_typeDeclaration")
  ) {
    const { expandMembers } = theme.getFormattingOptionsForLocation()
    if (!expandMembers) {
      blocks.push({
        kind: "heading",
        level: theme.currentTitleLevel,
        text: "Properties",
        id: slugId(`${child.name}-properties`),
      })
    }
    const types = buildTypeListItems(typeChildren, child.project)
    if (types.length) {
      blocks.push({ kind: "typeList", sectionTitle: child.name, types })
    }
  }

  return blocks
}

/**
 * Parses the `reflectionBadges` helper output (`<BadgesList badges={[...]} />`)
 * into a `badges` block. Emitted right after a member's name heading.
 */
function badgeBlocks(reflection: Reflection): DocBlock[] {
  const rendered = String(
    Handlebars.helpers.reflectionBadges.call(reflection) || ""
  )
  const match = rendered.match(/badges=\{([\s\S]*?)\}\s+className=/)
  if (!match) {
    return []
  }
  try {
    const parsed = JSON.parse(match[1]) as { variant?: string; children: string }[]
    const badges = parsed.map((badge) => ({
      variant: badge.variant,
      label: badge.children,
    }))
    return badges.length ? [{ kind: "badges", badges }] : []
  } catch {
    return []
  }
}

/**
 * Renders the formatting `startSections` / `endSections` (arrays of MDX prose)
 * as blocks, matching the `startSections`/`endSections` helpers (each section
 * separated by a `---` rule).
 */
function buildSectionsBlocks(sections: string[] | undefined): DocBlock[] {
  if (!sections?.length) {
    return []
  }
  const lineBreaks = "\n\n"
  const separator = `---${lineBreaks}`
  return splitContentBlocks(
    `${separator}${sections.join(`${lineBreaks}${separator}`)}`
  )
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
  blocks.push(...splitContentBlocks(getCommentMarkdown(model)))
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
    blocks.push(...buildSignatureBlocks(signature, child, theme, true))
  }
  theme.currentTitleLevel = previousLevel

  return blocks
}

function buildSignatureBlocks(
  signature: SignatureReflection,
  owner: DeclarationReflection,
  theme: MarkdownTheme,
  // Expanded object members (js-sdk) carry their comment/example on the owning
  // property rather than the synthesized signature; fall back to the owner
  // there. Regular members render the signature's own comment/example (matching
  // `member.signature`), so the fallback is off by default.
  useOwnerFallback = false
): DocBlock[] {
  const blocks: DocBlock[] = []
  const { expandMembers } = theme.getFormattingOptionsForLocation()
  const sections = theme.getFormattingOptionsForLocation().sections
  const sectionEnabled = (key: string) =>
    !sections || !(key in sections) || sections[key as never] !== false

  const previousLevel = theme.currentTitleLevel

  // Signature title (`member_signature_title`). Suppressed by default, but shown
  // for overloaded members. With `expandMembers` it's a heading (and nests its
  // sub-sections one level deeper); otherwise it's an inline bold code line.
  const titleStr = String(Handlebars.helpers.signatureTitle.call(signature) || "")
  if (titleStr.trim()) {
    if (expandMembers) {
      blocks.push(...splitContentBlocks(titleStr))
      if (Handlebars.helpers.hasMoreThanOneSignature(signature.parent)) {
        theme.currentTitleLevel += 1
      }
    } else {
      blocks.push({ kind: "markdown", html: titleStr })
    }
  }
  const level = theme.currentTitleLevel

  // Comment summary (block tags are rendered after Returns, per member.signature).
  const summary =
    (signature.comment &&
      String(
        Handlebars.helpers.comments(signature.comment, true, false) || ""
      ).trim()) ||
    (useOwnerFallback ? getCommentMarkdown(owner) : "")
  blocks.push(...splitContentBlocks(summary))

  // @since note.
  blocks.push(...versionNoteBlocks(signature))
  blocks.push(...sourceCodeLinkBlocks(theme, signature))

  // @example (may embed <CodeTabs>).
  const example =
    String(Handlebars.helpers.example(signature) || "") ||
    (useOwnerFallback ? String(Handlebars.helpers.example(owner) || "") : "")
  blocks.push(...splitContentBlocks(example))

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

  // Comment block tags (@deprecated, custom tags) — rendered after Returns.
  if (sectionEnabled("member_signature_comment") && signature.comment) {
    blocks.push(
      ...splitContentBlocks(
        String(
          Handlebars.helpers.comments(signature.comment, false, true, signature) ||
            ""
        )
      )
    )
  }

  theme.currentTitleLevel = previousLevel
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

/**
 * Renders a reflection's comment (summary + block tags) as markdown, matching
 * the `comment` partial (`{{{comments this true true model}}}`). Block tags
 * that aren't excluded (e.g. `@classdesc`, `@deprecated`) are rendered as
 * headings / admonitions, so callers should run the output through
 * {@link splitContentBlocks} to lift those into their own blocks.
 */
function getCommentMarkdown(reflection: Reflection): string {
  if (!reflection.comment) {
    return ""
  }
  return String(
    Handlebars.helpers.comments(reflection.comment, true, true, reflection) || ""
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
