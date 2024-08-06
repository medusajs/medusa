import { WorkflowStep } from "types"

export const createNodeClusters = (steps: WorkflowStep[]) => {
  const clusters: Record<number, WorkflowStep[]> = {}

  steps.forEach((step) => {
    if (!clusters[step.depth]) {
      clusters[step.depth] = []
    }

    clusters[step.depth].push(step)
  })

  return clusters
}

export const getNextCluster = (
  clusters: Record<number, WorkflowStep[]>,
  depth: number
) => {
  const nextDepth = depth + 1
  return clusters[nextDepth]
}
