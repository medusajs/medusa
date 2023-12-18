import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/workflows-sdk"

const step1 = createStep("step1", async (_, context) => {
  return new StepResponse({
    value: "test",
  })
})

const step2 = createStep("step2", async (_, context) => {
  return new StepResponse({
    value: "test2",
  })
})

const step3 = createStep("step3", async (_, context) => {
  return new StepResponse({
    value: "test3",
  })
})

const asyncWorkflow = createWorkflow<void, { value: string }>(
  "async_test",
  (input) => {
    step1({})
    step2({})
    return step3({})
  }
)

asyncWorkflow().replaceAction(
  "step2",
  "step2",
  {
    invoke: async () => {
      return new StepResponse({
        value: "test2",
      })
    },
  },
  {
    async: true,
  }
)

export { asyncWorkflow }
