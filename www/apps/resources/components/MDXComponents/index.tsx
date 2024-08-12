import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  Link,
  MDXComponents as UiMdxComponents,
  TypeList,
  WorkflowDiagram,
} from "docs-ui"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  a: Link,
  TypeList,
  WorkflowDiagram,
}

export default MDXComponents
