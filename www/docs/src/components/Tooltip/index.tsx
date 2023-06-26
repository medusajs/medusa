import React, { useState, useEffect } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import type { ITooltip } from "react-tooltip"
import uuid from "react-uuid"
import "react-tooltip/dist/react-tooltip.css"

type TooltipProps = {
  text?: string
  tooltipClassName?: string
  html?: string
} & React.HTMLAttributes<HTMLSpanElement> &
  ITooltip

const Tooltip: React.FC<TooltipProps> = ({
  text = "",
  tooltipClassName = "",
  children,
  html = "",
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
        className={tooltipClassName}
        wrapper="span"
      />
    </>
  )
}

export default Tooltip
