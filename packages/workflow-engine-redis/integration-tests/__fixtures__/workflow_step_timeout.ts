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
  })
)

const step_1_async = createStep(
  {
    name: "step_1_async",
    async: true,
    timeout: 0.1, // 0.1 second
  },

  jest.fn(async (input) => {
    return
  })
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

createWorkflow(
  {
    name: "workflow_step_timeout_async",
  },
  function (input) {
    const resp = step_1_async(input)

    return resp
  }
)
