import {
  StepResponse,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { setTimeout } from "timers/promises"

const step_1 = createStep(
  "step_1",
  jest.fn(async (input) => {
    console.log("init step_1")
    await setTimeout(200)

    console.log("step_1 DONE")
    return new StepResponse({
      executed: true,
    })
  }),
  jest.fn((invoke) => {
    console.log("timeout! reverting....", invoke)
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

createWorkflow(
  {
    name: "workflow_transaction_timeout_async",
    timeout: 0.1, // 0.1 second
  },
  function (input) {
    const resp = step_1(input).config({
      async: true,
    })

    return resp
  }
)
