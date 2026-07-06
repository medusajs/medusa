import type { MDXComponents as MDXComponentsType } from "mdx/types"
import { H1, MDXComponents as UiMdxComponents } from "docs-ui"
import Feedback from "../Feedback"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  Feedback,
  h1: (props) => <H1 variant="content" {...props} />,
}

export default MDXComponents
