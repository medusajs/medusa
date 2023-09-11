import clsx from "clsx"
import { useState, useEffect } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import type { ITooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

export type TooltipProps = {
  text?: string
  tooltipClassName?: string
  html?: string
  tooltipChildren?: React.ReactNode
} & React.HTMLAttributes<HTMLSpanElement> &
  ITooltip

const Tooltip = ({
  text = "",
  tooltipClassName = "",
  children,
  html = "",
  tooltipChildren,
  ...rest
}: TooltipProps) => {
  const [elementId, setElementId] = useState<string | null>(null)

  useEffect(() => {
    async function initElementId() {
      if (!elementId) {
        const uuid = (await import("uuid")).v4
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
        className={clsx(
          "!border-medusa-border-base dark:!border-medusa-border-base-dark !border !border-solid",
          "!text-compact-x-small-plus !shadow-tooltip dark:!shadow-tooltip-dark !rounded",
          "!py-0.4 !z-[1000] hidden !px-1 lg:block",
          tooltipClassName
        )}
        wrapper="span"
        noArrow={true}
        positionStrategy={"fixed"}
        {...rest}
      >
        {tooltipChildren}
      </ReactTooltip>
    </>
  )
}

export default Tooltip
