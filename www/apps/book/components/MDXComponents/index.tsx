import type { MDXComponents as MDXComponentsType } from "mdx/types"
import { Link, MDXComponents as UiMdxComponents } from "docs-ui"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  a: Link,
}

export default MDXComponents
