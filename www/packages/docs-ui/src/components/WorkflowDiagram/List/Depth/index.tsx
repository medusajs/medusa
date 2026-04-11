"use client"

import React from "react"
import { WorkflowStepUi } from "types"
import { WorkflowDiagramStepNode } from "../../Common/Node"
import { WorkflowDiagramLine } from "../../Common/Line"

export type WorkflowDiagramListDepthProps = {
  cluster: WorkflowStepUi[]
}

export const WorkflowDiagramListDepth = ({
  cluster,
}: WorkflowDiagramListDepthProps) => {
  return (
    <div className="flex items-start workflow-node-group w-fit">
      <WorkflowDiagramLine step={cluster} />
      <div className="flex flex-col justify-center gap-y-docs_0.5">
        {cluster.map((step, index) => (
          <WorkflowDiagramStepNode key={`${step.name}-${index}`} step={step} />
        ))}
      </div>
    </div>
  )
}
