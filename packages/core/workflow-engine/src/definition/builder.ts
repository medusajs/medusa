import {
  CompensateHandler,
  ResultContext,
  StepContext,
  StepNode,
  StepOptions,
  StepResult,
  WorkflowDefinition,
  WorkflowOptions,
} from "./types"

export interface StepSpec {
  id: string
  dependsOn?: string[]
  invoke: (
    ctx: StepContext
  ) => Promise<StepResult | unknown> | StepResult | unknown
  compensate?: CompensateHandler
  options?: StepOptions
}

/**
 * Programmatic way to build a definition. A step without `dependsOn` depends
 * on the step declared before it; pass `[]` for a root step.
 */
export function defineWorkflow(spec: {
  id: string
  steps: StepSpec[]
  options?: WorkflowOptions
  result?: (ctx: ResultContext) => unknown
}): WorkflowDefinition {
  const steps: StepNode[] = spec.steps.map((step, index) => ({
    id: step.id,
    dependsOn:
      step.dependsOn ?? (index === 0 ? [] : [spec.steps[index - 1].id]),
    invoke: async (ctx) => toStepResult(await step.invoke(ctx)),
    compensate: step.compensate,
    options: step.options ?? {},
  }))

  return {
    id: spec.id,
    steps,
    options: spec.options ?? {},
    result: spec.result,
  }
}

const KINDS = new Set(["output", "skip", "wait"])

function toStepResult(value: unknown): StepResult {
  if (
    value &&
    typeof value === "object" &&
    KINDS.has((value as { kind?: string }).kind as string)
  ) {
    return value as StepResult
  }
  return { kind: "output", output: value, compensateInput: value }
}
