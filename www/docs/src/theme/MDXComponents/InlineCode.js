import CopyButton from "@site/src/components/CopyButton"
import React, { isValidElement } from "react"

export default function MDXInlineCode(props) {
  return (
    <CopyButton
      text={props.children}
      buttonClassName="inline-code-copy"
      tooltipClassName="inline-tooltip"
    >
      <code {...props} />
    </CopyButton>
  )
}
