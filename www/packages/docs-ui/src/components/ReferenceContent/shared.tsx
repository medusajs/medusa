import React from "react"
import { MDXComponents } from "@/components/MDXComponents"
import { MarkdownContent } from "@/components/MarkdownContent"

type MdxComponentProps = React.HTMLAttributes<HTMLElement> & {
  href?: string
}

/**
 * The same components MDX pages use, so rendered references match their
 * styling (headings, inline code, links, lists, ...).
 */
export const Mdx = MDXComponents as Record<
  string,
  React.ComponentType<MdxComponentProps>
>

/**
 * Block elements that must not render inside a heading. `p` is included so its
 * children unwrap inline (with `unwrapDisallowed`), and the list/blockquote/etc.
 * elements guard against any block markdown that slips through the escaping in
 * {@link escapeLeadingBlockMarker}.
 */
const DISALLOWED_HEADING_ELEMENTS = [
  "p",
  "ol",
  "ul",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "img",
]

/**
 * Escapes a leading markdown block marker so heading text isn't parsed as a
 * block — e.g. "1. Create ..." must stay literal text, not an ordered list.
 */
function escapeLeadingBlockMarker(text: string): string {
  return text
    .replace(/^(\s*)(\d+)([.)])(\s)/, "$1$2\\$3$4")
    .replace(/^(\s*)([-*+>#])(\s)/, "$1\\$2$3")
}

/**
 * Renders a heading (h1–h4) with the shared MDX heading components. Heading
 * content is phrasing content in the MDX theme, so string text is rendered as
 * *inline* markdown (inline code, links) via {@link MarkdownContent} with block
 * elements disallowed and unwrapped.
 */
export const DocHeading = ({
  level,
  id,
  className,
  children,
}: {
  level: number
  id?: string
  className?: string
  children: React.ReactNode
}) => {
  const Heading = Mdx[`h${Math.min(Math.max(level, 1), 4)}`]
  const content =
    typeof children === "string" ? (
      <MarkdownContent
        disallowedElements={DISALLOWED_HEADING_ELEMENTS}
        unwrapDisallowed
      >
        {escapeLeadingBlockMarker(children)}
      </MarkdownContent>
    ) : (
      children
    )
  return (
    <Heading id={id} className={className}>
      {content}
    </Heading>
  )
}
