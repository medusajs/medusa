import { OrchestrationUtils } from "@medusajs/utils"
import { getComposerContext } from "../../compiler/recorder"
import { CompensateFn, createStep, InvokeFn } from "./create-step"
import { StepResponse } from "./helpers"

type ZodLike<T = any> = {
  parse(data: unknown): T
}

const NOOP_RESULT = Symbol.for("NOOP")

/**
 * Representation of a hook definition.
 */
export type Hook<Name extends string, Input, Output> = {
  __type: typeof OrchestrationUtils.SymbolWorkflowHook
  name: Name

  /**
   * Returns the result of the hook
   */
  getResult(): Output | undefined

  /**
   * By prefixing a key with a space, we remove it from the
   * intellisense of TypeScript. This is needed because
   * input is not set at runtime. It is a type-only
   * property to infer input data type of a hook
   */
  " output": Output
  " input": Input
}

/**
 * Expose a hook in your workflow where you can inject custom functionality as a step function.
 *
 * A handler hook can later be registered to consume the hook and perform custom functionality.
 *
 * Learn more in [this documentation](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks).
 *
 * @param name - The hook's name. This is used when the hook handler is registered to consume the workflow.
 * @param hookInput - The input to pass to the hook handler.
 * @returns A workflow hook.
 *
 * @example
 * import {
 *   createStep,
 *   createHook,
 *   createWorkflow,
 *   WorkflowResponse,
 * } from "@medusajs/framework/workflows-sdk"
 * import { createProductStep } from "./steps/create-product"
 *
 * export const myWorkflow = createWorkflow(
 *   "my-workflow",
 *   function (input) {
 *     const product = createProductStep(input)
 *     const productCreatedHook = createHook(
 *       "productCreated",
 *       { productId: product.id }
 *     )
 *
 *     return new WorkflowResponse(product, {
 *       hooks: [productCreatedHook],
 *     })
 *   }
 * )
 */
export function createHook<Name extends string, TInvokeInput, TInvokeOutput>(
  name: Name,
  hookInput: TInvokeInput,
  options: {
    resultValidator?: ZodLike<TInvokeOutput>
  } = {}
): Hook<Name, TInvokeInput, TInvokeOutput> {
  const context = getComposerContext()
  if (!context) {
    throw new Error(
      "createHook must be used inside a createWorkflow definition"
    )
  }

  const getHookResultStep = createStep(
    `get-${name}-result`,
    (_, context) => {
      const result = context[" getStepResult"](name)
      if (result === NOOP_RESULT) {
        return new StepResponse(undefined)
      }
      if (options.resultValidator) {
        return options.resultValidator.parse(result)
      }
      if (result === undefined) {
        return new StepResponse(undefined)
      }
      return result
    },
    () => void 0
  )

  /**
   * A no-op step that the workflow's consumer can replace with a handler.
   * The handler is read when the step runs, so it may be attached later.
   */
  createStep(
    name,
    (_: TInvokeInput) => new StepResponse(NOOP_RESULT),
    () => void 0
  )(hookInput)

  const recorded = context.findStep(name)
  if (recorded) {
    recorded.hook = name
  }

  context.hooks[name] = function hook<TInvokeResultCompensateInput>(
    invokeFn: InvokeFn<TInvokeInput, unknown, TInvokeResultCompensateInput>,
    compensateFn?: CompensateFn<TInvokeResultCompensateInput>
  ) {
    if (context.hookHandlers.has(name)) {
      throw new Error(
        `Cannot define multiple hook handlers for the ${name} hook`
      )
    }

    context.hookHandlers.set(name, {
      invoke: invokeFn,
      compensate: compensateFn ?? (() => void 0),
    })
  }

  return {
    __type: OrchestrationUtils.SymbolWorkflowHook,
    name,
    getResult() {
      if ("cachedResult" in this) {
        return this.cachedResult
      }
      const result = getHookResultStep()
      this["cachedResult"] = result
      return result
    },
  } as Hook<Name, TInvokeInput, TInvokeOutput>
}
