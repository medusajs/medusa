"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { TooltipProps } from "../Tooltip"
import SpinnerLoading from "../Loading/Spinner"

const Tooltip = dynamic<TooltipProps>(async () => import("../Tooltip"), {
  loading: () => <SpinnerLoading />,
}) as React.FC<TooltipProps>

export type CopyButtonProps = {
  text: string
  buttonClassName?: string
  tooltipClassName?: string
} & React.HTMLAttributes<HTMLDivElement>

const CopyButton = ({
  text,
  buttonClassName = "",
  tooltipClassName = "",
  children,
}: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const copyTimeout = useRef<number | undefined>(undefined)

  const handleCopy = useCallback(async () => {
    const copy = (await import("copy-text-to-clipboard")).default
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
