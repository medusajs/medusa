export type WorkflowStep = {
  type: "step" | "workflow" | "hook"
  name: string
  description?: string
  link?: string
  depth: number
}

export type WorkflowWhenSteps = {
  type: "when"
  condition: string
  steps: WorkflowStep[]
  depth: number
}

export type WorkflowStepUi = WorkflowStep & {
  when?: WorkflowWhenSteps
}

export type WorkflowSteps = (WorkflowStepUi | WorkflowWhenSteps)[]

export type Workflow = {
  name: string
  steps: WorkflowSteps
}
