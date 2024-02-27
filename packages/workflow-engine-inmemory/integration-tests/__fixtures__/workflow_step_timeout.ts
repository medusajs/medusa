import {
  StepResponse,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { setTimeout } from "timers/promises"

const step_1 = createStep(
  "step_1",
  jest.fn(async (input) => {
    await setTimeout(200)

    return new StepResponse(input, { compensate: 123 })
  }),
  jest.fn(() => {})
)

createWorkflow(
  {
    name: "workflow_step_timeout",
  },
  function (input) {
    const resp = step_1(input).config({
      timeout: 0.1, // 0.1 second
    })

    return resp
  }
)
