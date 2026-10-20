import { OrchestrationUtils } from "@medusajs/utils"
import { getComposerContext } from "../../compiler/recorder"
import { memoised } from "../../compiler/values"
import { resolveValue } from "./helpers"
import { proxify } from "./helpers/proxy"
import { StepExecutionContext, WorkflowData } from "./type"

// Ids of transforms created outside a workflow definition.
let detachedTransformIds = 0

type Func1<T extends object | WorkflowData, U> = (
  input: T extends WorkflowData<infer U>
    ? U
    : T extends object
    ? { [K in keyof T]: T[K] extends WorkflowData<infer U> ? U : T[K] }
    : {},
  context: StepExecutionContext
) => U | Promise<U>

type Func<T, U> = (input: T, context: StepExecutionContext) => U | Promise<U>

/**
 *
 * This function transforms the output of other utility functions.
 *
 * For example, if you're using the value(s) of some step(s) as an input to a later step. As you can't directly manipulate data in the  workflow constructor function passed to {@link createWorkflow},
 * the `transform` function provides access to the runtime value of the step(s) output so that you can manipulate them.
 *
 * Another example is if you're using the runtime value of some step(s) as the output of a workflow.
 *
 * If you're also retrieving the output of a hook and want to check if its value is set, you must use a workflow to get the runtime value of that hook.
 *
 * @returns There's no expected value to be returned by the `transform` function.
 *
 * @example
 * import {
 *   createWorkflow,
 *   transform,
 *   WorkflowResponse
 * } from "@medusajs/framework/workflows-sdk"
 * import { step1, step2 } from "./steps"
 *
 * type WorkflowInput = {
 *   name: string
 * }
 *
 * const myWorkflow = createWorkflow(
 *   "hello-world",
 *   (input: WorkflowInput) => {
 *     const str1 = step1(input)
 *     const str2 = step2(input)
 *
 *     const message = transform({
 *       str1,
 *       str2
 *     }, (input) => `${input.str1}${input.str2}`)
 *
 *     return new WorkflowResponse(message)
 * })
 */
// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RFinal>(
  /**
   * The output(s) of other step functions.
   */
  values: T,
  /**
   * The transform function used to perform action on the runtime values of the provided `values`.
   */
  ...func:
    | [Func1<T, RFinal>]
): WorkflowData<RFinal>

/**
 * @internal
 */
// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RA, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
): WorkflowData<RFinal>

/**
 * @internal
 */
// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RA, RB, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
): WorkflowData<RFinal>

/**
 * @internal
 */
// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RA, RB, RC, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RFinal>]
): WorkflowData<RFinal>

/**
 * @internal
 */
// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RA, RB, RC, RD, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RFinal>]
): WorkflowData<RFinal>

/**
 * @internal
 */
// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RA, RB, RC, RD, RE, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RE>, Func<RE, RFinal>]
): WorkflowData<RFinal>

/**
 * @internal
 */
// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RA, RB, RC, RD, RE, RF, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RE>, Func<RE, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RE>, Func<RE, RF>, Func<RF, RFinal>]
): WorkflowData<RFinal>

export function transform(
  values: any | any[],
  ...functions: Function[]
): unknown {
  const id =
    getComposerContext()?.nextTransformId() ??
    `detached-transform-${++detachedTransformIds}`

  const compute = async function (transactionContext: any): Promise<any> {
    let stepValue = resolveValue(values, transactionContext)
    if (stepValue instanceof Promise) {
      stepValue = await stepValue
    }

    let finalResult
    for (let i = 0; i < functions.length; i++) {
      const fn = functions[i]
      const arg = i === 0 ? stepValue : finalResult

      finalResult = fn.apply(fn, [arg, transactionContext])
      if (finalResult instanceof Promise) {
        finalResult = await finalResult
      }
    }

    return finalResult
  }

  const ret = proxify<WorkflowData & { __resolver: unknown }>({
    __id: id,
    __type: OrchestrationUtils.SymbolWorkflowStepTransformer,
  } as unknown as WorkflowData)

  // Evaluated at most once per run: every consumer, including the workflow
  // result, reads the same value.
  ret.__resolver = (transactionContext: any): Promise<any> =>
    memoised(transactionContext, `transform:${id}`, () =>
      compute(transactionContext)
    )

  return ret
}
