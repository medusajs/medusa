import type { DocBlock, DocCodeTab } from "types"

const CODE_TABS_RE = /<CodeTabs\b[^>]*>([\s\S]*?)<\/CodeTabs>/g
const CODE_TAB_RE = /<CodeTab\s+([^>]*?)>([\s\S]*?)<\/CodeTab>/g
const FENCE_RE = /```(\w+)?([^\n]*)\n([\s\S]*?)```/

function getAttr(attrs: string, name: string): string | undefined {
  const match = attrs.match(new RegExp(`${name}="([^"]*)"`))
  return match?.[1]
}

function getTitle(fenceMeta: string): string | undefined {
  return getAttr(fenceMeta, "title")
}

/**
 * Parses the `<CodeTab>` children of a `<CodeTabs>` block into structured tabs.
 */
function parseCodeTabs(inner: string): DocCodeTab[] {
  const tabs: DocCodeTab[] = []
  let match: RegExpExecArray | null

  CODE_TAB_RE.lastIndex = 0
  while ((match = CODE_TAB_RE.exec(inner)) !== null) {
    const attrs = match[1]
    const body = match[2]
    const label = getAttr(attrs, "label") || ""
    const fence = body.match(FENCE_RE)

    tabs.push({
      label,
      language: fence?.[1] || "ts",
      title: fence ? getTitle(fence[2]) : undefined,
      code: (fence?.[3] ?? body).trim(),
    })
  }

  return tabs
}

/**
 * Splits a helper-produced content fragment into ordered {@link DocBlock}s,
 * extracting `<CodeTabs>` components into structured `codeTabs` blocks and
 * keeping everything else as `markdown` (links already resolved by the theme).
 *
 * This is intentionally scoped to the `CodeTabs` component (the one piece of
 * example output that must be structured for the client renderer). Other
 * surrounding prose — including single fenced code blocks and `**Example**`
 * headers — renders fine as markdown.
 */
export function splitContentBlocks(content: string): DocBlock[] {
  const trimmed = content.trim()
  if (!trimmed) {
    return []
  }

  const blocks: DocBlock[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  CODE_TABS_RE.lastIndex = 0
  while ((match = CODE_TABS_RE.exec(trimmed)) !== null) {
    const before = trimmed.slice(lastIndex, match.index).trim()
    if (before) {
      blocks.push({ kind: "markdown", html: before })
    }

    const tabs = parseCodeTabs(match[1])
    if (tabs.length) {
      blocks.push({ kind: "codeTabs", tabs })
    }

    lastIndex = CODE_TABS_RE.lastIndex
  }

  const rest = trimmed.slice(lastIndex).trim()
  if (rest) {
    blocks.push({ kind: "markdown", html: rest })
  }

  return blocks
}
