import { resolveValue } from "./resolve-value"
import { SymbolWorkflowStepTransformer } from "./symbol"
import { StepExecutionContext, StepReturn } from "./type"

/*type Func1Multiple<T extends any[], U> = (
  ...inputs: [
    context: StepExecutionContext,
    ...inputs: { [K in keyof T]: T[K] extends StepReturn<infer U> ? U : T[K] }
  ]
) => U | Promise<U>

type Func1Single<T, U> = (
  input: T extends StepReturn<infer U> ? U : T,
  context: StepExecutionContext
) => U | Promise<U>

type Func<T, U> = (input: T, context: StepExecutionContext) => U | Promise<U>*/

/*export function transform<T extends unknown[], TOutput = unknown>(
  values: [...T],
  funcA: Func1Multiple<T, TOutput>
): StepReturn<TOutput>

export function transform<T, TOutput = unknown>(
  values: T,
  funcA: Func1Single<T, TOutput>
): StepReturn<TOutput>

export function transform<T extends any[], A, TOutput = unknown>(
  values: [...T],
  ...functions: [Func1Multiple<T, A>, Func<A, TOutput>]
): StepReturn<TOutput>

export function transform<T, A, TOutput = unknown>(
  values: T,
  ...functions: [Func1Single<T, A>, Func<A, TOutput>]
): StepReturn<TOutput>

export function transform<T extends any[], A, B, TOutput = unknown>(
  values: [...T],
  ...functions: [Func1Multiple<T, A>, Func<A, B>, Func<B, TOutput>]
): StepReturn<TOutput>

export function transform<T, A, B, TOutput = unknown>(
  values: T,
  ...functions: [Func1Single<T, A>, Func<A, B>, Func<B, TOutput>]
): StepReturn<TOutput>

export function transform<T extends any[], A, B, C, TOutput = unknown>(
  values: [...T],
  ...functions: [Func1Multiple<T, A>, Func<A, B>, Func<B, C>, Func<C, TOutput>]
): StepReturn<TOutput>

export function transform<T, A, B, C, TOutput = unknown>(
  values: T,
  ...functions: [Func1Single<T, A>, Func<A, B>, Func<B, C>, Func<C, TOutput>]
): StepReturn<TOutput>

export function transform<T extends any[], A, B, C, D, TOutput = unknown>(
  values: [...T],
  ...func: [
    Func1Multiple<T, A>,
    Func<A, B>,
    Func<B, C>,
    Func<C, D>,
    Func<D, TOutput>
  ]
): StepReturn<TOutput>

export function transform<T, A, B, C, D, TOutput = unknown>(
  values: T,
  ...func: [
    Func1Single<T, A>,
    Func<A, B>,
    Func<B, C>,
    Func<C, D>,
    Func<D, TOutput>
  ]
): StepReturn<TOutput>*/

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
