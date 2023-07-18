import { useState, useEffect } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import type { ITooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

export type TooltipProps = {
  text?: string
  tooltipClassName?: string
  html?: string
} & React.HTMLAttributes<HTMLSpanElement> &
  ITooltip

const Tooltip = ({
  text = "",
  tooltipClassName = "",
  children,
  html = "",
  ...rest
}: TooltipProps) => {
  const [elementId, setElementId] = useState<string | null>(null)

  useEffect(() => {
    async function initElementId() {
      if (!elementId) {
        const uuid = (await import("react-uuid")).default
        setElementId(uuid())
      }
    }

    void initElementId()
  }, [elementId])

  return (
    <>
      <span
        id={elementId || ""}
        data-tooltip-content={text}
        data-tooltip-html={html}
      >
        {children}
      </span>
      <ReactTooltip
        anchorId={elementId || ""}
        className={tooltipClassName}
        wrapper="span"
        {...rest}
      />
    </>
  )
}

export default Tooltip
