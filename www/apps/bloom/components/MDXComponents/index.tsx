import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  MDXComponents as UiMdxComponents,
  InlineThemeImage,
  InlineIcon,
  CodeMdx,
  H1,
} from "docs-ui"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  InlineThemeImage,
  InlineIcon,
  code: (props) => (
    <CodeMdx
      {...props}
      codeBlockProps={{
        noAskAi: true,
        isTerminal: false,
        title: props.title || "Prompt",
        noReport: true,
      }}
    />
  ),
  h1: (props) => <H1 variant="content" {...props} />,
}

export default MDXComponents
