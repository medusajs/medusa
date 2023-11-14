import {
  SymbolInputReference,
  SymbolWorkflowStep,
  SymbolWorkflowStepTransformer,
} from "./symbol"
import { StepReturn } from "./type"

type Func1<T extends any[], U> = (context: any, ...inputs: T) => U | Promise<U>
type Func<T extends any, U> = (context: any, input: T) => U | Promise<U>

export function transform<
  TTransformerInput extends unknown[] = unknown[],
  TStepReturnInput extends StepReturn<TTransformerInput[number][]> = StepReturn<
    TTransformerInput[number][]
  >,
  TOutput extends unknown = unknown
>(
  values: [...TStepReturnInput],
  funcA: Func1<TTransformerInput, TOutput>
): StepReturn<TOutput>

export function transform<
  TTransformerInput extends unknown[] = unknown[],
  TStepReturnInput extends [...StepReturn<TTransformerInput[number][]>] = [
    ...StepReturn<TTransformerInput[number][]>
  ],
  A extends unknown = unknown,
  TOutput extends unknown = unknown
>(
  values: [...TStepReturnInput],
  funcA: Func1<TTransformerInput, A>,
  funcB: Func<A, TOutput>
): StepReturn<TOutput>

export function transform<
  TTransformerInput extends unknown[] = unknown[],
  TStepReturnInput extends [...StepReturn<TTransformerInput>] = [
    ...StepReturn<TTransformerInput>
  ],
  A extends unknown = unknown,
  B extends unknown = unknown,
  TOutput extends unknown = unknown
>(
  values: [...TStepReturnInput],
  funcA: Func1<TTransformerInput, A>,
  funcB: Func<A, B>,
  funcC: Func<B, TOutput>
): StepReturn<TOutput>

export function transform<
  TTransformerInput extends unknown[] = unknown[],
  TStepReturnInput extends [...StepReturn<TTransformerInput[number][]>] = [
    ...StepReturn<TTransformerInput[number][]>
  ],
  A extends unknown = unknown,
  B extends unknown = unknown,
  C extends unknown = unknown,
  TOutput extends unknown = unknown
>(
  values: [...TStepReturnInput],
  funcA: Func1<TTransformerInput, A>,
  funcB: Func<A, B>,
  funcC: Func<B, C>,
  funcD: Func<C, TOutput>
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
