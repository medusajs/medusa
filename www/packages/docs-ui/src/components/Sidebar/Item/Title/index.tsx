"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import clsx from "clsx"
import { Tooltip as ReactTooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

export type SidebarItemTitleProps = {
  title: string
  isTitleOneWord: boolean
} & React.HTMLAttributes<HTMLSpanElement>

/**
 * Renders a sidebar item's title. Single-word titles are truncated with an
 * ellipsis, and when a title is actually truncated a tooltip showing the full
 * title is displayed after hovering over it for a second.
 */
export const SidebarItemTitle = ({
  title,
  isTitleOneWord,
  className,
  ...props
}: SidebarItemTitleProps) => {
  const titleRef = useRef<HTMLSpanElement>(null)
  const tooltipId = useId()
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const element = titleRef.current
    if (!element || !isTitleOneWord) {
      setIsTruncated(false)
      return
    }

    const checkTruncation = () => {
      setIsTruncated(element.scrollWidth > element.clientWidth)
    }

    checkTruncation()

    if (typeof ResizeObserver === "undefined") {
      return
    }

    const resizeObserver = new ResizeObserver(checkTruncation)
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [title, isTitleOneWord])

  return (
    <>
      <span
        ref={titleRef}
        // `truncate` sets `overflow: hidden`, which makes this span a scroll
        // container. Combined with the sidebar's `aside * { overscroll-behavior-y:
        // contain }` rule, hovering a truncated title would trap the wheel and
        // prevent the sidebar from scrolling, so reset overscroll behavior here.
        className={clsx(
          isTitleOneWord && "truncate overscroll-y-auto",
          className
        )}
        data-testid="sidebar-item-title"
        data-tooltip-id={isTruncated ? tooltipId : undefined}
        data-tooltip-content={isTruncated ? title : undefined}
        {...props}
      >
        {title}
      </span>
      {isTruncated &&
        typeof document !== "undefined" &&
        createPortal(
          <ReactTooltip
            id={tooltipId}
            delayShow={500}
            place="right"
            className={clsx(
              "!text-compact-x-small !shadow-elevation-tooltip dark:!shadow-elevation-tooltip-dark !rounded-docs_DEFAULT",
              "!py-docs_0.25 !z-[399] hidden !px-docs_0.5 lg:block",
              "!bg-medusa-bg-component",
              "!text-medusa-fg-base text-center",
              "!max-w-[240px] !break-words"
            )}
            wrapper="span"
            noArrow={true}
            positionStrategy="fixed"
            opacity={1}
          />,
          document.body
        )}
    </>
  )
}
