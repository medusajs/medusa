"use client"

import React from "react"
import { WorkflowStepUi } from "types"
import { WorkflowDiagramStepNode } from "../../Common/Node"
import { WorkflowDiagramLine } from "../../Common/Line"

export type WorkflowDiagramCanvasDepthProps = {
  cluster: WorkflowStepUi[]
  next: WorkflowStepUi[]
}

export const WorkflowDiagramCanvasDepth = ({
  cluster,
  next,
}: WorkflowDiagramCanvasDepthProps) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col justify-center gap-y-docs_0.5">
        {cluster.map((step) => (
          <WorkflowDiagramStepNode key={step.name} step={step} />
        ))}
      </div>
      <WorkflowDiagramLine step={next} />
    </div>
  )
}
