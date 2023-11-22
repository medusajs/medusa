import {
  resolveValue,
  SymbolMedusaWorkflowComposerContext,
  SymbolWorkflowHook,
} from "./helpers"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  WorkflowData,
} from "./type"

/**
 * This function allows you to add hooks in your workflow that provide access to some data. Then, consumers of that workflow can add a handler function that performs
 * an action with the provided data or modify it.
 *
 * For example, in a "create product" workflow, you may add a hook after the product is created, providing access to the created product.
 * Then, developers using that workflow can hook into that point to access the product, modify its attributes, then return the updated product.
 *
 * @typeParam TOutput - The expected output of the hook's handler function.
 *
 * @param name - The name of the hook. This will be used by the consumer to add a handler method for the hook.
 * @param value - The data that a handler function receives as a parameter.
 * @returns The output of handler functions of this hook. If there are no handler functions, the output is `undefined`.
 *
 * @example
 * import {
 *   createWorkflow,
 *   StepReturn,
 *   StepExecutionContext
 * } from "@medusajs/workflows"
 * import {
 *   createProductStep,
 *   getProductStep,
 *   createPricesStep
 * } from "./steps"
 * import {
 *   Product
 * } from "@medusajs/medusa"
 *
 * interface MyWorkflowData {
 *  title: string
 * }
 *
 * const myWorkflow = createWorkflow(
 *   "my-workflow",
 *   function (input: StepReturn<MyWorkflowData>) {
 *     const product = createProductStep(input)
 *
 *     const hookRes = hook("createdProductHook", product)
 *
 *     const prices = createPricesStep(hookRes?.product || product)
 *
 *     const id = product.id
 *     return getProductStep(id)
 *   }
 * )
 *
 * myWorkflow.createdProductHook(async (product: Product, context: StepExecutionContext) => {
 *   const productService = context.container.resolve<ProductService>("productService")
 *
 *   const updatedProduct = await productService.update(product.id, {
 *     description: "a cool shirt"
 *   })
 *
 *   return updatedProduct
 * })
 *
 * myWorkflow()
 *  .run({
 *    title: "Shirt"
 *  })
 * .then((product) => {
 *   console.log(product.id)
 * })
 */
export function hook<TOutput>(name: string, value: any): WorkflowData<TOutput> {
  const hookBinder = (
    global[SymbolMedusaWorkflowComposerContext] as CreateWorkflowComposerContext
  ).hookBinder

  return hookBinder(name, function (context) {
    return {
      __value: async function (transactionContext) {
        const executionContext: StepExecutionContext = {
          container: transactionContext.container,
          metadata: transactionContext.metadata,
          context: transactionContext.context,
        }

        const allValues = await resolveValue(value, transactionContext)
        const stepValue = allValues
          ? JSON.parse(JSON.stringify(allValues))
          : allValues

        let finalResult
        const functions = context.hooksCallback_[name]
        for (let i = 0; i < functions.length; i++) {
          const fn = functions[i]
          const arg = i === 0 ? stepValue : finalResult
          finalResult = await fn.apply(fn, [arg, executionContext])
        }
        return finalResult
      },
      __type: SymbolWorkflowHook,
    }
  })
}
