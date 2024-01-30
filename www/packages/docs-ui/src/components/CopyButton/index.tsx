"use client"

import React from "react"
import clsx from "clsx"
import { Tooltip } from "@/components"
import { useCopy } from "../../hooks"

export type CopyButtonProps = {
  text: string
  buttonClassName?: string
  tooltipClassName?: string
  tooltipText?: string
  onCopy?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy">

export const CopyButton = ({
  text,
  buttonClassName = "",
  tooltipClassName = "",
  tooltipText = "Copy to Clipboard",
  children,
  className,
  onCopy,
}: CopyButtonProps) => {
  const { isCopied, handleCopy } = useCopy(text)

  return (
    <Tooltip
      text={isCopied ? `Copied!` : tooltipText}
      tooltipClassName={tooltipClassName}
      className={className}
    >
      <span
        className={clsx("cursor-pointer", buttonClassName)}
        onClick={(e) => {
          onCopy?.(e)
          handleCopy()
        }}
      >
        {children}
      </span>
    </Tooltip>
  )
}
