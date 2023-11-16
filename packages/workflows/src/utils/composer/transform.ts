import { resolveValue } from "./resolve-value"
import { SymbolWorkflowStepTransformer } from "./symbol"
import { StepReturn, WorkflowTransactionContext } from "./type"

type Func1Multiple<T extends any[], U> = (
  ...inputs: [
    context: WorkflowTransactionContext,
    ...inputs: { [K in keyof T]: T[K] extends StepReturn<infer U> ? U : T[K] }
  ]
) => U | Promise<U>

type Func1Single<T, U> = (
  context: WorkflowTransactionContext,
  input: T extends StepReturn<infer U> ? U : T
) => U | Promise<U>

type Func<T, U> = (
  context: WorkflowTransactionContext,
  input: T
) => U | Promise<U>

export function transform<T extends unknown[], TOutput = unknown>(
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
): StepReturn<TOutput>

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
    const allValues = await resolveValue(values, transactionContext)
    const stepValues = JSON.parse(JSON.stringify(allValues))

    let finalResult
    for (let i = 0; i < functions.length; i++) {
      const fn = functions[i]
      const args = i === 0 ? stepValues : [finalResult]

      finalResult = await fn.apply(fn, [transactionContext, ...args])
    }

    returnFn.__value = finalResult
    return finalResult
  }

  returnFn.__type = SymbolWorkflowStepTransformer
  returnFn.__value = undefined

  return returnFn
}
