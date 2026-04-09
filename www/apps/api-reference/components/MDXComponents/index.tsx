import React from "react"
import type { MDXComponents } from "mdx/types"
import Security from "./Security"
import type { OpenAPI } from "types"
import H2 from "./H2"
import { MDXComponents as UiMDXComponents } from "docs-ui"

export type ScopeType = {
  specs?: OpenAPI.OpenAPIV3.Document
  addToSidebar?: boolean
}

const getCustomComponents = (scope?: ScopeType): MDXComponents => {
  return {
    ...UiMDXComponents,
    Security: () => <Security specs={scope?.specs} />,
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <H2 {...props} />,
  }
}

export default getCustomComponents
