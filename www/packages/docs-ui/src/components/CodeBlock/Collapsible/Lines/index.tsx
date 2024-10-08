"use client"

import React, { useMemo } from "react"
import { CollapsibleReturn } from "../../../../hooks"

export type CodeBlockCollapsibleLinesProps = {
  children: React.ReactNode
  type: "start" | "end"
} & Omit<CollapsibleReturn, "setCollapsed">

export const CodeBlockCollapsibleLines = ({
  children,
  type,
  collapsed,
  getCollapsibleElms,
}: CodeBlockCollapsibleLinesProps) => {
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

  return getCollapsibleElms(shownChildren)
}
