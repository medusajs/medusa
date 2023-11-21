import { resolveValue } from "./resolve-value"
import { SymbolWorkflowStepTransformer } from "./symbol"
import { StepExecutionContext, StepReturn } from "./type"

type Func1<T extends object | StepReturn, U> = (
  input: T extends StepReturn<infer U>
    ? U
    : T extends object
    ? { [K in keyof T]: T[K] extends StepReturn<infer U> ? U : T[K] }
    : {},
  context: StepExecutionContext
) => U | Promise<U>

type Func<T, U> = (input: T, context: StepExecutionContext) => U | Promise<U>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | StepReturn, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
): StepReturn<RFinal>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | StepReturn, RA, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
): StepReturn<RFinal>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | StepReturn, RA, RB, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
): StepReturn<RFinal>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | StepReturn, RA, RB, RC, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RFinal>]
): StepReturn<RFinal>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | StepReturn, RA, RB, RC, RD, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RFinal>]
): StepReturn<RFinal>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | StepReturn, RA, RB, RC, RD, RE, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RE>, Func<RE, RFinal>]
): StepReturn<RFinal>

// prettier-ignore
// eslint-disable-next-line max-len
export function transform<T extends object | StepReturn, RA, RB, RC, RD, RE, RF, RFinal>(
  values: T,
  ...func:
    | [Func1<T, RFinal>]
    | [Func1<T, RA>, Func<RA, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RE>, Func<RE, RFinal>]
    | [Func1<T, RA>, Func<RA, RB>, Func<RB, RC>, Func<RC, RD>, Func<RD, RE>, Func<RE, RF>, Func<RF, RFinal>]
): StepReturn<RFinal>

/**
 *
 * @mainSignature
 *
 * This function transforms the output of other steps using the provided functions.
 *
 * This is useful if you're using the value(s) of some step(s) as an input to a later step. It ensures that the input
 * that the later step receives is the output of the other step(s) during runtime.
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

    returnFn.__value = finalResult
    return finalResult
  }

  returnFn.__type = SymbolWorkflowStepTransformer
  returnFn.__value = undefined

  return returnFn
}
