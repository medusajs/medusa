import React from "react"
import CopyButton from "@site/src/components/CopyButton"
import type { Props } from "@theme/MDXComponents/Code"

const MDXInlineCode: React.FC<Props> = (props) => {
  return (
    <CopyButton
      text={props.children as string}
      buttonClassName="inline-code-copy"
      tooltipClassName="inline-tooltip"
    >
      <code {...props} />
    </CopyButton>
  )
}

export default MDXInlineCode
