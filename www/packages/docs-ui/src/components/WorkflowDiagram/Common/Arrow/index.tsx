import React from "react"
import { WorkflowDiagramArrowHorizontal } from "./Horizontal"
import { WorkflowDiagramArrowEnd } from "./End"
import { WorkflowDiagramArrowMiddle } from "./Middle"

export type WorkflowDiagramArrowProps = {
  depth: number
}

export const WorkflowDiagramArrow = ({ depth }: WorkflowDiagramArrowProps) => {
  if (depth === 1) {
    return <WorkflowDiagramArrowHorizontal />
  }

  if (depth === 2) {
    return (
      <div className="flex flex-col items-end">
        <WorkflowDiagramArrowHorizontal />
        <WorkflowDiagramArrowEnd />
      </div>
    )
  }

  const inbetween = Array.from({ length: depth - 2 }).map((_, index) => (
    <WorkflowDiagramArrowMiddle key={index} />
  ))

  return (
    <div className="flex flex-col items-end">
      <WorkflowDiagramArrowHorizontal />
      {inbetween}
      <WorkflowDiagramArrowEnd />
    </div>
  )
}
