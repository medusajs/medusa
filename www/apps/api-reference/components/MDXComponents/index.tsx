import type { MDXComponents } from "mdx/types"
import Security from "./Security"
import type { OpenAPIV3 } from "openapi-types"
import H2 from "./H2"
import { CodeMdx, Kbd, NextLink } from "docs-ui"

export type ScopeType = {
  specs?: OpenAPIV3.Document
  addToSidebar?: boolean
}

const getCustomComponents = (scope?: ScopeType): MDXComponents => {
  return {
    Security: () => <Security specs={scope?.specs} />,
    code: CodeMdx,
    a: NextLink,
    h2: (props) => <H2 addToSidebar={scope?.addToSidebar} {...props} />,
    kbd: Kbd,
  }
}

export default getCustomComponents
