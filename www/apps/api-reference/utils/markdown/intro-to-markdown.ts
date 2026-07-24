import type { OpenAPI } from "types"
import { getCleanMd } from "docs-utils"
import { crossProjectLinksPlugin } from "remark-rehype-plugins"
import { getIntroSection } from "@/utils/area"
import { apiRefIntroContent as rawIntroContent } from "@/generated/intro-content.mjs"
import { crossProjectLinksOptions } from "@/utils/cross-project-links-options.mjs"

// The raw `.mjs` is emitted with literal (non-indexable) types, so read the
// bundled intro MDX through a typed view.
const apiRefIntroContent = rawIntroContent as Record<OpenAPI.Area, string>

/**
 * The api-reference intro MDX wraps its content in structural layout components
 * that carry no semantic meaning in Markdown. `getCleanMd` strips any component
 * not in its allow-list *including its children*, so we unwrap these wrappers
 * (hoisting their children) before that stripping runs, and turn the custom
 * `<H1>` into a real heading. Everything else (`CodeTabs`, `Note`,
 * `Prerequisites`, `Feedback`, `ClientLibraries`) is left to `getCleanMd`.
 */
const UNWRAP_COMPONENTS = new Set([
  "Section",
  "SectionContainer",
  "DividedMarkdownLayout",
  "DividedMarkdownContent",
  "DividedMarkdownCode",
])

// `<H1>` can be parsed as a flow element or (when inline) a text element
// wrapped in a paragraph.
const isH1 = (node: any): boolean =>
  (node?.type === "mdxJsxFlowElement" || node?.type === "mdxJsxTextElement") &&
  node.name === "H1"

const toHeading = (node: any) => ({
  type: "heading",
  depth: 1,
  children: (node.children || []).filter((c: any) => c.type === "text"),
})

const isBlankText = (node: any): boolean =>
  node?.type === "text" && !node.value?.trim()

// Dependency-free recursive unwrap: hoist wrapper children and rewrite `<H1>`
// to a heading. Recursion handles arbitrarily-nested wrappers.
const unwrapChildren = (children: any[]): any[] => {
  const result: any[] = []
  for (const child of children || []) {
    if (
      child?.type === "mdxJsxFlowElement" &&
      UNWRAP_COMPONENTS.has(child.name)
    ) {
      result.push(...unwrapChildren(child.children || []))
      continue
    }
    if (isH1(child)) {
      result.push(toHeading(child))
      continue
    }
    // A paragraph wrapping the inline `<H1>` — lift the heading out, keeping any
    // remaining inline content as a paragraph.
    if (child?.type === "paragraph" && (child.children || []).some(isH1)) {
      const h1 = child.children.find(isH1)
      result.push(toHeading(h1))
      const rest = child.children.filter(
        (c: any) => !isH1(c) && !isBlankText(c)
      )
      if (rest.length) {
        result.push({ type: "paragraph", children: rest })
      }
      continue
    }
    if (Array.isArray(child?.children)) {
      child.children = unwrapChildren(child.children)
    }
    result.push(child)
  }
  return result
}

const unwrapPlugin = () => (tree: any) => {
  tree.children = unwrapChildren(tree.children || [])
}

/**
 * Clean the raw intro MDX to Markdown: unwrap structural components and resolve
 * cross-project (`!area!`) links exactly like the rendered page.
 */
export const cleanIntroContent = async (raw: string): Promise<string> =>
  getCleanMd({
    file: raw,
    type: "content",
    plugins: {
      before: [
        unwrapPlugin,
        [crossProjectLinksPlugin, crossProjectLinksOptions],
      ] as any,
    },
  })

/** Extract the Markdown from a `## {title}` heading up to the next `## `. */
export const sliceSection = (content: string, title: string): string | null => {
  const lines = content.split("\n")
  const headingRe = new RegExp(
    `^##\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`,
    "i"
  )
  const start = lines.findIndex((line) => headingRe.test(line))
  if (start === -1) {
    return null
  }

  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    // Next level-2 heading (`## `, not `### `) ends the section.
    if (/^##\s+(?!#)/.test(lines[i])) {
      end = i
      break
    }
  }

  return lines.slice(start, end).join("\n").trim()
}

/**
 * Converts an area's intro MDX to Markdown. Without `section`, returns the whole
 * intro; with `section`, returns only that `## ` section's Markdown.
 */
export default async function introToMarkdown(
  area: OpenAPI.Area,
  section?: string
): Promise<string | null> {
  const raw = apiRefIntroContent[area]
  if (!raw) {
    return null
  }

  const cleaned = await cleanIntroContent(raw)

  if (!section) {
    return cleaned
  }

  const introSection = getIntroSection(area, section)
  if (!introSection) {
    return null
  }

  return sliceSection(cleaned, introSection.title)
}
