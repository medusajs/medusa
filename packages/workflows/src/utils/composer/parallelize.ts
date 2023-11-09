import { StepFunction, WorkflowContext } from "./type"

export function parallelize(...steps: StepFunction[]) {
  const globalParallelize = global.parallelize

  if (!globalParallelize) {
    throw new Error(
      "parallelize must be used inside a createWorkflow definition"
    )
  }

  const resultSteps = steps.map((step) => ({ __step__: step.__step__ }))

  return globalParallelize(function (this: WorkflowContext) {
    const stepOntoMerge = steps.shift()!
    this.flow.mergeActions(
      stepOntoMerge.__step__,
      ...steps.map((step) => step.__step__)
    )

    return resultSteps
  })
}
