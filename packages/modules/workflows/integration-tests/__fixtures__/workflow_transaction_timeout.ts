import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { setTimeout } from "timers/promises"

const step_1 = createStep(
  "step_1",
  jest.fn(async (input) => {
    // Outlasts the run timeout plus the dispatcher's poll interval
    await setTimeout(500)

    return new StepResponse({
      executed: true,
    })
  }),
  jest.fn()
)

const step_1_async = createStep(
  "step_1_async",
  jest.fn(async (input) => {}),
  jest.fn()
)

export const workflowTransactionTimeout = createWorkflow(
  {
    name: "workflow_transaction_timeout",
    timeout: 0.1, // 0.1 second
  },
  function (input) {
    const resp = step_1(input)

    return resp
  }
)

export const workflowTransactionTimeoutAsync = createWorkflow(
  {
    name: "workflow_transaction_timeout_async",
    timeout: 0.1, // 0.1 second
    idempotent: true,
    retentionTime: 5,
  },
  function (input) {
    const resp = step_1_async(input).config({
      async: true,
    })

    return resp
  }
)
