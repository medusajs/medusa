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
 * Renders a heading (h1–h4) with the shared MDX heading components. Heading
 * text can contain inline markdown (e.g. an overloaded signature title with a
 * linked return type), so string children are rendered through the markdown
 * pipeline — matching how the MDX theme rendered heading text — with the block
 * wrapper unwrapped so the content stays inline.
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
        components={{
          ...MDXComponents,
          p: ({ children }: React.HTMLAttributes<HTMLElement>) => (
            <>{children}</>
          ),
        }}
      >
        {children}
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
