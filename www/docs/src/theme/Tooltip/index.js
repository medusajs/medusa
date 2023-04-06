import React, { useState, useEffect } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import uuid from "react-uuid"
import "react-tooltip/dist/react-tooltip.css"

export default function Tooltip({ children, text, tooltipClassName }) {
  const [elementId, setElementId] = useState(null)

  useEffect(() => {
    if (!elementId) {
      setElementId(uuid())
    }
  }, [elementId])

  return (
    <>
      <span id={elementId} data-tooltip-content={text}>
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
