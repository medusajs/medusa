import { CreateWorkflowComposerContext, StepFunction } from "./type"
import { SymbolMedusaWorkflowComposerContext } from "./symbol"

export function parallelize(...steps: StepFunction[]) {
  if (!global[SymbolMedusaWorkflowComposerContext]) {
    throw new Error(
      "parallelize must be used inside a createWorkflow definition"
    )
  }

  const globalParallelize = (
    global[SymbolMedusaWorkflowComposerContext] as CreateWorkflowComposerContext
  ).parallelizeBinder

  const resultSteps = steps.map((step) => ({
    __type: step.__type,
    __step__: step.__step__,
  }))

  return globalParallelize(function (this: CreateWorkflowComposerContext) {
    const stepOntoMerge = steps.shift()!
    this.flow.mergeActions(
      stepOntoMerge.__step__,
      ...steps.map((step) => step.__step__)
    )

    return resultSteps
  })
}
