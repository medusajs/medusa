import { CreateWorkflowComposerContext, StepReturn } from "./type"
import { SymbolMedusaWorkflowComposerContext } from "./symbol"

/**
 * This function is used to run multiple steps in parallel. The result of each step will be returned as part of the result array.
 *
 * @typeParam TResult - The type of the expected result.
 *
 * @param steps - The steps to run in parallel
 *
 * @returns The step results. The results are ordered in the array by the order they're passed in the function's parameter.
 *
 * @example
 * import {
 *   createWorkflow,
 *   StepReturn,
 *   parallelize
 * } from "@medusajs/workflows"
 * import {
 *   createProductStep,
 *   getProductStep,
 *   createPricesStep,
 *   attachProductToSalesChannelStep
 * } from "./steps"
 *
 * interface MyWorkflowData {
 *   title: string
 * }
 *
 * const myWorkflow = createWorkflow(
 *   "my-workflow",
 *   (input: StepReturn<MyWorkflowData>) => {
 *     const product = createProductStep(input)
 *
 *     const [prices, productSalesChannel] = parallelize(
 *       createPricesStep(product),
 *       attachProductToSalesChannelStep(product)
 *     )
 *
 *     const id = product.id
 *     return getProductStep(product.id)
 *  }
 * )
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
