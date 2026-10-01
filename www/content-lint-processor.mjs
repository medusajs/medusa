import { createRequire } from "node:module"
import path from "node:path"
import markdown from "eslint-plugin-markdown"

const require = createRequire(import.meta.url)
const baseProcessor = markdown.processors.markdown

/**
 * `eslint-plugin-markdown` parses with its own nested copy of
 * `mdast-util-from-markdown`; resolving from there keeps this processor on the
 * exact parser (and version) that produced the blocks it renames.
 */
const fromMarkdown = createRequire(
  require.resolve("eslint-plugin-markdown/lib/processor.js")
)("mdast-util-from-markdown")

const TITLE_RE = /(?:^|\s)title=(?:"([^"]+)"|'([^']+)')/
const DISABLE_RE = /^\{\/\*\s*eslint-disable\s*([^*]*?)\s*\*\/\}$/

/** Suppressed rules per block, keyed by the MDX file being linted. */
const suppressionsByFile = new Map()

/**
 * Collects the fenced code blocks `eslint-plugin-markdown` would emit — every
 * `code` node carrying a language — in the same depth-first order, so index `i`
 * here is index `i` there. Each is paired with the node that precedes it, which
 * is where an `{/* eslint-disable *\/}` directive would sit.
 */
function collectCodeNodes(text) {
  const found = []
  const visit = (node) => {
    const children = node.children ?? []
    children.forEach((child, index) => {
      if (child.type === "code" && child.lang) {
        found.push({ node: child, previous: children[index - 1] ?? null })
      }
      visit(child)
    })
  }
  visit(fromMarkdown(text))
  return found
}

/**
 * The rules an `{/* eslint-disable a, b *\/}` MDX comment directly above a block
 * turns off, `"all"` when it names none, or `null` when there's no directive.
 *
 * MDX has no HTML comments, so `eslint-plugin-markdown`'s own
 * `<!-- eslint-disable -->` escape hatch is unavailable here — it fails the MDX
 * compile. Messages are dropped in `postprocess` rather than by injecting an
 * ESLint comment into the block, which would shift every reported line.
 */
function suppressedRules(previous) {
  if (!previous || previous.type !== "paragraph") {
    return null
  }
  const [child, ...rest] = previous.children ?? []
  if (rest.length || child?.type !== "text") {
    return null
  }
  const match = DISABLE_RE.exec(child.value.trim())
  if (!match) {
    return null
  }
  const named = match[1]
    .split(",")
    .map((rule) => rule.trim())
    .filter(Boolean)
  return named.length ? new Set(named) : "all"
}

/**
 * The path a block's `title=` meta names, or `null` when the title isn't a
 * source path for this block's language (prose titles, `title="Example"`, a
 * `.json` title on a ```ts fence).
 */
function titlePath(node, blockExtension) {
  const match = TITLE_RE.exec(node.meta ?? "")
  const raw = match?.[1] ?? match?.[2]
  if (!raw) {
    return null
  }
  const normalized = raw.trim().replace(/^\.\//, "")
  if (
    !normalized ||
    normalized.startsWith("/") ||
    normalized.split("/").includes("..") ||
    /\s/.test(normalized)
  ) {
    return null
  }
  if (path.extname(normalized) !== `.${blockExtension}`) {
    return null
  }
  return normalized
}

/**
 * Wraps `markdown/markdown` with two things the docs need.
 *
 * 1. A code block titled with a path is linted under that path instead of under
 *    `<n>.<ext>`. `@medusajs/eslint-plugin` scopes most of its rules by where a
 *    file lives — `src/api/**`, `src/subscribers/*`, `src/admin/widgets/**` —
 *    and under the stock processor every block is `page.mdx/7.ts`, so those
 *    rules can never match. The docs already state the path in the fence meta:
 *
 *        ```ts title="src/api/custom/route.ts"
 *
 *    so the block becomes `page.mdx/7/src/api/custom/route.ts`. The leading
 *    index keeps two blocks that share a title distinct, and leaves the
 *    `src/...` segments intact for `**`-anchored patterns to match. Blocks
 *    without a usable title keep their original name and stay out of every
 *    path-scoped rule.
 *
 * 2. An `{/* eslint-disable *\/}` MDX comment above a block turns rules off for
 *    it — the escape hatch a page needs when a block is a deliberate
 *    counter-example.
 *
 * Renaming is all-or-nothing per file: if the local parse doesn't line up with
 * the base processor's blocks one-for-one, the base names are used unchanged
 * and no suppression is applied.
 */
export const titledMarkdownProcessor = {
  meta: {
    name: "medusa-docs/titled-markdown",
    version: baseProcessor.meta?.version,
  },
  supportsAutofix: true,
  preprocess(text, filename) {
    const blocks = baseProcessor.preprocess(text, filename)
    const found = collectCodeNodes(text)

    suppressionsByFile.delete(filename)

    if (found.length !== blocks.length) {
      return blocks
    }

    suppressionsByFile.set(
      filename,
      found.map(({ previous }) => suppressedRules(previous))
    )

    return blocks.map((block, index) => {
      const extension = path.extname(block.filename).slice(1)
      const titled = titlePath(found[index].node, extension)
      return titled ? { ...block, filename: `${index}/${titled}` } : block
    })
  },
  postprocess(messages, filename) {
    const suppressions = suppressionsByFile.get(filename)
    suppressionsByFile.delete(filename)

    const kept = suppressions
      ? messages.map((blockMessages, index) => {
          const suppressed = suppressions[index]
          if (!suppressed) {
            return blockMessages
          }
          return blockMessages.filter(
            (message) =>
              suppressed !== "all" && !suppressed.has(message.ruleId ?? "")
          )
        })
      : messages

    return baseProcessor.postprocess(kept, filename)
  },
}

export default titledMarkdownProcessor
