import {
  SymbolInputReference,
  SymbolWorkflowStep,
  SymbolWorkflowStepTransformer,
} from "./symbol"
import { StepTransformer } from "./type"

export function transform(
  values: unknown | unknown[],
  ...functions: Function[]
): StepTransformer {
  const returnFn = async function (context: any): Promise<any> {
    const { invoke } = context

    let stepValues = Array.isArray(values) ? values : [values]

    stepValues = stepValues.map((value: any) => {
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

    returnFn.__result = finalResult
    return finalResult
  }
  returnFn.__type = SymbolWorkflowStepTransformer
  returnFn.__result = undefined

  return returnFn
}
