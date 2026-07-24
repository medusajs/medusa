import React from "react"
import type { MDXComponents } from "mdx/types"
import Security from "./Security"
import type { OpenAPI } from "types"
import H2 from "./H2"
import { MDXComponents as UiMDXComponents, H3 as UiH3 } from "docs-ui"

export type ScopeType = {
  specs?: OpenAPI.OpenAPIV3.Document
  addToSidebar?: boolean
}

const getCustomComponents = (scope?: ScopeType): MDXComponents => {
  return {
    ...UiMDXComponents,
    Security: () => <Security specs={scope?.specs} />,
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <H2 {...props} />,
    // hide the "#" anchor link next to headings — the reference navigates via
    // real page paths, not in-page hashes (same as tag/operation headings).
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <UiH3 {...props} hideAnchorLink />
    ),
  }
}

export default getCustomComponents
