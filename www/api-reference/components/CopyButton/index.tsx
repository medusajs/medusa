"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import copy from "copy-text-to-clipboard"
import clsx from "clsx"
import Tooltip from "../Tooltip"

type CopyButtonProps = {
  text: string
  buttonClassName?: string
  tooltipClassName?: string
} & React.HTMLAttributes<HTMLDivElement>

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  buttonClassName = "",
  tooltipClassName = "",
  children,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const copyTimeout = useRef<number | undefined>(undefined)

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

export default CopyButton
