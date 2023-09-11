import React, { useState, useEffect } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import type { ITooltip } from "react-tooltip"
import uuid from "react-uuid"
import "react-tooltip/dist/react-tooltip.css"
import clsx from "clsx"

type TooltipProps = {
  text?: string
  tooltipClassName?: string
  html?: string
  tooltipChildren?: React.ReactNode
} & React.HTMLAttributes<HTMLSpanElement> &
  ITooltip

const Tooltip: React.FC<TooltipProps> = ({
  text = "",
  tooltipClassName = "",
  children,
  html = "",
  tooltipChildren,
  ...tooltipProps
}) => {
  const [elementId, setElementId] = useState(null)

  useEffect(() => {
    if (!elementId) {
      setElementId(uuid())
    }
  }, [elementId])

  return (
    <>
      <span id={elementId} data-tooltip-content={text} data-tooltip-html={html}>
        {children}
      </span>
      <ReactTooltip
        anchorId={elementId}
        className={clsx(tooltipClassName, "z-[399]")}
        wrapper="span"
        {...tooltipProps}
      >
        {tooltipChildren}
      </ReactTooltip>
    </>
  )
}

export default Tooltip
