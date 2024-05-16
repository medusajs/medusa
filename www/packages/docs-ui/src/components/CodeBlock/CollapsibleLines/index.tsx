"use client"

import clsx from "clsx"
import React, { useMemo } from "react"
import { Button } from "@/components"
import { useCollapsible } from "../../../hooks"

export type CodeBlockCollapsibleLinesProps = {
  expandButtonLabel?: string
  children: React.ReactNode
  type: "start" | "end"
}

export const CodeBlockCollapsibleLines = ({
  expandButtonLabel = "Show more",
  children,
  type,
}: CodeBlockCollapsibleLinesProps) => {
  const { getCollapsibleElms, collapsed, setCollapsed } = useCollapsible({
    unmountOnExit: false,
    translateEnabled: false,
    heightAnimation: true,
  })

  const shownChildren: React.ReactNode = useMemo(() => {
    const isStart = type === "start"
    return (
      <>
        {collapsed && Array.isArray(children)
          ? children.slice(isStart ? -2 : 0, isStart ? undefined : 2)
          : children}
      </>
    )
  }, [children, collapsed])

  return (
    <>
      {getCollapsibleElms(shownChildren)}
      {collapsed && (
        <span
          className={clsx(
            "absolute w-full flex justify-center items-start",
            "h-docs_4 p-docs_0.5 xs:pl-[17%]",
            type === "start" && "bg-code-fade-ver-top top-0",
            type === "end" && "bg-code-fade-ver-bottom bottom-0"
          )}
        >
          <Button className="font-base" onClick={() => setCollapsed(false)}>
            {expandButtonLabel}
          </Button>
        </span>
      )}
    </>
  )
}
