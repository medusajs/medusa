import { createStep } from "./create-step"
import { createWorkflow } from "./create-workflow"
import { hook } from "./hook"
import { StepReturn } from "./type"
import { StepResponse } from "./helpers"

interface WorkflowInput {
  input: string
}

interface Step1Input {
  input: string
}

const step1 = createStep(
  "step1",
  async function (input: Step1Input, context) {
    return new StepResponse(
      {
        outputProp: "string",
      },
      {
        test: "test",
      }
    )
  },
  async function (input, context) {
    const test = input.test
  }
)

const workflow = createWorkflow(
  "workflow",
  function (input: StepReturn<WorkflowInput>) {
    const res = step1(input)
    const value = res.outputProp
    const hookRes = hook("myHook", res)
  }
)
