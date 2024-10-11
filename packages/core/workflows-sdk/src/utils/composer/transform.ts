import { resolveValue } from "./helpers"
import { StepExecutionContext, WorkflowData } from "./type"
import { proxify } from "./helpers/proxy"
import { OrchestrationUtils } from "@medusajs/utils"
import { ulid } from "ulid"
import {
  TransactionContext,
  WorkflowStepHandlerArguments,
} from "@medusajs/orchestration"

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
  const uniqId = ulid()

  const ret = {
    __id: uniqId,
    __type: OrchestrationUtils.SymbolWorkflowStepTransformer,
  }

  const returnFn = async function (
    // If a transformer is returned as the result of a workflow, then at this point the workflow is entirely done, in that case we have a TransactionContext
    transactionContext: WorkflowStepHandlerArguments | TransactionContext
  ): Promise<any> {
    if ("transaction" in transactionContext) {
      const temporaryDataKey = `${transactionContext.transaction.modelId}_${transactionContext.transaction.transactionId}_${uniqId}`

      if (transactionContext.transaction.hasTemporaryData(temporaryDataKey)) {
        return transactionContext.transaction.getTemporaryData(temporaryDataKey)
      }
    }

    const stepValue = await resolveValue(values, transactionContext)

    let finalResult
    for (let i = 0; i < functions.length; i++) {
      const fn = functions[i]
      const arg = i === 0 ? stepValue : finalResult

      finalResult = await fn.apply(fn, [arg, transactionContext])
    }

    if ("transaction" in transactionContext) {
      const temporaryDataKey = `${transactionContext.transaction.modelId}_${transactionContext.transaction.transactionId}_${uniqId}`

      transactionContext.transaction.setTemporaryData(
        temporaryDataKey,
        finalResult
      )
    }

    return finalResult
  }

  const proxyfiedRet = proxify<WorkflowData & { __resolver: any }>(
    ret as unknown as WorkflowData
  )
  proxyfiedRet.__resolver = returnFn as any

  return proxyfiedRet
}
