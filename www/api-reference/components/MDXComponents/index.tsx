import type { MDXComponents } from "mdx/types"
import Security from "./Security"
import type { OpenAPIV3 } from "openapi-types"
import Link from "./Link"
import CodeWrapper from "./CodeWrapper"
import H2 from "./H2"
import Kbd from "./Kbd"

export type ScopeType = {
  specs?: OpenAPIV3.Document
  addToSidebar?: boolean
}

const getCustomComponents = (scope?: ScopeType): MDXComponents => {
  return {
    Security: () => <Security specs={scope?.specs} />,
    code: CodeWrapper,
    a: Link,
    h2: (props) => <H2 addToSidebar={scope?.addToSidebar} {...props} />,
    kbd: Kbd,
  }
}

export default getCustomComponents
