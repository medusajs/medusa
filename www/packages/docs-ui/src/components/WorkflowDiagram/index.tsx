"use client"

import React, { Suspense } from "react"
import { Workflow } from "types"
import { Loading } from "../.."
import { WorkflowDiagramCanvas } from "./Canvas"
import { WorkflowDiagramList } from "./List"

export type WorkflowDiagramCommonProps = {
  workflow: Workflow
}

export type WorkflowDiagramType = "canvas" | "list"

export type WorkflowDiagramProps = WorkflowDiagramCommonProps & {
  type?: WorkflowDiagramType
}

export const WorkflowDiagram = ({
  type = "list",
  ...props
}: WorkflowDiagramProps) => {
  return (
    <Suspense fallback={<Loading />}>
      {type === "canvas" && <WorkflowDiagramCanvas {...props} />}
      {type === "list" && <WorkflowDiagramList {...props} />}
    </Suspense>
  )
}
