import React from "react"
import type { Props } from "@theme/MDXComponents/Heading"
import MDXHeading from "@theme/MDXComponents/Heading"
import { useDoc } from "@docusaurus/theme-common/internal"
import { DocContextValue } from "@medusajs/docs"
import { Badge, BadgeVariant } from "docs-ui"
import clsx from "clsx"

const H1 = ({ className, ...props }: Omit<Props, "key">) => {
  const {
    frontMatter: { badge },
  } = useDoc() as DocContextValue

  return (
    <header className={clsx(badge && "flex items-center gap-0.5 mb-2")}>
      <MDXHeading
        as="h1"
        {...props}
        className={clsx(className, badge && "!mb-0")}
      />
      {badge && (
        <Badge variant={badge.variant as BadgeVariant}>{badge.text}</Badge>
      )}
    </header>
  )
}

export default H1
