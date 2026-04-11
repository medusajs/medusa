"use client"

import React, { useState } from "react"
import clsx from "clsx"
import { Tooltip } from "@/components/Tooltip"
import { useCopy } from "../../hooks/use-copy"

export type CopyButtonChildFn = (props: {
  isCopied: boolean
}) => React.ReactNode

export type CopyButtonProps = {
  text: string
  buttonClassName?: string
  tooltipClassName?: string
  tooltipInnerClassName?: string
  tooltipText?: string
  onCopy?: (
    e:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.TouchEvent<HTMLSpanElement>
  ) => void
  handleTouch?: boolean
  children?: React.ReactNode | CopyButtonChildFn
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy" | "children">

export const CopyButton = ({
  text,
  buttonClassName = "",
  tooltipClassName = "",
  tooltipText = "Copy to Clipboard",
  children,
  className,
  onCopy,
  handleTouch,
  tooltipInnerClassName,
}: CopyButtonProps) => {
  const { isCopied, handleCopy } = useCopy(text)
  const [touchCount, setTouchCount] = useState(0)

  return (
    <Tooltip
      text={isCopied ? `Copied!` : tooltipText}
      tooltipClassName={clsx(tooltipClassName, handleTouch && "!block")}
      className={className}
      innerClassName={tooltipInnerClassName}
    >
      <span
        className={clsx("cursor-pointer", buttonClassName)}
        onClick={(e) => {
          if (touchCount > 0) {
            // prevent the on-click event from triggering if a touch event occurred.
            return
          }
          onCopy?.(e)
          handleCopy()
        }}
        onTouchEnd={(e) => {
          if (!handleTouch) {
            return
          }

          if (touchCount === 0) {
            setTouchCount(touchCount + 1)
          } else {
            onCopy?.(e)
            handleCopy()
            setTouchCount(0)
          }
        }}
        data-testid="copy-button"
      >
        {typeof children === "function" ? children({ isCopied }) : children}
      </span>
    </Tooltip>
  )
}
