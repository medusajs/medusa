import {
  SymbolInputReference,
  SymbolWorkflowStep,
  SymbolWorkflowStepTransformer,
} from "./symbol"
import { StepReturn } from "./type"

type Func1Multiple<T extends any[], U> = (
  context: any,
  ...inputs: { [K in keyof T]: T[K] extends StepReturn<infer U> ? U : T[K] }
) => U | Promise<U>

type Func1Single<T extends any, U> = (
  context: any,
  input: T extends StepReturn<infer U> ? U : T
) => U | Promise<U>

type Func<T extends any, U> = (context: any, input: T) => U | Promise<U>

export function transform<T extends any, TOutput extends unknown = unknown>(
  values: T,
  funcA: Func1Single<T, TOutput>
): StepReturn<TOutput>

export function transform<T extends any[], TOutput extends unknown = unknown>(
  values: [...T],
  funcA: Func1Multiple<T, TOutput>
): StepReturn<TOutput>

export function transform<
  T extends any[],
  A,
  TOutput extends unknown = unknown
>(
  values: [...T],
  ...functions: [Func1Multiple<T, A>, Func<A, TOutput>]
): StepReturn<TOutput>

export function transform<T extends any, A, TOutput extends unknown = unknown>(
  values: T,
  ...functions: [Func1Single<T, A>, Func<A, TOutput>]
): StepReturn<TOutput>

export function transform<
  T extends any[],
  A,
  B,
  TOutput extends unknown = unknown
>(
  values: [...T],
  ...functions: [Func1Multiple<T, A>, Func<A, B>, Func<B, TOutput>]
): StepReturn<TOutput>

export function transform<
  T extends any,
  A,
  B,
  TOutput extends unknown = unknown
>(
  values: T,
  ...functions: [Func1Single<T, A>, Func<A, B>, Func<B, TOutput>]
): StepReturn<TOutput>

export function transform<
  T extends any[],
  A,
  B,
  C,
  TOutput extends unknown = unknown
>(
  values: [...T],
  ...functions: [Func1Multiple<T, A>, Func<A, B>, Func<B, C>, Func<C, TOutput>]
): StepReturn<TOutput>

export function transform<
  T extends any,
  A,
  B,
  C,
  TOutput extends unknown = unknown
>(
  values: T,
  ...functions: [Func1Single<T, A>, Func<A, B>, Func<B, C>, Func<C, TOutput>]
): StepReturn<TOutput>

export function transform<
  T extends any[],
  A,
  B,
  C,
  D,
  TOutput extends unknown = unknown
>(
  values: [...T],
  ...func: [
    Func1Multiple<T, A>,
    Func<A, B>,
    Func<B, C>,
    Func<C, D>,
    Func<D, TOutput>
  ]
): StepReturn<TOutput>

export function transform<
  T extends any,
  A,
  B,
  C,
  D,
  TOutput extends unknown = unknown
>(
  values: T,
  ...func: [
    Func1Single<T, A>,
    Func<A, B>,
    Func<B, C>,
    Func<C, D>,
    Func<D, TOutput>
  ]
): StepReturn<TOutput>

export function transform(values: any, ...functions: Function[]): unknown {
  const returnFn = async function (context: any): Promise<any> {
    const { invoke } = context

    const stepValues = values.map((value: any) => {
      let returnVal
      if (value?.__type === SymbolInputReference) {
        returnVal = value.value
      } else if (value?.__type === SymbolWorkflowStep) {
        returnVal = invoke[value.__step__]?.output
      } else {
        returnVal = value
      }

      // TODO: use structuredClone
      return returnVal ? JSON.parse(JSON.stringify(returnVal)) : returnVal
    })

    let finalResult
    for (let i = 0; i < functions.length; i++) {
      const fn = functions[i]

      const fnInput = i === 0 ? stepValues : [finalResult]
      finalResult = await fn.apply(fn, [context, ...fnInput])
    }

    returnFn.__value = finalResult
    return finalResult
  }

  returnFn.__type = SymbolWorkflowStepTransformer
  returnFn.__value = undefined

  return returnFn
}
