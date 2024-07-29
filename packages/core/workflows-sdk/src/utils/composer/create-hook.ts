import { CompensateFn, createStep, InvokeFn } from "./create-step"
import { OrchestrationUtils } from "@medusajs/utils"
import { CreateWorkflowComposerContext } from "./type"
import { createStepHandler } from "./helpers/create-step-handler"

export function createHook<Name extends string, TInvokeInput>(
  name: Name,
  input: TInvokeInput
) {
  const context = global[
    OrchestrationUtils.SymbolMedusaWorkflowComposerContext
  ] as CreateWorkflowComposerContext

  context.hookBinder(name, function (this: CreateWorkflowComposerContext) {
    createStep(
      name,
      (_: TInvokeInput) => void 0,
      () => void 0
    )(input)

    function hook<
      TInvokeResultCompensateInput
    >(this: CreateWorkflowComposerContext, invokeFn: InvokeFn<TInvokeInput, unknown, TInvokeResultCompensateInput>, compensateFn?: CompensateFn<TInvokeResultCompensateInput>) {
      const handlers = createStepHandler.bind(this)({
        stepName: name,
        input,
        invokeFn,
        compensateFn,
      })
      this.handlers.set(name, handlers)
    }

    return hook
  })

  return {
    __type: OrchestrationUtils.SymbolWorkflowHook,
    name,
  }
}
