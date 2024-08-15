"use client"

import React from "react"
import { WorkflowStepUi } from "types"
import { WorkflowDiagramStepNode } from "../../Common/Node"
import { WorkflowDiagramLine } from "../../Common/Line"

export type WorkflowDiagramListDepthProps = {
  cluster: WorkflowStepUi[]
  next: WorkflowStepUi[]
}

export const WorkflowDiagramListDepth = ({
  cluster,
}: WorkflowDiagramListDepthProps) => {
  return (
    <div className="flex items-start">
      <WorkflowDiagramLine step={cluster} />
      <div className="flex flex-col justify-center gap-y-docs_0.5">
        {cluster.map((step) => (
          <WorkflowDiagramStepNode key={step.name} step={step} />
        ))}
      </div>
    </div>
  )
}
