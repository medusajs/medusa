import { resolveValue, SymbolWorkflowStepTransformer } from "./helpers"
import { StepExecutionContext, WorkflowData } from "./type"
import { proxify } from "./helpers/proxy"

type Func1<T extends object | WorkflowData, U> = (
  input: T extends WorkflowData<infer U>
    ? U
    : T extends object
    ? { [K in keyof T]: T[K] extends WorkflowData<infer U> ? U : T[K] }
    : {},
  context: StepExecutionContext
) => U | Promise<U>

type Func<T, U> = (input: T, context: StepExecutionContext) => U | Promise<U>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
): WorkflowData<RFinal>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RA, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
): WorkflowData<RFinal>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | WorkflowData, RA, RB, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
): WorkflowData<RFinal>

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

/**
 *
 * @mainSignature
 *
 * This function transforms the output of other steps using the provided functions.
 *
 * This is useful if you're using the value(s) of some step(s) as an input to a later step. As you can't directly manipulate data in the  workflow constructor function passed to {@link createWorkflow},
 * the `transform` function provides access to the runtime value of the step(s) output so that you can manipulate them.
 *
 * This is also useful if you're using the runtime value of some step(s) as the output of a workflow.
 *
 * @example
 * const myWorkflow = createWorkflow("hello-world", (input: StepReturn<WorkflowInput>): StepReturn<WorkflowOutput> => {
 *   const str1 = step1(input)
 *   const str2 = step2(input)
 *
 *   return transform({
 *     str1,
 *     str2
 *   }, (input) => ({
 *     message: `${input.str1}${input.str2}`
 *   }))
 * })
 *
 * @param values - The output(s) of other step functions.
 * @param functions - The transform function(s) used to perform action on the runtime values of the provided `values`.
 *
 * @returns There's no expected value to be returned by the `transform` function.
 */
export function transform(
  values: any | any[],
  ...functions: Function[]
): unknown {
  const ret = {
    __type: SymbolWorkflowStepTransformer,
    __resolver: undefined,
  }

  const returnFn = async function (transactionContext): Promise<any> {
    const executionContext = {
      container: transactionContext.container,
      metadata: transactionContext.metadata,
      context: transactionContext.context,
      invoke: transactionContext.invoke,
    }

    const allValues = await resolveValue(values, transactionContext)
    const stepValue = allValues
      ? JSON.parse(JSON.stringify(allValues))
      : allValues

    let finalResult
    for (let i = 0; i < functions.length; i++) {
      const fn = functions[i]
      const arg = i === 0 ? stepValue : finalResult

      finalResult = await fn.apply(fn, [arg, executionContext])
    }

    return finalResult
  }

  const proxyfiedRet = proxify<WorkflowData & { __resolver: any }>(
    ret as unknown as WorkflowData
  )
  proxyfiedRet.__resolver = returnFn as any

  return proxyfiedRet
}
