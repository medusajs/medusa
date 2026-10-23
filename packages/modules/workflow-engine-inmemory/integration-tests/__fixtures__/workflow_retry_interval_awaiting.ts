/**
 * Test fixture for workflow with both retry interval and awaiting retry interval
 * Tests that a background step retries after failing while awaiting
 */

import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setTimeout } from "timers/promises"

export const retryIntervalAwaitingStepInvokeMock = jest.fn()

// Fails on the first attempt, after the awaiting retry has been scheduled
const step_retry_interval_awaiting = createStep(
  {
    name: "step_retry_interval_awaiting",
    async: true,
    backgroundExecution: true,
    retryInterval: 1,
    retryIntervalAwaiting: 0.5,
    maxRetries: 2,
  },
  async () => {
    const attemptCount =
      retryIntervalAwaitingStepInvokeMock.mock.calls.length + 1
    retryIntervalAwaitingStepInvokeMock()

    await setTimeout(100)

    if (attemptCount === 1) {
      throw new Error(`Step failed on attempt ${attemptCount}, will retry`)
    }

    return new StepResponse({ success: true, attempts: attemptCount })
  }
)

export const workflowRetryIntervalAwaitingId =
  "workflow_retry_interval_awaiting_test"

createWorkflow(
  {
    name: workflowRetryIntervalAwaitingId,
    retentionTime: 600,
  },
  function () {
    return new WorkflowResponse(step_retry_interval_awaiting())
  }
)
