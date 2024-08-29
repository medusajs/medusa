"use client"

import React from "react"
import { createNodeClusters, getNextCluster } from "../../../utils"
import { WorkflowDiagramCommonProps } from "../../.."
import { WorkflowDiagramListDepth } from "./Depth"

export const WorkflowDiagramList = ({
  workflow,
}: WorkflowDiagramCommonProps) => {
  const clusters = createNodeClusters(workflow.steps)

  return (
    <div className="flex flex-col gap-docs_0.5 my-docs_1">
      {Object.entries(clusters).map(([depth, cluster]) => {
        const next = getNextCluster(clusters, Number(depth))

        return (
          <WorkflowDiagramListDepth cluster={cluster} next={next} key={depth} />
        )
      })}
    </div>
  )
}
