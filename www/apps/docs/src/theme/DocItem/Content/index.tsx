import React from "react"
import clsx from "clsx"
import { ThemeClassNames } from "@docusaurus/theme-common"
import { useDoc } from "@docusaurus/theme-common/internal"
import Heading from "@theme/Heading"
import MDXContent from "@theme/MDXContent"
import type { Props } from "@theme/DocItem/Content"
import { DocContextValue } from "@medusajs/docs"
import { Badge, BadgeVariant } from "docs-ui"

/**
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/
function useSyntheticTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc()
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === "undefined"
  if (!shouldRender) {
    return null
  }
  return metadata.title
}

export default function DocItemContent({ children }: Props): JSX.Element {
  const {
    frontMatter: { badge },
  } = useDoc() as DocContextValue
  const syntheticTitle = useSyntheticTitle()
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}>
      {syntheticTitle && (
        <header
          className={clsx(badge && "md:flex md:items-center md:gap-0.5 mb-2")}
        >
          <Heading as="h1" className={clsx(badge && "!mb-0")}>
            {syntheticTitle}
            {badge && (
              <Badge
                variant={badge.variant as BadgeVariant}
                className="md:hidden ml-1 align-middle"
              >
                {badge.text}
              </Badge>
            )}
          </Heading>
          {badge && (
            <Badge
              variant={badge.variant as BadgeVariant}
              className={clsx("md:block hidden")}
            >
              {badge.text}
            </Badge>
          )}
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  )
}
