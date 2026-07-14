import type { DocBlock, DocPage, DocTypeListItem } from "types"

export type DocPageToMarkdownOptions = {
  /**
   * When set, root-relative links (`/references/...`) are rewritten to absolute
   * URLs, mirroring the `addUrlToRelativeLink` plugin used for MDX pages.
   */
  baseUrl?: string
}

/**
 * Converts a references {@link DocPage} (the JSON doc-model) into clean Markdown
 * for the `md-content` route (LLM / "copy as markdown" consumption). It is the
 * doc-model analogue of `getCleanMd`: instead of parsing MDX and stripping
 * components, it walks the structured blocks and emits plain Markdown.
 *
 * Type strings are emitted verbatim (they already contain Markdown code spans /
 * links), so generics like `Record<string, T>` never need MDX/JSX escaping.
 */
export function docPageToMarkdown(
  page: DocPage,
  options: DocPageToMarkdownOptions = {}
): string {
  const parts: string[] = [`# ${page.title}`]

  for (const block of page.blocks) {
    const rendered = renderBlock(block)
    if (rendered.trim().length) {
      parts.push(rendered.trim())
    }
  }

  const content = decodeEntities(parts.join("\n\n"))
  return options.baseUrl ? absolutizeLinks(content, options.baseUrl) : content
}

/**
 * Decodes the HTML entities the generator emits for MDX safety (e.g. `&#60;` in
 * type strings). Plain Markdown doesn't need them, and decoded output reads
 * better for LLM / copy-as-markdown consumption.
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&#60;/g, "<")
    .replace(/&#62;/g, ">")
    .replace(/&#123;/g, "{")
    .replace(/&#125;/g, "}")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
}

function renderBlock(block: DocBlock): string {
  switch (block.kind) {
    case "markdown":
      return block.html
    case "heading":
      return `${"#".repeat(Math.min(Math.max(block.level, 2), 6))} ${block.text}`
    case "typeList":
      return [
        block.sectionTitle ? `**${block.sectionTitle}**\n` : "",
        block.types.map((type) => renderTypeItem(type, 0)).join("\n"),
      ]
        .filter(Boolean)
        .join("\n")
    case "codeTabs":
      return block.tabs
        .map((tab) => {
          const meta = tab.title ? ` title="${tab.title}"` : ""
          return `**${tab.label}**\n\n\`\`\`${tab.language}${meta}\n${tab.code}\n\`\`\``
        })
        .join("\n\n")
    case "workflowDiagram":
      // The builder emits a preceding "Steps" heading block, so this renders
      // only the step list.
      return block.workflow.steps
        .map((step) => renderWorkflowStep(step))
        .join("\n")
    case "note": {
      const title = block.title || capitalize(block.variant || "note")
      const body = block.html
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n")
      return `> **${title}**\n>\n${body}`
    }
    case "sourceCodeLink":
      return `[${block.text || "View source code"}](${block.link})`
    case "linkList":
      return block.items
        .map(
          (item) =>
            `- [${item.title}](${item.href})${
              item.description ? ` — ${oneLine(item.description)}` : ""
            }`
        )
        .join("\n")
    case "workflowEvents":
      // The builder emits a preceding "Emitted Events" heading block, so this
      // renders only the event list.
      return `${block.events
        .map((event) => {
          const flags = [
            event.deprecated ? "deprecated" : "",
            event.since ? `since v${event.since}` : "",
          ]
            .filter(Boolean)
            .join(", ")
          const header = `- \`${event.name}\`${flags ? ` (${flags})` : ""}${
            event.description ? `: ${oneLine(event.description)}` : ""
          }`
          const payload = event.payload
            ? `\n\n  \`\`\`ts\n${indent(event.payload, "  ")}\n  \`\`\``
            : ""
          return `${header}${payload}`
        })
        .join("\n")}`
    case "eventsListing":
      return block.categories
        .map((category) => {
          const parts: string[] = []
          if (block.categories.length > 1 && category.title) {
            parts.push(`## ${category.title} Events`)
          }
          parts.push("### Summary\n")
          parts.push(
            [
              "| Event | Description |",
              "| --- | --- |",
              ...category.events.map(
                (event) =>
                  `| [\`${event.name}\`](#${event.id}) | ${
                    event.description ? oneLine(event.description) : ""
                  } |`
              ),
            ].join("\n")
          )
          category.events.forEach((event) => {
            parts.push(`### ${event.name}`)
            if (event.description) {
              parts.push(event.description)
            }
            if (event.payload) {
              parts.push(`#### Payload\n\n${event.payload}`)
            }
            if (event.workflows?.length) {
              parts.push("#### Workflows Emitting this Event\n")
              parts.push(
                event.workflows
                  .map((workflow) => `- [${workflow.name}](${workflow.href})`)
                  .join("\n")
              )
            }
          })
          return parts.join("\n\n")
        })
        .join("\n\n---\n\n")
    case "table": {
      const header = `| ${block.headers.join(" | ")} |`
      const divider = `| ${block.headers.map(() => "---").join(" | ")} |`
      const rows = block.rows.map((row) => `| ${row.join(" | ")} |`)
      return [header, divider, ...rows].join("\n")
    }
    case "badges":
      return ""
    default:
      return ""
  }
}

function renderTypeItem(type: DocTypeListItem, level: number): string {
  const indentation = "  ".repeat(level)
  const flags = [
    type.optional ? "optional" : "",
    type.defaultValue ? `default: ${type.defaultValue}` : "",
    type.deprecated?.is_deprecated ? "deprecated" : "",
  ]
    .filter(Boolean)
    .join(", ")

  const parts = [`\`${type.name}\``]
  if (type.type) {
    parts.push(type.type)
  }
  let line = `${indentation}- ${parts.join(": ")}`
  if (flags) {
    line += ` (${flags})`
  }
  if (type.description) {
    line += ` — ${oneLine(type.description)}`
  }

  const children = (type.children || [])
    .map((child) => renderTypeItem(child, level + 1))
    .join("\n")

  return children.length ? `${line}\n${children}` : line
}

type WorkflowStepLike = {
  type: string
  name?: string
  description?: string
  link?: string
  depth?: number
  condition?: string
  steps?: WorkflowStepLike[]
}

function renderWorkflowStep(step: WorkflowStepLike): string {
  const indentation = "  ".repeat(Math.max((step.depth || 1) - 1, 0))

  if (step.type === "when") {
    const condition = step.condition ? ` (when: ${step.condition})` : ""
    const nested = (step.steps || [])
      .map((child) => renderWorkflowStep(child))
      .join("\n")
    return `${indentation}- **when**${condition}\n${nested}`
  }

  const label = step.link ? `[${step.name}](${step.link})` : step.name || ""
  const desc = step.description ? `: ${oneLine(step.description)}` : ""
  return `${indentation}- ${label}${desc}`
}

function oneLine(text: string): string {
  return text.replace(/\s*\n+\s*/g, " ").trim()
}

function indent(text: string, prefix: string): string {
  return text
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n")
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Prepends `baseUrl` to root-relative Markdown links (`](/...)`). */
function absolutizeLinks(content: string, baseUrl: string): string {
  const normalizedBase = baseUrl.replace(/\/$/, "")
  return content.replace(/\]\(\/(?!\/)/g, `](${normalizedBase}/`)
}
