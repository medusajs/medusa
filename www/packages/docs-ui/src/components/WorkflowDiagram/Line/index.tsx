import React from "react"
import { WorkflowDiagramArrow } from "../Arrow"
import { WorkflowStepUi } from "types"

export type WorkflowDiagramLineProps = {
  step: WorkflowStepUi[]
}

export const WorkflowDiagramLine = ({ step }: WorkflowDiagramLineProps) => {
  if (!step) {
    return <></>
  }

  return (
    <div className="ml-0 -mr-[7px] w-[60px] pr-[7px]">
      <div className="flex min-h-[24px] w-full items-start">
        <div className="flex h-docs_1.5 w-[10px] items-center justify-center">
          <div className="bg-medusa-button-neutral shadow-borders-base size-[10px] shrink-0 rounded-full" />
        </div>
        <div className="pt-[6px]">
          <WorkflowDiagramArrow depth={step.length} />
        </div>
      </div>
    </div>
  )
}
