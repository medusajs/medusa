import React from "react"
import { CollapsibleReturn } from "../../../../hooks/use-collapsible"

export type CodeBlockCollapsibleLinesProps = {
  children: React.ReactNode
  type: "start" | "end"
} & Pick<CollapsibleReturn, "collapsed">

export const CodeBlockCollapsibleLines = ({
  children,
  type,
  collapsed,
}: CodeBlockCollapsibleLinesProps) => {
  const isStart = type === "start"
  return (
    <>
      {collapsed && Array.isArray(children)
        ? children.slice(isStart ? -2 : 0, isStart ? undefined : 2)
        : children}
    </>
  )
}
