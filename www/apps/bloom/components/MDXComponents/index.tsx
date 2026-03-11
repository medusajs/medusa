import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  MDXComponents as UiMdxComponents,
  InlineThemeImage,
  InlineIcon,
  CodeMdx,
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
}

export default MDXComponents
