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

const a = createWorkflow(
  {
    name: "workflow_async_background_sub",
  },
  function (input) {
    const resp = step_1_background(input)

    return resp
  }
)

createWorkflow(
  {
    name: "workflow_async_background",
  },
  function (input) {
    //return parallelize(
    return a
      .runAsStep({
        input,
      })
      .config({ name: "workflow_async_background_sub_1" })
    //)
  }
)
