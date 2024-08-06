export type WorkflowStep = {
  type: "step" | "workflow" | "hook"
  name: string
  description?: string
  link?: string
  depth: number
}

export type Workflow = {
  name: string
  steps: WorkflowStep[]
}
