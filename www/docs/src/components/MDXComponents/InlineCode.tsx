import React from "react"
import CopyButton from "@site/src/components/CopyButton"
import type { Props } from "@theme/MDXComponents/Code"
import clsx from "clsx"

const MDXInlineCode: React.FC<Props> = (props) => {
  return (
    <CopyButton
      text={props.children as string}
      buttonClassName={clsx(
        "bg-transparent border-0 p-0 inline text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark",
        "active:[&>code]:bg-medusa-bg-subtle-pressed dark:active:[&>code]:bg-medusa-bg-subtle-pressed-dark",
        "focus:[&>code]:bg-medusa-bg-subtle-pressed dark:focus:[&>code]:bg-medusa-bg-subtle-pressed-dark",
        "hover:[&>code]:bg-medusa-bg-subtle-hover dark:hover:[&>code]:bg-medusa-bg-base-hover-dark"
      )}
    >
      <code
        {...props}
        className={clsx(
          "border border-solid border-medusa-border-base dark:border-medusa-border-base-dark",
          "text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark leading-6"
        )}
      />
    </CopyButton>
  )
}

export default MDXInlineCode
