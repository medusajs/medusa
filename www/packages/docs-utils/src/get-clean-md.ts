import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { FrontMatter, UnistNode, UnistNodeWithData, UnistTree } from "types"
import { Plugin, Transformer, unified } from "unified"
import { SKIP } from "unist-util-visit"
import type { VFile } from "vfile"
import {
  ComponentParser,
  parseCard,
  parseCardList,
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

const parsers: Record<string, ComponentParser> = {
  Card: parseCard,
  CardList: parseCardList,
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

const isComponentAllowed = (nodeName: string): boolean => {
  return Object.keys(parsers).includes(nodeName)
}

type ParserPluginOptions = {
  [key: string]: unknown
}

const parseComponentsPlugin = (options: ParserPluginOptions): Transformer => {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    let pageTitle = ""

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
          const regexMatch = /title: (?<title>.+),?/.exec(node.value)
          if (regexMatch?.groups?.title) {
            pageTitle = regexMatch.groups.title
              .replace(/,$/, "")
              .replaceAll(/\$\{.+\}/g, "")
              .replaceAll(/^['"`]/g, "")
              .replaceAll(/['"`]$/g, "")
              .trim()
          }
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

        const parser = parsers[node.name]
        if (parser) {
          const parserOptions = options[node.name] || {}
          return parser(node as UnistNodeWithData, index, parent, parserOptions)
        }
      }
    )
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
}

export const getCleanMd = async ({
  file,
  plugins,
  parserOptions,
  type = "file",
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
    .use(parseComponentsPlugin, parserOptions || {})
    .use(removeFrontmatterPlugin)

  plugins?.after?.forEach((plugin) => {
    unifier.use(...(Array.isArray(plugin) ? plugin : [plugin]))
  })

  const content = type === "file" ? await read(file) : file
  const parsed = await unifier.process(content)

  return getParsedAsString(parsed)
}
