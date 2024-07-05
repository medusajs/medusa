"use client"

import React from "react"
import clsx from "clsx"
import { CopyButton } from "@/components"

export type InlineCodeProps = React.ComponentProps<"code">

export const InlineCode = (props: InlineCodeProps) => {
  return (
    <CopyButton
      text={props.children as string}
      buttonClassName={clsx(
        "bg-transparent border-0 p-0 inline text-medusa-fg-subtle group",
        "font-monospace"
      )}
    >
      <code
        {...props}
        className={clsx(
          "border-medusa-tag-neutral-border border",
          "text-medusa-tag-neutral-text",
          "bg-medusa-tag-neutral-bg font-monospace text-code-label rounded-docs_sm py-0 px-[6px]",
          "group-active:bg-medusa-bg-subtle-pressed group-focus:bg-medusa-bg-subtle-pressed",
          "group-hover:bg-medusa-tag-neutral-bg-hover",
          props.className
        )}
      />
    </CopyButton>
  )
}
