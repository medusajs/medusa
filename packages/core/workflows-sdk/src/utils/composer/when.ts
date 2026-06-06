import { isDefined, isObject, OrchestrationUtils } from "@zjedene-medusa/utils"
import { ulid } from "ulid"
import { createStep } from "./create-step"
import { StepResponse } from "./helpers/step-response"
import { StepExecutionContext, WorkflowData } from "./type"

type ConditionFunction<T extends object | WorkflowData> = (
  input: T extends WorkflowData<infer U>
    ? U
    : T extends object
    ? { [K in keyof T]: T[K] extends WorkflowData<infer U> ? U : T[K] }
    : {},
  context: StepExecutionContext
) => boolean

type ThenFunc = <ThenResolver extends () => any>(
  resolver: ThenResolver
) => ReturnType<ThenResolver> extends WorkflowData<infer ReturnedWorkflowData>
  ? WorkflowData<ReturnedWorkflowData> | undefined
  : ReturnType<ThenResolver>

/**
 * This function allows you to execute steps only if a condition is satisfied. As you can't use if conditions in
 * a workflow's constructor function, use `when-then` instead.
 *
 * Learn more about why you can't use if conditions and `when-then` in [this documentation](https://docs.medusajs.com/learn/fundamentals/workflows/conditions).
 *
 * @param values - The data to pass to the second parameter function.
 * @param condition - A function that returns a boolean value, indicating whether the steps in `then` should be executed.
 *
 * @example
 * import {
 *   createWorkflow,
 *   WorkflowResponse,
 *   when,
 * } from "@zjedene-medusa/framework/workflows-sdk"
 * // step imports...
 *
 * export const workflow = createWorkflow(
 *   "workflow",
 *   function (input: {
 *     is_active: boolean
 *   }) {
 *
 *     const result = when(
 *       input,
 *       (input) => {
 *         return input.is_active
 *       }
 *     ).then(() => {
 *       const stepResult = isActiveStep()
 *       return stepResult
 *     })
 *
 *     // executed without condition
 *     const anotherStepResult = anotherStep(result)
 *
 *     return new WorkflowResponse(
 *       anotherStepResult
 *     )
 *   }
 * )
 */
export function when<T extends object | WorkflowData, Then extends Function>(
  values: T,
  condition: ConditionFunction<T>
): {
  then: ThenFunc
}

/**
 * @internal
 */
export function when<T extends object | WorkflowData, Then extends Function>(
  name: string,
  values: T,
  condition: ConditionFunction<T>
): {
  then: ThenFunc
}

/**
 * @internal
 */
export function when(...args) {
  let [name, input, condition] = args
  if (args.length === 2) {
    condition = input
    input = name
    name = undefined
  }

  if (typeof condition !== "function") {
    throw new Error(`"when condition" must be a function`)
  }

  global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition] = {
    input,
    condition,
    steps: [],
  }

  let thenCalled = false
  process.nextTick(() => {
    if (!thenCalled) {
      throw new Error(`".then" is missing after "when" condition`)
    }
  })

  return {
    then: (fn) => {
      thenCalled = true
      const ret = fn()
      let returnStep = ret

      const applyCondition =
        global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition].steps

      if (
        isDefined(ret) &&
        ret?.__type !== OrchestrationUtils.SymbolWorkflowStep
      ) {
        if (!isDefined(name)) {
          name = "when-then-" + ulid()
          const context =
            global[OrchestrationUtils.SymbolMedusaWorkflowComposerContext]

          console.warn(
            `${context.workflowId}: "when" name should be defined. A random one will be assigned to it, which is not recommended for production.\n`,
            condition.toString()
          )
        }

        const retStep = createStep(
          name,
          ({ input }: { input: any }) => new StepResponse(input)
        )

        /**
         * object ret = { result, hooks }
         */
        if (isObject(ret) && "hooks" in ret && "result" in ret) {
          returnStep = {
            hooks: ret.hooks,
            result: retStep({ input: ret.result }),
          }
        } else {
          returnStep = retStep({ input: ret })
        }
      }

      for (const step of applyCondition) {
        step.if(input, condition)
      }

      delete global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition]

      return returnStep
    },
  }
}
