import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  MDXComponents as UiMdxComponents,
  InlineThemeImage,
  InlineIcon,
  EnterpriseNotice,
  PermissionsBadge,
  H1,
} from "docs-ui"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  InlineThemeImage,
  InlineIcon,
  EnterpriseNotice,
  PermissionsBadge,
  h1: (props) => <H1 variant="content" {...props} />,
}

export default MDXComponents
