import React from "react"
import CopyButton from "@site/src/components/CopyButton"
import type { Props } from "@theme/MDXComponents/Code"
import clsx from "clsx"

const MDXInlineCode: React.FC<Props> = (props) => {
  return (
    <CopyButton
      text={props.children as string}
      buttonClassName={clsx(
        "tw-bg-transparent tw-border-0 tw-p-0 tw-inline tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark",
        "active:[&>code]:tw-bg-medusa-bg-subtle-pressed dark:active:[&>code]:tw-bg-medusa-bg-subtle-pressed-dark",
        "focus:[&>code]:tw-bg-medusa-bg-subtle-pressed dark:focus:[&>code]:tw-bg-medusa-bg-subtle-pressed-dark",
        "hover:[&>code]:tw-bg-medusa-bg-subtle-hover dark:hover:[&>code]:tw-bg-medusa-bg-base-hover-dark"
      )}
    >
      <code
        {...props}
        className={clsx(
          "tw-border tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark",
          "tw-text-medusa-text-subtle dark:tw-text-medusa-text-subtle-dark tw-leading-6"
        )}
      />
    </CopyButton>
  )
}

export default MDXInlineCode
