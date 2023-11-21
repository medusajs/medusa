/*
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
*/

import { createStep, StepResponse } from "@medusajs/workflows"
import { createWorkflow } from "./create-workflow"
import { StepReturn } from "./type"

type WorkflowInput = {
  name: string
}

type WorkflowOutput = {
  message: StepReturn<string>
}

const step1 = createStep("step-1", async (input: {}, context) => {
  return new StepResponse("Hello, ")
})

const step2 = createStep("step-2", async ({ name }: WorkflowInput) => {
  return new StepResponse(`${name}!`)
})

const myWorkflow = createWorkflow(
  "hello-world",
  function (input: StepReturn<WorkflowInput>): WorkflowOutput {
    const str1 = step1({})
    const str2 = step2(input)

    return {
      message: str1,
    }
  }
)

myWorkflow()
  .run({
    input: {
      name: "John",
    },
  })
  .then(({ result }) => {
    console.log(result.message)
  })
