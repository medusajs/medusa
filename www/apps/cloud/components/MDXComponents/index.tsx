import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  MDXComponents as UiMdxComponents,
  InlineThemeImage,
  InlineIcon,
  H1,
} from "docs-ui"
import { RolesBadge } from "../RolesBadge"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  InlineThemeImage,
  InlineIcon,
  RolesBadge,
  h1: (props) => <H1 variant="content" {...props} />,
}

export default MDXComponents
