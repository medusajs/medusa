import { OrchestrationUtils } from "@medusajs/utils"
import { ulid } from "ulid"
import { createStep } from "./create-step"
import { StepResponse } from "./helpers/step-response"
import { StepExecutionContext, WorkflowData } from "./type"

type ConditionFunction<T extends object | WorkflowData> = (
  input: T extends WorkflowData<infer U>
    ? U
    : T extends object
    ? { [K in keyof T]: T[K] extends WorkflowData<infer U> ? U : T[K] }
    : {},
  context: StepExecutionContext
) => boolean

type ThenFunc = <ThenResolver extends () => any>(
  resolver: ThenResolver
) => ReturnType<ThenResolver> extends WorkflowData<infer ReturnedWorkflowData>
  ? WorkflowData<ReturnedWorkflowData> | undefined
  : ReturnType<ThenResolver>

export function when<T extends object | WorkflowData, Then extends Function>(
  values: T,
  condition: ConditionFunction<T>
): {
  then: ThenFunc
}

export function when(input, condition) {
  global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition] = {
    input,
    condition,
    steps: [],
  }

  let thenCalled = false
  process.nextTick(() => {
    if (!thenCalled) {
      throw new Error(`".then" is missing after "when" condition`)
    }
  })

  return {
    then: (fn) => {
      thenCalled = true
      const ret = fn()
      let returnStep = ret

      const applyCondition =
        global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition].steps

      if (ret?.__type !== OrchestrationUtils.SymbolWorkflowStep) {
        const retStep = createStep(
          "when-then-" + ulid(),
          ({ input }: { input: any }) => new StepResponse(input)
        )
        returnStep = retStep({ input: ret })
      }

      for (const step of applyCondition) {
        step.if(input, condition)
      }

      delete global[OrchestrationUtils.SymbolMedusaWorkflowComposerCondition]

      return returnStep
    },
  }
}
