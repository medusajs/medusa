import {
  SymbolInputReference,
  SymbolWorkflowStep,
  SymbolWorkflowStepTransformer,
} from "./symbol"
import { StepFunction, StepReturn } from "./type"

export function transform<
  TTransformerInput extends unknown[] = unknown[],
  TStepReturnInput extends [...StepReturn<TTransformerInput[number][]>] = [
    ...StepReturn<TTransformerInput[number]>[]
  ],
  TOutput = unknown
>(
  values: [...TStepReturnInput],
  ...functions: ((
    context: any,
    ...stepInputs: TTransformerInput
  ) => Promise<TOutput>)[]
): StepReturn<TOutput> {
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

  return returnFn as unknown as StepFunction<TStepReturnInput, TOutput>
}
