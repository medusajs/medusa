import React from "react"
import CopyButton from "@site/src/components/CopyButton"
import type { Props } from "@theme/MDXComponents/Code"

const MDXInlineCode: React.FC<Props> = (props) => {
  return (
    <CopyButton
      text={props.children as string}
      buttonClassName="tw-bg-transparent tw-border-0 tw-p-0 tw-inline tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark"
    >
      <code {...props} />
    </CopyButton>
  )
}

export default MDXInlineCode
