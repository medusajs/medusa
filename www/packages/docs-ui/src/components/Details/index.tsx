"use client"

import React, { Suspense, cloneElement, useRef, useState } from "react"
import { Loading } from "@/components/Loading"
import clsx from "clsx"
import { DetailsSummary, DetailsSummaryProps } from "./Summary"
import { useCollapsible } from "../../hooks/use-collapsible"

export type DetailsProps = {
  openInitial?: boolean
  summaryContent?: React.ReactNode
  summaryElm?: React.ReactNode
  heightAnimation?: boolean
} & React.HTMLAttributes<HTMLDetailsElement>

export const Details = ({
  openInitial = false,
  summaryContent,
  summaryElm,
  children,
  heightAnimation = false,
  ...props
}: DetailsProps) => {
  const [open, setOpen] = useState(openInitial)
  const ref = useRef<HTMLDetailsElement>(null)
  const childrenWrapperRef = useRef<HTMLDivElement>(null)
  const { getCollapsibleElms, setCollapsed } = useCollapsible({
    initialValue: !openInitial,
    heightAnimation,
    onClose: () => setOpen(false),
    childrenRef: childrenWrapperRef,
  })

  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    const targetElm = e.target as HTMLElement
    if (targetElm.tagName.toLowerCase() === "a") {
      window.location.href =
        targetElm.getAttribute("href") || window.location.href
      return
    }
    if (targetElm.tagName.toLowerCase() === "code") {
      return
    }
    if (open) {
      setCollapsed(true)
    } else {
      setOpen(true)
      setCollapsed(false)
    }
  }

  return (
    <details
      {...props}
      ref={ref}
      open={open}
      onClick={(event) => {
        event.preventDefault()
      }}
      onToggle={(event) => {
        // this is to avoid event propagation
        // when details are nested, which is a bug
        // in react. Learn more here:
        // https://github.com/facebook/react/issues/22718
        event.stopPropagation()
      }}
      className={clsx(
        "border-medusa-border-base border-y border-solid border-x-0",
        "overflow-hidden [&>summary]:relative",
        props.className
      )}
    >
      {summaryContent && (
        <DetailsSummary
          open={open}
          onClick={handleToggle}
          className="cursor-pointer"
          title={summaryContent}
        />
      )}
      {summaryElm &&
        cloneElement<DetailsSummaryProps>(
          summaryElm as React.ReactElement<
            DetailsSummaryProps,
            React.FunctionComponent<DetailsSummaryProps>
          >,
          {
            open,
            onClick: handleToggle,
          }
        )}
      {getCollapsibleElms(
        <Suspense fallback={<Loading className="!mb-docs_2 !mt-0" />}>
          <div ref={childrenWrapperRef}>{children}</div>
        </Suspense>
      )}
    </details>
  )
}
