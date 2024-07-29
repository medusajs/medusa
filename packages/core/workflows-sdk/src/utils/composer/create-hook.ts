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

  createStep(
    name,
    (_: TInvokeInput) => void 0,
    () => void 0
  )(input)

  context.hooks_.push(name)
  context.hooksCallback_[name] = function foo<TInvokeResultCompensateInput>(
    this: CreateWorkflowComposerContext,
    invokeFn: InvokeFn<TInvokeInput, unknown, TInvokeResultCompensateInput>,
    compensateFn?: CompensateFn<TInvokeResultCompensateInput>
  ) {
    const handlers = createStepHandler.bind(this)({
      stepName: name,
      input,
      invokeFn,
      compensateFn,
    })
    this.handlers.set(name, handlers)
  }

  return {
    __type: OrchestrationUtils.SymbolWorkflowHook,
  }
}
