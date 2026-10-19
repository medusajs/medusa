import { promises as fs } from "fs"
import path from "path"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import type { UnistNode, UnistTree } from "types"
import { unified } from "unified"

type EsmNode = {
  type: string
  start: number
  end: number
  source?: { value: unknown }
  specifiers?: { type: string; local: { name: string } }[]
}

type Replacement = {
  start: number
  end: number
  value: string
}

const parseMdx = (content: string) =>
  unified()
    .use(remarkParse)
    .use(remarkMdx)
    .parse(content) as unknown as UnistTree

const getEsmBody = (node: UnistNode): EsmNode[] =>
  (node.data as { estree?: { body: EsmNode[] } } | undefined)?.estree?.body ||
  []

const applyReplacements = (content: string, replacements: Replacement[]) =>
  replacements
    .sort((a, b) => b.start - a.start)
    .reduce(
      (result, { start, end, value }) =>
        result.slice(0, start) + value + result.slice(end),
      content
    )

/**
 * Replaces MDX partials imported by a page (`import Content from "./_content.mdx"`)
 * and rendered as standalone components (`<Content />`) with the partials'
 * content, so that the page's source holds everything it renders.
 *
 * The Markdown served to agents is generated from a page's source alone, where
 * it can't resolve imports. Without inlining, the partials' content is dropped
 * from the Markdown even though it's rendered in the HTML.
 *
 * The partials' own `import` statements are removed, since they'd clash with
 * the page's imports. Partials used in other ways, such as in a component's
 * prop, are left as-is.
 */
export const inlineMdxImports = async (
  content: string,
  filePath: string,
  visited: Set<string> = new Set([path.resolve(filePath)])
): Promise<string> => {
  let tree: UnistTree
  try {
    tree = parseMdx(content)
  } catch {
    return content
  }

  // maps the local name of each imported partial to its absolute path
  const partials = new Map<string, string>()
  for (const node of tree.children) {
    if (node.type !== "mdxjsEsm") {
      continue
    }
    for (const statement of getEsmBody(node)) {
      const source = statement.source?.value
      const specifier = statement.specifiers?.[0]
      if (
        statement.type !== "ImportDeclaration" ||
        typeof source !== "string" ||
        !/^\.{1,2}\/.+\.mdx$/.test(source) ||
        statement.specifiers?.length !== 1 ||
        specifier?.type !== "ImportDefaultSpecifier"
      ) {
        continue
      }
      partials.set(
        specifier.local.name,
        path.resolve(path.dirname(filePath), source)
      )
    }
  }

  const replacements: Replacement[] = []
  const partialsContent = new Map<string, string | null>()

  for (const node of tree.children) {
    const partialPath = node.name ? partials.get(node.name) : undefined
    if (
      node.type !== "mdxJsxFlowElement" ||
      !partialPath ||
      node.attributes?.length ||
      node.children?.length ||
      visited.has(partialPath)
    ) {
      continue
    }

    if (!partialsContent.has(partialPath)) {
      partialsContent.set(
        partialPath,
        await getPartialContent(partialPath, new Set([...visited, partialPath]))
      )
    }
    const partialContent = partialsContent.get(partialPath)
    if (partialContent === null || partialContent === undefined) {
      continue
    }

    replacements.push({
      start: node.position!.start.offset!,
      end: node.position!.end.offset!,
      value: partialContent,
    })
  }

  return applyReplacements(content, replacements)
}

/**
 * Retrieves a partial's content with its own partials inlined and its `import`
 * statements removed. Returns `null` if the partial can't be read.
 */
const getPartialContent = async (
  partialPath: string,
  visited: Set<string>
): Promise<string | null> => {
  let content: string
  try {
    content = await fs.readFile(partialPath, "utf-8")
  } catch {
    return null
  }

  content = await inlineMdxImports(content, partialPath, visited)

  const imports: Replacement[] = parseMdx(content)
    .children.filter((node) => node.type === "mdxjsEsm")
    .flatMap(getEsmBody)
    .filter((statement) => statement.type === "ImportDeclaration")
    .map(({ start, end }) => ({ start, end, value: "" }))

  return applyReplacements(content, imports).trim()
}
