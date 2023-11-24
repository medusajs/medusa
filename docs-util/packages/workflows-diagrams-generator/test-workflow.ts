import {
  createStep,
  StepResponse,
  createWorkflow,
  transform,
  parallelize
} from "@medusajs/workflows-sdk"

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
  console.log("whatever")
})

const step3 = createStep("step-3", async ({ name }: WorkflowInput) => {
  throw new Error("Throwing an error...")
})

const step4 = createStep("step-4", async ({ name }: WorkflowInput) => {
  throw new Error("Throwing an error...")
})

const step5 = createStep("step-5", async ({ name }: WorkflowInput) => {
  throw new Error("Throwing an error...")
})


export const myWorkflow = createWorkflow<WorkflowInput, WorkflowOutput>(
  "hello-world",
  function (input) {
    const str1 = step1({})
    const str2 = step2(input)
    
    parallelize(step3(input), step4(input))

    step5(input)

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
