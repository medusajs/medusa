import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  Link,
  MDXComponents as UiMdxComponents,
  InlineThemeImage,
  InlineIcon,
} from "docs-ui"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  a: Link,
  InlineThemeImage,
  InlineIcon,
}

export default MDXComponents
