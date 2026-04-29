"use client"

import clsx from "clsx"
import React from "react"

export type DottedSeparatorProps = {
  wrapperClassName?: string
  className?: string
  "data-testid"?: string
}

export const DottedSeparator = ({
  className,
  wrapperClassName,
  "data-testid": testId,
}: DottedSeparatorProps) => {
  return (
    <div
      className={clsx("px-docs_0.75 my-docs_0.75", wrapperClassName)}
      data-testid={testId}
    >
      <span
        className={clsx(
          "block w-full h-px relative bg-border-dotted",
          "bg-[length:4px_1px] bg-repeat-x bg-bottom",
          className
        )}
      ></span>
    </div>
  )
}
