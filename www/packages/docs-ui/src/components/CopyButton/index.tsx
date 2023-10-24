"use client"

import React from "react"
import clsx from "clsx"
import { Tooltip } from "@/components"
import { useCopy } from "../../hooks"

export type CopyButtonProps = {
  text: string
  buttonClassName?: string
  tooltipClassName?: string
} & React.HTMLAttributes<HTMLDivElement>

export const CopyButton = ({
  text,
  buttonClassName = "",
  tooltipClassName = "",
  children,
  className,
}: CopyButtonProps) => {
  const { isCopied, handleCopy } = useCopy(text)

  return (
    <Tooltip
      text={isCopied ? `Copied!` : `Copy to Clipboard`}
      tooltipClassName={tooltipClassName}
      className={className}
    >
      <span
        className={clsx("cursor-pointer", buttonClassName)}
        onClick={handleCopy}
      >
        {children}
      </span>
    </Tooltip>
  )
}
