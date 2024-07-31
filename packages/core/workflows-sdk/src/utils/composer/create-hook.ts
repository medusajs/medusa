import { CompensateFn, createStep, InvokeFn } from "./create-step"
import { OrchestrationUtils } from "@medusajs/utils"
import { CreateWorkflowComposerContext } from "./type"
import { createStepHandler } from "./helpers/create-step-handler"

/**
 * Representation of a hook definition.
 */
export type Hook<Name extends string, Input> = {
  __type: typeof OrchestrationUtils.SymbolWorkflowHook
  name: Name
  /**
   * By prefixing a key with a space, we remove it from the
   * intellisense of TypeScript. This is needed because
   * input is not set at runtime. It is a type-only
   * property to infer input data type of a hook
   */
  " input": Input
}

/**
 * Define a workflow hook to be executed within steps. The created hook
 * is exposed publicly for the workflow consumers to inject and run
 * custom logic.
 *
 * Hooks behaves like steps
 */
export function createHook<Name extends string, TInvokeInput>(
  name: Name,
  input: TInvokeInput
): Hook<Name, TInvokeInput> {
  const context = global[
    OrchestrationUtils.SymbolMedusaWorkflowComposerContext
  ] as CreateWorkflowComposerContext

  context.hookBinder(name, function (this: CreateWorkflowComposerContext) {
    /**
     * We start by registering a new step within the workflow. This will be a noop
     * step that can be replaced (optionally) by the workflow consumer.
     */
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

      if (this.hooks_.registered.includes(name)) {
        throw new Error(
          `Cannot define multiple hook handlers for the ${name} hook`
        )
      }

      this.hooks_.registered.push(name)
      this.handlers.set(name, handlers)
    }

    return hook
  })

  return {
    __type: OrchestrationUtils.SymbolWorkflowHook,
    name,
  } as Hook<Name, TInvokeInput>
}
