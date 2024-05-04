import { WorkflowStepHandlerArguments } from "@medusajs/orchestration"
import { OrchestrationUtils, deepCopy } from "@medusajs/utils"
import { resolveValue } from "./helpers"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  WorkflowData,
} from "./type"

/**
 *
 * @ignore
 *
 * This function allows you to add hooks in your workflow that provide access to some data. Then, consumers of that workflow can add a handler function that performs
 * an action with the provided data or modify it.
 *
 * For example, in a "create product" workflow, you may add a hook after the product is created, providing access to the created product.
 * Then, developers using that workflow can hook into that point to access the product, modify its attributes, then return the updated product.
 *
 * @typeParam TOutput - The expected output of the hook's handler function.
 * @returns The output of handler functions of this hook. If there are no handler functions, the output is `undefined`.
 *
 * @example
 * import {
 *   createWorkflow,
 *   StepExecutionContext,
 *   hook,
 *   transform
 * } from "@medusajs/workflows-sdk"
 * import {
 *   createProductStep,
 *   getProductStep,
 *   createPricesStep
 * } from "./steps"
 * import {
 *   MedusaRequest,
 *   MedusaResponse,
 *   Product, ProductService
 * } from "@medusajs/medusa"
 *
 * interface WorkflowInput {
 *  title: string
 * }
 *
 * const myWorkflow = createWorkflow<
 *   WorkflowInput,
 *   Product
 * >("my-workflow",
 *   function (input) {
 *     const product = createProductStep(input)
 *
 *     const hookProduct = hook<Product>("createdProductHook", product)
 *
 *     const newProduct = transform({
 *       product,
 *       hookProduct
 *     }, (input) => {
 *       return input.hookProduct || input.product
 *     })
 *
 *     const prices = createPricesStep(newProduct)
 *
 *     return getProductStep(product.id)
 *   }
 * )
 *
 * myWorkflow.createdProductHook(
 *   async (product, context: StepExecutionContext) => {
 *     const productService: ProductService = context.container.resolve("productService")
 *
 *     const updatedProduct = await productService.update(product.id, {
 *       description: "a cool shirt"
 *     })
 *
 *     return updatedProduct
 * })
 *
 * export async function POST(
 *   req: MedusaRequest,
 *   res: MedusaResponse
 * ) {
 *   const { result: product } = await myWorkflow(req.scope)
 *   .run({
 *     input: {
 *       title: req.body.title
 *     }
 *   })
 *
 *   res.json({
 *     product
 *   })
 * }
 */
export function hook<TOutput>(
  /**
   * The name of the hook. This will be used by the consumer to add a handler method for the hook.
   */
  name: string,
  /**
   * The data that a handler function receives as a parameter.
   */
  value: any
): WorkflowData<TOutput> {
  const hookBinder = (
    global[
      OrchestrationUtils.SymbolMedusaWorkflowComposerContext
    ] as CreateWorkflowComposerContext
  ).hookBinder

  return hookBinder(name, function (context) {
    return {
      __value: async function (
        transactionContext: WorkflowStepHandlerArguments
      ) {
        const metadata = transactionContext.metadata
        const idempotencyKey = metadata.idempotency_key

        transactionContext.context!.idempotencyKey = idempotencyKey

        const executionContext: StepExecutionContext = {
          workflowId: metadata.model_id,
          stepName: metadata.action,
          action: metadata.action_type,
          idempotencyKey,
          attempt: metadata.attempt,
          container: transactionContext.container,
          metadata,
          context: transactionContext.context!,
        }

        const allValues = await resolveValue(value, transactionContext)
        const stepValue = allValues ? deepCopy(allValues) : allValues

        let finalResult
        const functions = context.hooksCallback_[name]
        for (let i = 0; i < functions.length; i++) {
          const fn = functions[i]
          const arg = i === 0 ? stepValue : finalResult
          finalResult = await fn.apply(fn, [arg, executionContext])
        }
        return finalResult
      },
      __type: OrchestrationUtils.SymbolWorkflowHook,
    }
  })
}
