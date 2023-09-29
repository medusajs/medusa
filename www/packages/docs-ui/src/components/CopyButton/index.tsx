"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import copy from "copy-text-to-clipboard"
import clsx from "clsx"
import { Tooltip } from "@/components/Tooltip"

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
  const [isCopied, setIsCopied] = useState(false)
  const copyTimeout = useRef<number>(0)

  const handleCopy = useCallback(() => {
    copy(text)
    setIsCopied(true)
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }, [text])

  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])

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
