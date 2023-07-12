import type { MDXComponents } from "mdx/types"
import Security from "./Security"
import type { OpenAPIV3 } from "openapi-types"
import InlineCode from "./InlineCode"

export type ScopeType = {
  specs: OpenAPIV3.Document
}

const getCustomComponents = (scope?: ScopeType): MDXComponents => {
  return {
    Security: () => <Security specs={scope?.specs} />,
    code: InlineCode,
  }
}

export default getCustomComponents
