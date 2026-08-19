import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import {
  Estree,
  FrontMatter,
  UnistNode,
  UnistNodeWithData,
  UnistTree,
} from "types"
import { Plugin, Transformer, unified } from "unified"
import { SKIP, VisitorResult } from "unist-util-visit"
import type { VFile } from "vfile"
import {
  ComponentParser,
  parseCard,
  parseCardList,
  parseChangelogList,
  parseChildDocs,
  parseCodeTabs,
  parseColors,
  parseComponentExample,
  parseComponentReference,
  parseDetails,
  parseEventHeader,
  parseHookValues,
  parseIconSearch,
  parseNote,
  parsePackageInstall,
  parsePrerequisites,
  parseSourceCodeLink,
  parseSplitList,
  parseTable,
  parseTabs,
  parseTypeList,
  parseWorkflowDiagram,
} from "./utils/parsers.js"
import remarkFrontmatter from "remark-frontmatter"
import { matter } from "vfile-matter"
import {
  collectDeclarations,
  EvaluationScope,
  evaluateEstreeExpression,
  stringifyValue,
  UNRESOLVED,
} from "./utils/evaluate-expression.js"
import { globalConfig } from "./global-config.js"

const parsers: Record<string, ComponentParser> = {
  Card: parseCard,
  CardList: parseCardList,
  ChangelogList: parseChangelogList,
  ChildDocs: parseChildDocs,
  CodeTabs: parseCodeTabs,
  Details: parseDetails,
  Note: parseNote,
  Prerequisites: parsePrerequisites,
  SourceCodeLink: parseSourceCodeLink,
  Table: parseTable,
  Tabs: parseTabs,
  TypeList: parseTypeList,
  WorkflowDiagram: parseWorkflowDiagram,
  ComponentExample: parseComponentExample,
  ComponentReference: parseComponentReference,
  PackageInstall: parsePackageInstall,
  IconSearch: parseIconSearch,
  HookValues: parseHookValues,
  Colors: parseColors,
  SplitList: parseSplitList,
  EventHeader: parseEventHeader,
}

const asyncParserNames = new Set([
  "ChangelogList",
  "ComponentExample",
  "ComponentReference",
])

const isComponentAllowed = (nodeName: string): boolean => {
  return Object.keys(parsers).includes(nodeName)
}

const METADATA_EXPORT_PREFIX = "export const metadata = "

/**
 * Pulls the page title out of an `export const metadata = { title: ... }`
 * statement. Template placeholders such as `${pageNumber}` are stripped since
 * they're injected by the MDX pipeline and carry no meaning in Markdown.
 */
const extractMetadataTitle = (value: string): string | undefined => {
  const regexMatch = /title: (?<title>.+),?/.exec(value)

  return regexMatch?.groups?.title
    ?.replace(/,$/, "")
    .replaceAll(/\$\{.+\}/g, "")
    .replaceAll(/^['"`]/g, "")
    .replaceAll(/['"`]$/g, "")
    .trim()
}

type ParserPluginOptions = {
  [key: string]: unknown
}

const parseComponentsPlugin = (options: ParserPluginOptions): Transformer => {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    let pageTitle = ""

    type AsyncParserTask = {
      node: UnistNodeWithData
      parent: UnistTree
      parserName: string
    }
    const asyncTasks: AsyncParserTask[] = []

    visit(
      tree as UnistTree,
      ["mdxJsxFlowElement", "element", "mdxjsEsm", "heading"],
      (node: UnistNode, index, parent) => {
        if (typeof index !== "number" || !parent) {
          return
        }
        if (
          node.type === "mdxjsEsm" &&
          node.value?.startsWith("export const metadata = ") &&
          node.data &&
          "estree" in node.data
        ) {
          pageTitle = extractMetadataTitle(node.value) || pageTitle
        }
        if (node.type === "heading") {
          if (node.depth === 1 && node.children?.length) {
            if (node.children[0].value === "metadata.title") {
              node.children[0] = {
                type: "text",
                value: pageTitle,
              }
            } else {
              node.children = node.children
                .filter((child) => child.type === "text")
                .map((child) => ({
                  ...child,
                  value: child.value?.trim(),
                }))
            }
          }
          return
        }
        if (
          node.type === "mdxjsEsm" ||
          !isComponentAllowed(node.name as string)
        ) {
          parent?.children.splice(index, 1)
          return [SKIP, index]
        }

        if (!node.name) {
          return
        }

        if (asyncParserNames.has(node.name)) {
          asyncTasks.push({
            node: node as UnistNodeWithData,
            parent: parent as UnistTree,
            parserName: node.name,
          })
          return
        }

        const parser = parsers[node.name]
        if (parser) {
          const parserOptions = options[node.name] || {}
          return parser(
            node as UnistNodeWithData,
            index,
            parent,
            parserOptions
          ) as VisitorResult
        }
      }
    )

    for (const { node, parent, parserName } of asyncTasks) {
      const currentIndex = (parent as UnistTree).children.indexOf(
        node as UnistNode
      )
      if (currentIndex === -1) {
        continue
      }
      const parser = parsers[parserName]
      if (parser) {
        await parser(node, currentIndex, parent, options[parserName] || {})
      }
    }
  }
}

/**
 * Parses a resolved expression's value as Markdown so that values holding
 * Markdown syntax (links, emphasis, code spans) aren't escaped when the tree is
 * stringified.
 */
const parseMarkdownFragment = async (
  value: string,
  inline: boolean
): Promise<UnistNode[]> => {
  const tree = unified().use(remarkParse).parse(value) as unknown as UnistTree
  const children = tree.children || []

  if (inline && children.length === 1 && children[0].type === "paragraph") {
    return children[0].children || []
  }

  return children
}

/**
 * Resolves MDX expressions (`{config.version.number}`, `{someExportedConst}`)
 * to their values before the components plugin strips the `export`/`import`
 * statements that back them.
 *
 * Without this, expressions are stringified as-is and leak placeholders such as
 * `v{config.version.number}` into the Markdown served to agents. Expressions
 * that can't be resolved statically — including MDX comments — are removed
 * instead of leaked.
 */
const resolveExpressionsPlugin = (scope: EvaluationScope): Transformer => {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    const localScope: EvaluationScope = { ...scope }
    type ExpressionTask = {
      node: UnistNode
      parent: UnistTree
      inline: boolean
    }
    const tasks: ExpressionTask[] = []

    visit(
      tree as UnistTree,
      ["mdxjsEsm", "mdxTextExpression", "mdxFlowExpression"],
      (node: UnistNode, index, parent) => {
        const estree = (node.data as { estree?: Estree } | undefined)?.estree

        if (node.type === "mdxjsEsm") {
          if (node.value?.startsWith(METADATA_EXPORT_PREFIX)) {
            const title = extractMetadataTitle(node.value)
            if (title) {
              localScope.metadata = {
                ...(localScope.metadata as Record<string, unknown>),
                title,
              }
            }
            return
          }

          collectDeclarations(estree, localScope)
          return
        }

        if (typeof index !== "number" || !parent) {
          return
        }

        tasks.push({
          node,
          parent: parent as UnistTree,
          inline: node.type === "mdxTextExpression",
        })
      }
    )

    // Replacements happen after the traversal so that every declaration in the
    // page is in scope, regardless of where it's declared relative to its usage.
    for (const { node, parent, inline } of tasks) {
      const index = parent.children.indexOf(node)
      if (index === -1) {
        continue
      }

      const value = evaluateEstreeExpression(
        (node.data as { estree?: Estree } | undefined)?.estree,
        localScope
      )
      const stringified =
        value === UNRESOLVED ? undefined : stringifyValue(value)

      if (stringified === undefined) {
        parent.children.splice(index, 1)
        continue
      }

      parent.children.splice(
        index,
        1,
        ...(await parseMarkdownFragment(stringified, inline))
      )
    }
  }
}

/**
 * Strips the code block meta that only the docs UI understands (`npm2yarn`,
 * `npx2yarn`, `highlights={...}`, ...). Left in place, it turns into invalid
 * info strings like ` ```bash npx2yarn ` in the Markdown output. `title="..."`
 * is kept since it names the file the snippet belongs to.
 */
const cleanCodeMetaPlugin = (): Transformer => {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    visit(tree as UnistTree, "code", (node: UnistNode) => {
      if (!node.meta) {
        return
      }

      node.meta = /title="[^"]*"/.exec(node.meta)?.[0] || null
    })
  }
}

const removeFrontmatterPlugin = (): Transformer => {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    visit(
      tree as UnistTree,
      ["yaml", "toml"],
      (node: UnistNode, index, parent) => {
        if (typeof index !== "number" || parent?.type !== "root") {
          return
        }

        parent.children.splice(index, 1)
        return [SKIP, index]
      }
    )
  }
}

const getParsedAsString = (file: VFile): string => {
  let content = file.toString().replaceAll(/^([\s]*)\* /gm, "$1- ")
  const frontmatter = file.data.matter as FrontMatter | undefined

  if (frontmatter?.title) {
    content = `# ${frontmatter.title}\n\n${frontmatter.description ? `${frontmatter.description}\n\n` : ""}${content}`
  }

  return content
}

export type GetCleanMdOptions = {
  file: string
  plugins?: {
    before?: Plugin[]
    after?: Plugin[]
  }
  parserOptions?: ParserPluginOptions
  type?: "file" | "content"
  /**
   * Values that MDX expressions in the page can reference. Merged into (and
   * taking precedence over) the defaults, which expose the docs `config`.
   */
  scope?: EvaluationScope
}

const getDefaultScope = (): EvaluationScope => ({
  config: {
    version: globalConfig.version,
  },
})

export const getCleanMd = async ({
  file,
  plugins,
  parserOptions,
  type = "file",
  scope,
}: GetCleanMdOptions): Promise<string> => {
  const { read } = await import("to-vfile")
  if (type === "file" && !file.endsWith(".md") && !file.endsWith(".mdx")) {
    return ""
  }
  const unifier = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkStringify)
    .use(remarkFrontmatter, ["yaml"])
    .use(() => {
      return (tree, file) => {
        matter(file)
      }
    })

  plugins?.before?.forEach((plugin) => {
    unifier.use(...(Array.isArray(plugin) ? plugin : [plugin]))
  })

  unifier
    .use(resolveExpressionsPlugin, { ...getDefaultScope(), ...scope })
    .use(cleanCodeMetaPlugin)
    .use(parseComponentsPlugin, parserOptions || {})
    .use(removeFrontmatterPlugin)

  plugins?.after?.forEach((plugin) => {
    unifier.use(...(Array.isArray(plugin) ? plugin : [plugin]))
  })

  const content = type === "file" ? await read(file) : file
  const parsed = await unifier.process(content)

  return getParsedAsString(parsed)
}
