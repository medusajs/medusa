import React from "react"
import type { Props } from "@theme/MDXComponents/Code"
import { InlineCode } from "docs-ui"

const MDXInlineCode: React.FC<Props> = (props) => {
  return <InlineCode forceInline={true} {...props} />
}

export default MDXInlineCode
