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
 * Transforms the input value(s) using the provided functions.
 * Allow to perform transformation on the future result of the step(s) to be passed
 * to other steps later on at run time.
 *
 * @param values
 * @param functions
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
