"use client"

import clsx from "clsx"
import React from "react"
import { CollapsibleReturn } from "../../../../hooks"
import { Button } from "@medusajs/ui"

export type CodeBlockCollapsibleButtonProps = {
  type: "start" | "end"
  expandButtonLabel?: string
  className?: string
} & Omit<CollapsibleReturn, "getCollapsibleElms">

export const CodeBlockCollapsibleButton = ({
  type,
  expandButtonLabel = "Show more",
  collapsed,
  setCollapsed,
  className,
}: CodeBlockCollapsibleButtonProps) => {
  if (!collapsed) {
    return <></>
  }

  return (
    <>
      {type === "start" && (
        <Button
          className={clsx(
            "font-base w-full p-docs_0.5 !shadow-none",
            "bg-medusa-contrast-button hover:bg-medusa-contrast-button-hover",
            "txt-compact-xsmall text-medusa-contrast-fg-secondary",
            type === "start" && "rounded-t-docs_DEFAULT rounded-b-none",
            className
          )}
          onClick={() => setCollapsed(false)}
        >
          {expandButtonLabel}
        </Button>
      )}
      {type === "end" && (
        <Button
          className={clsx(
            "font-base w-full p-docs_0.5 !shadow-none",
            "bg-medusa-contrast-button hover:bg-medusa-contrast-button-hover",
            "txt-compact-xsmall text-medusa-contrast-fg-secondary",
            "rounded-t-none rounded-b-docs_DEFAULT",
            className
          )}
          onClick={() => setCollapsed(false)}
        >
          {expandButtonLabel}
        </Button>
      )}
    </>
  )
}
