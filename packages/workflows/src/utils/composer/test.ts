#!/usr/bin/env node

import { createStep, StepResponse, createWorkflow, transform } from "."

type WorkflowOutput = {
  message: string
}

type WorkflowInput = {
  name: string
}

const step1 = createStep(
  "step-1",
  async () => {
    const message = `Hello from step one!`

    console.log(message)

    return new StepResponse(message)
  },
  async () => {
    console.log("Oops! Rolling back my changes...")
  }
)

const step2 = createStep("step-2", async ({ name }: WorkflowInput) => {
  throw new Error("Throwing an error...")
})

const step3 = createStep("step-3", async ({ name }: WorkflowInput) => {
  throw new Error("Throwing an error...")
})

const step4 = createStep("step-4", async ({ name }: WorkflowInput) => {
  throw new Error("Throwing an error...")
})

const myWorkflow = createWorkflow<WorkflowInput, WorkflowOutput>(
  "hello-world",
  function (input) {
    const str1 = step1({})
    const str2 = step2(input)
    const str3 = step3(input)
    const str4 = step4(input)

    const result = transform(
      {
        str1,
        str2,
      },
      (input) => ({
        message: `${input.str1}\n${input.str2}`,
      })
    )

    return result
  }
)

export default myWorkflow
