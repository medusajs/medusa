import React from "react"
import { MDXComponents } from "@/components/MDXComponents"

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
 * Renders heading text as *inline* markdown: inline code (`` `code` ``) and
 * links (`[text](url)`) only. Heading content is phrasing content in the MDX
 * theme, so block constructs must stay literal — notably a leading `1.` must
 * not become an ordered list. Numeric HTML entities (from signature titles,
 * e.g. `&#60;`) are decoded to their characters.
 */
function renderInlineHeading(text: string): React.ReactNode {
  const Code = Mdx["code"]
  const Anchor = Mdx["a"]
  const decoded = text.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  )

  const nodes: React.ReactNode[] = []
  const regex = /`([^`]+)`|\[([^\]]+)\]\(([^)]*)\)/g
  let lastIndex = 0
  let key = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(decoded)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(decoded.slice(lastIndex, match.index))
    }
    if (match[1] !== undefined) {
      nodes.push(<Code key={key++}>{match[1]}</Code>)
    } else {
      nodes.push(
        <Anchor key={key++} href={match[3]}>
          {match[2]}
        </Anchor>
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < decoded.length) {
    nodes.push(decoded.slice(lastIndex))
  }
  return nodes
}

/** Renders a heading (h1–h4) with the shared MDX heading components. */
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
    typeof children === "string" ? renderInlineHeading(children) : children
  return (
    <Heading id={id} className={className}>
      {content}
    </Heading>
  )
}
