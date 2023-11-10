import {
  SymbolInputReference,
  SymbolWorkflowStep,
  SymbolWorkflowStepTransformer,
} from "./symbol"

export function transform(
  values: unknown | unknown[],
  ...functions: Function[]
): any {
  const returnFn = async function (context: any): Promise<any> {
    const { invoke } = context

    let stepValues = Array.isArray(values) ? values : [values]

    stepValues = stepValues.map((value: any) => {
      if (value?.__type === SymbolInputReference) {
        return value.value
      }

      return value?.__type === SymbolWorkflowStep
        ? invoke[value.__step__]?.output
        : value
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
