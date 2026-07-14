export type SectionKey =
  | "comment"
  | "member_declaration"
  | "member_declaration_title"
  | "member_declaration_comment"
  | "member_declaration_typeParameters"
  | "member_declaration_indexSignature"
  | "member_declaration_signatures"
  | "member_declaration_typeDeclaration"
  | "member_declaration_example"
  | "member_declaration_children"
  | "member_getteSetter_getSignature"
  | "member_getteSetter_setSignature"
  | "member_signatures"
  | "member_getterSetter"
  | "member_reference"
  | "member_signature_title"
  | "member_signature_comment"
  | "member_signature_typeParameters"
  | "member_signature_parameters"
  | "member_signature_example"
  | "member_signature_returns"
  | "member_signature_declarationSignatures"
  | "member_signature_declarationChildren"
  | "member_signature_sources"
  | "member_sources_implementationOf"
  | "member_sources_inheritedFrom"
  | "member_sources_overrides"
  | "member_sources_definedIn"
  | "members_group_categories"
  | "members_categories"
  | "member_returns"
  | "member_force_title"
  | "title_reflectionPath"
  | "reflection_comment"
  | "reflection_typeParameters"
  | "reflection_hierarchy"
  | "reflection_implements"
  | "reflection_implementedBy"
  | "reflection_callable"
  | "reflection_indexable"

export type Sections = {
  [k in SectionKey]?: boolean
}

export type ParameterStyle = "table" | "list" | "component"

export type FormattingOptionsType = {
  [k: string]: FormattingOptionType
}

export type Tag =
  | string
  | {
      name: string
      label: string
    }

export type FrontmatterData = {
  slug?: string
  sidebar_label?: string
  displayed_sidebar?: string
  tags?: Tag[]
  keywords?: string[]
  [k: string]: unknown
}

export type FormattingOptionType = {
  sections?: Sections
  reflectionGroups?: {
    [k: string]: boolean
  }
  reflectionGroupRename?: {
    [k: string]: string
  }
  reflectionCategories?: {
    [k: string]: boolean
  }
  reflectionTitle?: {
    kind?: boolean
    typeParameters?: boolean
    prefix?: string
    suffix?: string
    fullReplacement?: string
  }
  reflectionDescription?: string
  expandMembers?: boolean
  expandProperties?: boolean
  showCommentsAsHeader?: boolean
  showCommentsAsDetails?: boolean
  parameterStyle?: ParameterStyle
  frontmatterData?: FrontmatterData
  parameterComponent?: string
  parameterComponentExtraProps?: Record<string, unknown>
  mdxImports?: string[]
  maxLevel?: number
  fileNameSeparator?: string
  startSections?: string[]
  endSections?: string[]
  shouldIncrementAfterStartSections?: boolean
  hideTocHeaders?: boolean
  workflowDiagramComponent?: string
  isEventsReference?: boolean
  sortMembers?: boolean
  internalType?: string
  /** Whether to show the GitHub source-code link for the member. */
  showSourceCodeLink?: boolean
}

export type AllowedProjectDocumentsOption = {
  [k: string]: Record<number, boolean>
}

export declare module "typedoc" {
  declare interface TypeDocOptionMap {
    /**
     * Enable resolving internal types.
     * @defaultValue false
     */
    enableInternalResolve: boolean
    /**
     * The name of the internal module. Requires enabling `enableInternalResolve`.
     * @defaultValue "internal"
     */
    internalModule: string
    /**
     * Whether to remove reflections having the `@apiIgnore` tag.
     * @defaultValue false
     */
    ignoreApi: boolean
    /**
     * The path to the ESLint configurations to apply.
     */
    eslintPathName: string
    /**
     * The path to resolve plugins used in the ESLint configurations.
     */
    pluginsResolvePath: string
    /**
     * An object of key-value pairs to be added to frontmatter
     */
    frontmatterData: Record<string, unknown>
    /**
     * [Markdown Plugin] Do not render page title.
     * @defaultValue false
     */
    hidePageTitle: boolean
    /**
     * [Markdown Plugin] Do not render breadcrumbs in template.
     * @defaultValue false
     */
    hideBreadcrumbs: boolean
    /**
     * [Markdown Plugin] Specifies the base path that all links to be served from.
     * If omitted all urls will be relative.
     */
    publicPath: string
    /**
     * [Markdown Plugin] Use HTML named anchors as fragment identifiers for engines
     * that do not automatically assign header ids. Should be set for Bitbucket Server docs.
     * @defaultValue false
     */
    namedAnchors: boolean
    allowedProjectDocuments: AllowedProjectDocumentsOption
    /**
     * [Markdown Plugin] Separator used to format filenames.
     * @defaultValue "."
     */
    filenameSeparator: string
    /**
     * [Markdown Plugin] The file name of the entry document.
     * @defaultValue "README.md"
     */
    entryDocument: string
    /**
     * [Markdown Plugin] Do not render in-page table of contents items.
     * @defaultValue false
     */
    hideInPageTOC: boolean
    /**
     * [Markdown Plugin] Customise the index page title.
     */
    indexTitle: string
    /**
     * [Markdown Plugin] Do not add special symbols for class members.
     * @defaultValue true
     */
    hideMembersSymbol: boolean
    /**
     * [Markdown Plugin] Preserve anchor casing when generating links.
     * @defaultValue false
     */
    preserveAnchorCasing: boolean
    /**
     * [Markdown Plugin] Specify the Type Declaration Render Style
     * @defaultValue table
     */
    objectLiteralTypeDeclarationStyle: ParameterStyle
    /**
     * [Markdown Plugin] Formatting options that can be specified either on a specific document or to all documents
     */
    formatting: FormattingOptionType
    /**
     * [Markdown Plugin] Whether outputted files should have an mdx extension.
     * @defaultValue false
     */
    mdxOutput: boolean
    /**
     * [Markdown Plugin] The maximum level to expand when retrieving reflection types.
     * @defaultValue 3
     */
    maxLevel: number
    /**
     * [Markdown Plugin] Whether to output modules file for namespaces.
     * @defaultValue true
     */
    outputNamespace: boolean
    /**
     * [Markdown Plugin] Whether to output module files.
     * @defaultValue true
     */
    outputModules: boolean
    /**
     * Whether to enable the React Query manipulator.
     * @defaultValue false
     */
    enableReactQueryManipulator: boolean
    /**
     * Namespace names whose child members should have their own documents.
     */
    allReflectionsHaveOwnDocumentInNamespace: string[]
    /**
     * Whether to ignore items with the `@parentIgnore` tag.
     * @defaultValue false
     */
    parentIgnore: boolean
    /**
     * Whether to check for and add variables.
     * @defaultValue false
     */
    checkVariables: boolean
    /**
     * Whether to generate a Mermaid.js class diagram for data models in the reference.
     */
    generateModelsDiagram: boolean
    /**
     * The file to add the mermaid diagram to. The diagram is added as a package comment.
     */
    diagramAddToFile: string
    /**
     * Whether to generate a Mermaid.js class diagram for data models in the reference.
     * (Used for DML)
     */
    generateDMLsDiagram: boolean
    /**
     * The file to add the mermaid diagram to. The diagram is added as a package comment.
     * (Used for DML)
     */
    diagramDMLAddToFile: string
    /**
     * Whether to enable resolving DML relations.
     * @defaultValue false
     */
    resolveDmlRelations: boolean
    /**
     * Whether to normalize DML types.
     * @defaultValue false
     */
    normalizeDmlTypes: boolean
    /**
     * Whether to enable the workflows plugin.
     * @defaultValue false
     */
    enableWorkflowsPlugins: boolean
    /**
     * Whether to enable the namespace generator plugin for paths.
     * @defaultValue false
     */
    enablePathNamespaceGenerator: boolean
    /**
     * The namespaces to generate for paths.
     */
    generatePathNamespaces: NamespaceGenerateDetails[]
    /**
     * Whether to enable the namespace generator plugin for `@customNamespaces` usage.
     * @defaultValue false
     */
    generateCustomNamespaces: boolean
    /**
     * Optionally specify a parent namespace to place all generated custom namespaces in.
     */
    customParentNamespace: string
    /**
     * Optionally specify a name prefix for all custom namespaces.
     */
    customNamespaceNamePrefix: string
    /**
     * Whether to resolve events.
     * @defaultValue false
     */
    enableEventsResolver: boolean
  }
}

export declare type DmlObject = Record<string, string>

export declare type DmlFile = {
  [k: string]: {
    filePath: string
    properties: DmlObject
    since?: string
    deprecated?: {
      is_deprecated: boolean
      description?: string
    }
    featureFlag?: string
    example?: string
  }
}

export declare type RouteExamples = {
  [k: string]: {
    [k: string]: string
  }
}

export declare type NamespaceGenerateDetails = {
  /**
   * The namespace's names.
   */
  name: string
  /**
   * The namespace's description. Will be attached
   * as a summary comment.
   */
  description?: string
  /**
   * A path pattern to pass to minimatch that
   * checks if a file / its reflections belong to the
   * namespace
   */
  pathPattern: string
  /**
   * The namespace's children
   */
  children?: NamespaceGenerateDetails[]
}

export declare type MedusaEvent = {
  name: string
  parentName: string
  propertyName: string
  payload: string
  description?: string
  workflows: string[]
  since?: string
  deprecated?: boolean
  deprecated_message?: string
}

/* -------------------------------------------------------------------------- */
/*                           References doc-model                             */
/* -------------------------------------------------------------------------- */
/*
 * The doc-model is the serialization format the references pipeline emits
 * instead of MDX. Each reference page is one `DocPage` (written as a single
 * `<page>.json`). It is a presentation-ready, self-contained description of a
 * page: a list of ordered `DocBlock`s whose data (type tables, workflow
 * diagrams, code examples) is structured JSON and whose links are already
 * resolved to final site URLs at generation time.
 *
 * IMPORTANT: this contract is duplicated on the website side (see
 * `www/packages/docs-ui` `ReferenceContent`). The two definitions live in
 * separate yarn workspace roots and must be kept structurally in sync.
 */

/**
 * A single row in a `TypeList` (parameters, return values, object properties).
 * Structurally identical to the `Parameter` type used by the markdown theme
 * and the `Type` prop consumed by the `docs-ui` `TypeList` component.
 */
export declare type DocTypeListItem = {
  name: string
  /**
   * The rendered type, e.g. "`string`" or a link like
   * "[CartDTO](/references/cart/models/Cart)". Links are pre-resolved.
   */
  type: string
  optional?: boolean
  defaultValue?: string
  example?: string
  /**
   * Description as pre-rendered, sanitized HTML (links resolved).
   */
  description?: string
  featureFlag?: string
  expandable: boolean
  children?: DocTypeListItem[]
  since?: string
  deprecated?: {
    is_deprecated: boolean
    description?: string
  }
}

/**
 * A single step in a workflow diagram.
 */
export declare type DocWorkflowStep = {
  type: "step" | "hook" | "workflow" | "when"
  name: string
  description?: string
  /** Pre-resolved link to the step's own page, or a "#anchor". */
  link?: string
  depth: number
  /** Present when `type === "when"`. */
  condition?: string
  steps?: DocWorkflowStep[]
}

export declare type DocCodeTab = {
  label: string
  language: string
  title?: string
  code: string
}

/**
 * An ordered content block within a page. `kind` discriminates the shape.
 */
export declare type DocBlock =
  | {
      /** Prose rendered to sanitized HTML at build time (links resolved). */
      kind: "markdown"
      html: string
    }
  | {
      kind: "heading"
      level: number
      text: string
      id: string
    }
  | {
      kind: "typeList"
      sectionTitle?: string
      expandUrl?: string
      /** Levels to expand by default (e.g. 1 for workflow input/output). */
      openedLevel?: number
      types: DocTypeListItem[]
    }
  | {
      kind: "workflowDiagram"
      workflow: {
        name: string
        steps: DocWorkflowStep[]
      }
    }
  | {
      kind: "codeTabs"
      tabs: DocCodeTab[]
    }
  | {
      kind: "note"
      variant?: string
      /** Note body as sanitized HTML (links resolved). */
      html: string
      title?: string
    }
  | {
      kind: "sourceCodeLink"
      link: string
      text?: string
    }
  | {
      kind: "table"
      headers: string[]
      rows: string[][]
    }
  | {
      /** Namespace / index pages: a list of links to member pages. */
      kind: "linkList"
      items: {
        title: string
        href: string
        description?: string
      }[]
    }
  | {
      /** Feature-flag / status badges rendered above a section. */
      kind: "badges"
      badges: {
        variant?: string
        label: string
        tooltip?: string
      }[]
    }
  | {
      /** Events emitted by a workflow (from `@workflowEvent` tags). */
      kind: "workflowEvents"
      events: {
        name: string
        description?: string
        /** The event payload as a code snippet. */
        payload?: string
        deprecated?: boolean
        deprecatedMessage?: string
        since?: string
      }[]
    }
  | {
      /** The full events reference listing (grouped by module/category). */
      kind: "eventsListing"
      categories: {
        title?: string
        events: DocEvent[]
      }[]
    }

/** A single event in the events reference listing. */
export declare type DocEvent = {
  name: string
  /** Anchor id (slug of the event name). */
  id: string
  /** Description as Markdown (links resolved). */
  description?: string
  /** The event payload, as a fenced code block. */
  payload?: string
  /** Workflows that emit this event, as pre-resolved links. */
  workflows?: { name: string; href: string }[]
  deprecated?: boolean
  deprecatedMessage?: string
  since?: string
}

/**
 * A fully-serialized reference page.
 */
export declare type DocPage = {
  /** Final site URL for this page (already accounts for slug overrides). */
  slug: string
  title: string
  frontmatter: FrontmatterData
  /** In-page table of contents, built from `heading` blocks. */
  toc?: {
    title: string
    id: string
    level: number
  }[]
  blocks: DocBlock[]
}
