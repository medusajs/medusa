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
  return (
    <Heading id={id} className={className}>
      {children}
    </Heading>
  )
}
