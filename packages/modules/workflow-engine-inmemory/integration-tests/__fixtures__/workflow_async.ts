import {
  StepResponse,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { setTimeout } from "timers/promises"

const step_1_background = createStep(
  {
    name: "step_1_background",
    async: true,
  },
  jest.fn(async (input) => {
    await setTimeout(200)

    return new StepResponse(input)
  })
)

createWorkflow(
  {
    name: "workflow_async_background",
  },
  function (input) {
    const resp = step_1_background(input)

    return resp
  }
)
