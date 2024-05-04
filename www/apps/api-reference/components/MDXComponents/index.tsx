import type { MDXComponents } from "mdx/types"
import Security from "./Security"
import type { OpenAPIV3 } from "openapi-types"
import H2 from "./H2"
import { Link, MDXComponents as UiMDXComponents } from "docs-ui"

export type ScopeType = {
  specs?: OpenAPIV3.Document
  addToSidebar?: boolean
}

const getCustomComponents = (scope?: ScopeType): MDXComponents => {
  return {
    ...UiMDXComponents,
    Security: () => <Security specs={scope?.specs} />,
    a: Link,
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <H2 addToSidebar={scope?.addToSidebar} {...props} />
    ),
  }
}

export default getCustomComponents
