import type { MDXComponents } from "mdx/types"
import Security from "./Security"
import type { OpenAPIV3 } from "openapi-types"
import InlineCode from "./InlineCode"
import Link from "./Link"

export type ScopeType = {
  specs: OpenAPIV3.Document
}

const getCustomComponents = (scope?: ScopeType): MDXComponents => {
  return {
    Security: () => <Security specs={scope?.specs} />,
    code: InlineCode,
    a: Link,
  }
}

export default getCustomComponents
