import { isDefined, isObject, OrchestrationUtils } from "@medusajs/utils"
import { getComposerContext } from "../../compiler/recorder"
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
 * } from "@medusajs/framework/workflows-sdk"
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

  const context = getComposerContext()
  if (!context) {
    throw new Error(`"when" must be used inside a createWorkflow definition`)
  }

  const block = context.beginCondition({ input, condition })

  return {
    then: (fn) => {
      let ret
      try {
        ret = fn()
      } catch (error) {
        context.endCondition(block)
        throw error
      }
      let returnStep = ret

      if (
        isDefined(ret) &&
        ret?.__type !== OrchestrationUtils.SymbolWorkflowStep
      ) {
        if (!isDefined(name)) {
          name = context.nextUnnamedWhen()
          console.warn(
            `${context.workflowId}: "when" name should be defined. "${name}" will be assigned to it, which changes when "when" blocks are added or removed.\n`,
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

      context.endCondition(block)

      return returnStep
    },
  }
}
