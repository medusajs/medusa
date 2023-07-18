import type { MDXComponents } from "mdx/types"
import Security from "./Security"
import type { OpenAPIV3 } from "openapi-types"
import Link from "./Link"
import CodeWrapper from "./CodeWrapper"

export type ScopeType = {
  specs: OpenAPIV3.Document
}

const getCustomComponents = (scope?: ScopeType): MDXComponents => {
  return {
    Security: () => <Security specs={scope?.specs} />,
    code: CodeWrapper,
    a: Link,
  }
}

export default getCustomComponents
