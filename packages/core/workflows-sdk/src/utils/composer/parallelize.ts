import { CreateWorkflowComposerContext, WorkflowData } from "./type"
import { OrchestrationUtils } from "@medusajs/utils"

/**
 * This function is used to run multiple steps in parallel. The result of each step will be returned as part of the result array.
 *
 * @typeParam TResult - The type of the expected result.
 *
 * @returns The step results. The results are ordered in the array by the order they're passed in the function's parameter.
 *
 * @example
 * import {
 *   createWorkflow,
 *   parallelize,
 *   WorkflowResponse
 * } from "@medusajs/framework/workflows-sdk"
 * import {
 *   createProductStep,
 *   getProductStep,
 *   createPricesStep,
 *   attachProductToSalesChannelStep
 * } from "./steps"
 *
 * interface WorkflowInput {
 *   title: string
 * }
 *
 * const myWorkflow = createWorkflow(
 *   "my-workflow",
 *   (input: WorkflowInput) => {
 *    const product = createProductStep(input)
 *
 *    const [prices, productSalesChannel] = parallelize(
 *      createPricesStep(product),
 *      attachProductToSalesChannelStep(product)
 *    )
 *
 *    const id = product.id
 *    return new WorkflowResponse(getProductStep(product.id))
 *  }
 * )
 */
export function parallelize<TResult extends WorkflowData[]>(
  ...steps: TResult
): TResult {
  if (!global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext]) {
    throw new Error(
      "parallelize must be used inside a createWorkflow definition"
    )
  }

  const parallelizeBinder = (
    global[
      OrchestrationUtils.SymbolMedusaWorkflowComposerContext
    ] as CreateWorkflowComposerContext
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
