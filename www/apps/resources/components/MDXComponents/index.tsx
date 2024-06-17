import type { MDXComponents as MDXComponentsType } from "mdx/types"
import { Link, MDXComponents as UiMdxComponents, TypeList } from "docs-ui"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  a: Link,
  TypeList,
}

export default MDXComponents
