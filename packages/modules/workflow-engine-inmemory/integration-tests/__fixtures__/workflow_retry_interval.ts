/**
 * Test fixture for workflow with retry interval
 * Tests that steps with retry intervals properly retry after failures
 */

import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

// Mock counters to track execution attempts
export const retryIntervalStep1InvokeMock = jest.fn()
export const retryIntervalStep2InvokeMock = jest.fn()

// Step 1: Fails first 2 times, succeeds on 3rd attempt
const step_1_retry_interval = createStep(
  {
    name: "step_1_retry_interval",
    async: true,
    retryInterval: 1, // 1 second retry interval
    maxRetries: 3,
  },
  async (input: { attemptToSucceedOn: number }) => {
    const attemptCount = retryIntervalStep1InvokeMock.mock.calls.length + 1
    retryIntervalStep1InvokeMock(input)

    // Fail until we reach the target attempt
    if (attemptCount < input.attemptToSucceedOn) {
      throw new Error(`Step 1 failed on attempt ${attemptCount}, will retry`)
    }

    return new StepResponse({
      success: true,
      attempts: attemptCount,
      step: "step_1",
    })
  }
)

// Step 2: Always succeeds (to verify workflow continues after retry)
const step_2_after_retry = createStep(
  {
    name: "step_2_after_retry",
    async: true,
  },
  async (input: any) => {
    retryIntervalStep2InvokeMock(input)

    return new StepResponse({
      success: true,
      step: "step_2",
    })
  }
)

export const workflowRetryIntervalId = "workflow_retry_interval_test"

createWorkflow(
  {
    name: workflowRetryIntervalId,
    retentionTime: 600, // Keep for 10 minutes for debugging
  },
  function (input: { attemptToSucceedOn: number }) {
    const step1Result = step_1_retry_interval(input)
    const step2Result = step_2_after_retry({ step1Result })

    return new WorkflowResponse({
      step1: step1Result,
      step2: step2Result,
    })
  }
)
