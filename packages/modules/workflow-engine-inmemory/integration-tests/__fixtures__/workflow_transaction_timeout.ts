import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@zjedene-medusa/framework/workflows-sdk"
import { setTimeout } from "timers/promises"

const step_1 = createStep(
  "step_1",
  jest.fn(async (input) => {
    input.test = "test"
    await setTimeout(200)

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
    const resp = step_1(input)

    return resp
  }
)
