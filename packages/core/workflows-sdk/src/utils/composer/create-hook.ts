import { CompensateFn, createStep, InvokeFn } from "./create-step"

/**
 * workflow = createWorkflow(() => {
 *   const somethingBack = createHook('name', input)
 * })
 *
 * workflow.hooks.somethingBack(() => {})
 */

export function createHook<Name extends string, TInvokeInput>(
  name: Name,
  input: TInvokeInput
) {
  function hookAsStep<TInvokeResultCompensateInput>(
    callback: InvokeFn<TInvokeInput, unknown, TInvokeResultCompensateInput>,
    compensateFn?: CompensateFn<TInvokeResultCompensateInput>
  ) {
    const step = createStep(name, callback, compensateFn)
  }
  return hookAsStep
}

createHook("productCreated", { product: { id: 1 } })(({ product }) => {
  product.id
})
