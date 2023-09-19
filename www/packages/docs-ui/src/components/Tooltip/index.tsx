"use client"

import React, { useEffect, useState } from "react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import type { ITooltip } from "react-tooltip"
import clsx from "clsx"
import "react-tooltip/dist/react-tooltip.css"
import uuid from "react-uuid"

export type TooltipProps = {
  text?: string
  tooltipClassName?: string
  html?: string
  tooltipChildren?: React.ReactNode
} & React.HTMLAttributes<HTMLSpanElement> &
  ITooltip

export const Tooltip = ({
  text = "",
  tooltipClassName = "",
  children,
  html = "",
  tooltipChildren,
  ...tooltipProps
}: TooltipProps) => {
  const [elementId, setElementId] = useState<string>("")

  useEffect(() => {
    if (!elementId) {
      setElementId(uuid())
    }
  }, [elementId])

  return (
    <>
      <span
        id={elementId}
        data-tooltip-content={text}
        data-tooltip-html={html}
        data-tooltip-id={elementId}
      >
        {children}
      </span>
      <ReactTooltip
        anchorId={elementId}
        // anchorSelect={elementId ? `#${elementId}` : undefined}
        className={clsx(
          "!border-medusa-border-base dark:!border-medusa-border-base-dark !border !border-solid",
          "!text-compact-x-small-plus !shadow-tooltip dark:!shadow-tooltip-dark !rounded-docs_DEFAULT",
          "!py-docs_0.4 !z-[399] hidden !px-docs_1 lg:block",
          "!bg-medusa-bg-base dark:!bg-medusa-bg-base-dark",
          "!text-medusa-fg-subtle dark:!text-medusa-fg-subtle-dark",
          tooltipClassName
        )}
        wrapper="span"
        noArrow={true}
        positionStrategy={"fixed"}
        {...tooltipProps}
      >
        {tooltipChildren}
      </ReactTooltip>
    </>
  )
}
