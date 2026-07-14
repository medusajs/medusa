import type {
  DocBlock,
  DocCodeTab,
  DocTypeListItem,
  DocWorkflowStep,
} from "types"

const CODE_TAB_RE = /<CodeTab\s+([^>]*?)>([\s\S]*?)<\/CodeTab>/g
const FENCE_RE = /```(\w+)?([^\n]*)\n([\s\S]*?)```/

function getAttr(attrs: string, name: string): string | undefined {
  const match = attrs.match(new RegExp(`${name}="([^"]*)"`))
  return match?.[1]
}

/**
 * Extracts a balanced `{ ... }` JSX expression container starting at `openIdx`
 * (which must point at the opening `{`), respecting string literals. Returns
 * the inner expression (without the outer braces) and the index just past the
 * closing brace, or null if unbalanced.
 */
function extractBraceExpression(
  str: string,
  openIdx: number
): { inner: string; end: number } | null {
  let depth = 0
  let inStr = false
  let quote = ""
  let esc = false

  for (let i = openIdx; i < str.length; i++) {
    const c = str[i]
    if (inStr) {
      if (esc) {
        esc = false
      } else if (c === "\\") {
        esc = true
      } else if (c === quote) {
        inStr = false
      }
      continue
    }
    if (c === '"' || c === "'" || c === "`") {
      inStr = true
      quote = c
    } else if (c === "{") {
      depth++
    } else if (c === "}") {
      depth--
      if (depth === 0) {
        return { inner: str.slice(openIdx + 1, i), end: i + 1 }
      }
    }
  }

  return null
}

/** Parses a `prop={<json>}` value from a component's attribute string span. */
function parseJsonProp<T>(source: string, prop: string): { value: T; end: number } | null {
  const marker = `${prop}={`
  const markerIdx = source.indexOf(marker)
  if (markerIdx === -1) {
    return null
  }
  const openIdx = markerIdx + marker.length - 1
  const extracted = extractBraceExpression(source, openIdx)
  if (!extracted) {
    return null
  }
  try {
    return { value: JSON.parse(extracted.inner) as T, end: extracted.end }
  } catch {
    return null
  }
}

function parseCodeTabs(inner: string): DocCodeTab[] {
  const tabs: DocCodeTab[] = []
  let match: RegExpExecArray | null

  CODE_TAB_RE.lastIndex = 0
  while ((match = CODE_TAB_RE.exec(inner)) !== null) {
    const label = getAttr(match[1], "label") || ""
    const fence = match[2].match(FENCE_RE)
    tabs.push({
      label,
      language: fence?.[1] || "ts",
      title: fence ? getAttr(fence[2], "title") : undefined,
      code: (fence?.[3] ?? match[2]).trim(),
    })
  }

  return tabs
}

/** Recognized top-level constructs, matched by their opening marker. */
type Construct = {
  name: string
  re: RegExp
  build: (
    content: string,
    matchIndex: number
  ) => { block: DocBlock | null; end: number } | null
}

function buildConstructs(): Construct[] {
  return [
    {
      name: "codeTabs",
      re: /<CodeTabs\b[^>]*>/g,
      build: (content, idx) => {
        const close = content.indexOf("</CodeTabs>", idx)
        if (close === -1) {
          return null
        }
        const inner = content.slice(content.indexOf(">", idx) + 1, close)
        const tabs = parseCodeTabs(inner)
        return {
          block: tabs.length ? { kind: "codeTabs", tabs } : null,
          end: close + "</CodeTabs>".length,
        }
      },
    },
    {
      name: "typeList",
      re: /<TypeList\b/g,
      build: (content, idx) => {
        const tagEnd = findTagEnd(content, idx)
        if (tagEnd === -1) {
          return null
        }
        const tag = content.slice(idx, tagEnd)
        const parsed = parseJsonProp<DocTypeListItem[]>(tag, "types")
        if (!parsed) {
          return { block: null, end: tagEnd }
        }
        return {
          block: {
            kind: "typeList",
            sectionTitle: getAttr(tag, "sectionTitle"),
            expandUrl: getAttr(tag, "expandUrl"),
            types: parsed.value,
          },
          end: tagEnd,
        }
      },
    },
    {
      name: "workflowDiagram",
      re: /<WorkflowDiagram\b/g,
      build: (content, idx) => {
        const tagEnd = findTagEnd(content, idx)
        if (tagEnd === -1) {
          return null
        }
        const tag = content.slice(idx, tagEnd)
        const parsed = parseJsonProp<{ name: string; steps: DocWorkflowStep[] }>(
          tag,
          "workflow"
        )
        return {
          block: parsed ? { kind: "workflowDiagram", workflow: parsed.value } : null,
          end: tagEnd,
        }
      },
    },
    {
      name: "sourceCodeLink",
      re: /<SourceCodeLink\b/g,
      build: (content, idx) => {
        const tagEnd = findTagEnd(content, idx)
        if (tagEnd === -1) {
          return null
        }
        const tag = content.slice(idx, tagEnd)
        const link = getAttr(tag, "link")
        return {
          block: link ? { kind: "sourceCodeLink", link } : null,
          end: tagEnd,
        }
      },
    },
    {
      name: "noteComponent",
      re: /<Note\b[^>]*>/g,
      build: (content, idx) => {
        const close = content.indexOf("</Note>", idx)
        if (close === -1) {
          return null
        }
        const openTagEnd = content.indexOf(">", idx)
        const tag = content.slice(idx, openTagEnd + 1)
        return {
          block: {
            kind: "note",
            variant: getAttr(tag, "type") || "note",
            title: getAttr(tag, "title") || undefined,
            html: content.slice(openTagEnd + 1, close).trim(),
          },
          end: close + "</Note>".length,
        }
      },
    },
    {
      name: "note",
      re: /:::(\w+)?(?:\[([^\]]*)\])?/g,
      build: (content, idx) => {
        const openMatch = /:::(\w+)?(?:\[([^\]]*)\])?/.exec(content.slice(idx))
        if (!openMatch) {
          return null
        }
        const bodyStart = idx + openMatch[0].length
        const close = content.indexOf(":::", bodyStart)
        if (close === -1) {
          return null
        }
        return {
          block: {
            kind: "note",
            variant: openMatch[1] || "note",
            title: openMatch[2] || undefined,
            html: content.slice(bodyStart, close).trim(),
          },
          end: close + 3,
        }
      },
    },
  ]
}

/** Finds the end index (just past `>`) of a self-closing/opening JSX tag. */
function findTagEnd(content: string, idx: number): number {
  let inStr = false
  let quote = ""
  for (let i = idx; i < content.length; i++) {
    const c = content[i]
    if (inStr) {
      if (c === quote) {
        inStr = false
      }
      continue
    }
    if (c === '"' || c === "'") {
      inStr = true
      quote = c
    } else if (c === ">") {
      return i + 1
    }
  }
  return -1
}

/** Splits a prose run into `heading` + `markdown` blocks. */
function proseToBlocks(content: string): DocBlock[] {
  const trimmed = content.trim()
  if (!trimmed) {
    return []
  }

  const blocks: DocBlock[] = []
  const lines = trimmed.split("\n")
  let buffer: string[] = []

  const flush = () => {
    const md = buffer.join("\n").trim()
    if (md) {
      blocks.push({ kind: "markdown", html: md })
    }
    buffer = []
  }

  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      flush()
      const text = heading[2].trim()
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        text,
        // Slug from the visible text only: drop markdown link targets
        // (`[label](url)` -> `label`), code backticks, and HTML entities so the
        // anchor stays clean (matches rehype-slug on the MDX heading text).
        id: slugId(
          text
            .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
            .replace(/`/g, "")
            .replace(/&#\d+;/g, "")
        ),
      })
    } else {
      buffer.push(line)
    }
  }
  flush()

  return blocks
}

/**
 * Splits a helper-produced MDX fragment into ordered {@link DocBlock}s,
 * extracting the components the theme emits (`CodeTabs`, `TypeList`,
 * `WorkflowDiagram`, `SourceCodeLink`, `:::` admonitions) into structured
 * blocks and turning the surrounding prose into `heading` / `markdown` blocks.
 * Links are already resolved to final slugs by the theme, so no runtime
 * link-fixing is needed.
 */
export function splitContentBlocks(content: string): DocBlock[] {
  const trimmed = content.trim()
  if (!trimmed) {
    return []
  }

  const constructs = buildConstructs()
  const blocks: DocBlock[] = []
  let cursor = 0

  while (cursor < trimmed.length) {
    // Find the earliest next construct from the cursor.
    let best: { construct: Construct; index: number } | null = null
    for (const construct of constructs) {
      construct.re.lastIndex = cursor
      const match = construct.re.exec(trimmed)
      if (match && (!best || match.index < best.index)) {
        best = { construct, index: match.index }
      }
    }

    if (!best) {
      blocks.push(...proseToBlocks(trimmed.slice(cursor)))
      break
    }

    // Prose before the construct.
    blocks.push(...proseToBlocks(trimmed.slice(cursor, best.index)))

    const result = best.construct.build(trimmed, best.index)
    if (!result) {
      // Couldn't parse; emit the marker char as prose and advance past it.
      blocks.push(...proseToBlocks(trimmed.slice(best.index, best.index + 1)))
      cursor = best.index + 1
      continue
    }

    if (result.block) {
      blocks.push(result.block)
    }
    cursor = result.end
  }

  return blocks
}

function slugId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
