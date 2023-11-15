import { CreateWorkflowComposerContext, StepReturn } from "./type"
import { SymbolMedusaWorkflowComposerContext } from "./symbol"

/**
 * Parallelize multiple steps.
 * The steps will be run in parallel. The result of each step will be returned as part of the result array.
 * Each StepResult can be accessed from the resulted array in the order they were passed to the parallelize function.
 *
 * @param steps
 */
export function parallelize<TResult extends StepReturn[]>(
  ...steps: TResult
): TResult {
  if (!global[SymbolMedusaWorkflowComposerContext]) {
    throw new Error(
      "parallelize must be used inside a createWorkflow definition"
    )
  }

  const parallelizeBinder = (
    global[SymbolMedusaWorkflowComposerContext] as CreateWorkflowComposerContext
  ).parallelizeBinder

  const resultSteps = steps.map((step) => step)

  return parallelizeBinder<TResult>(function (
    this: CreateWorkflowComposerContext
  ) {
    const stepOntoMerge = steps.shift()!
    this.flow.mergeActions(
      stepOntoMerge.__step__,
      ...steps.map((step) => step.__step__)
    )

    return resultSteps as unknown as TResult
  })
}
