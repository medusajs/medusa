import {
  StepResponse,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"

const step_1 = createStep(
  "step_1",
  jest.fn((input) => {
    input.test = "test"
    return new StepResponse(input, { compensate: 123 })
  }),
  jest.fn((compensateInput) => {
    if (!compensateInput) {
      return
    }

    return new StepResponse({
      reverted: true,
    })
  })
)

createWorkflow(
  {
    name: "workflow_transaction_timeout",
    timeout: 0.1, // 0.1 second
  },
  function (input) {
    const resp = step_1(input).config({
      async: true,
    })

    return resp
  }
)
