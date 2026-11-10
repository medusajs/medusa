import { getComposerContext } from "../../compiler/recorder"
import { WorkflowData } from "./type"
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
 *    return new WorkflowResponse({
 *     prices,
 *     productSalesChannel
 *    })
 *  }
 * )
 */
export function parallelize<TResult extends (WorkflowData | undefined)[]>(
  ...steps: TResult
): TResult {
  const context = getComposerContext()
  if (!context) {
    throw new Error(
      "parallelize must be used inside a createWorkflow definition"
    )
  }

  context.parallel(steps)
  return steps
}
