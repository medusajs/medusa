/**
 * Integration test for workflow step retry intervals
 *
 * This test verifies the fix for the bug where steps with retry intervals
 * would get stuck after the first retry attempt due to retryRescheduledAt
 * not being properly cleared.
 */

import { IWorkflowEngineService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import {
  retryIntervalStep1InvokeMock,
  retryIntervalStep2InvokeMock,
  workflowRetryIntervalId,
} from "../__fixtures__/workflow_retry_interval"
import {
  retryIntervalStep0InvokeMock as retryIntervalStep0InvokeMockSync,
  retryIntervalStep1InvokeMock as retryIntervalStep1InvokeMockSync,
  retryIntervalStep2InvokeMock as retryIntervalStep2InvokeMockSync,
  workflowRetryIntervalId as workflowRetryIntervalIdSync,
} from "../__fixtures__/workflow_sync_retry_interval"
import { TestDatabase } from "../utils"

jest.setTimeout(60000) // Increase timeout for async retries

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  moduleOptions: {
    redis: {
      url: "localhost:6379",
    },
  },
  testSuite: ({ service: workflowOrcModule }) => {
    describe("Workflow Retry Interval", function () {
      beforeEach(async () => {
        await TestDatabase.clearTables()
        jest.clearAllMocks()
      })

      afterEach(async () => {
        await TestDatabase.clearTables()
      })

      it("should properly retry sync step with retry interval after failures", async () => {
        // Configure step to succeed on 3rd attempt
        const attemptToSucceedOn = 3

        // Track when each attempt happens
        const attemptTimestamps: number[] = []
        retryIntervalStep1InvokeMockSync.mockImplementation(() => {
          attemptTimestamps.push(Date.now())
        })

        // Create promise to wait for workflow completion
        const workflowCompletion = new Promise<{ result: any; errors: any }>(
          (resolve) => {
            workflowOrcModule.subscribe({
              workflowId: workflowRetryIntervalIdSync,
              subscriber: async (data) => {
                if (data.eventType === "onFinish") {
                  resolve({
                    result: data.result,
                    errors: data.errors,
                  })
                }
              },
            })
          }
        )

        // Execute workflow
        await workflowOrcModule.run(workflowRetryIntervalIdSync, {
          input: { attemptToSucceedOn },
          throwOnError: false,
        })

        // Wait for async workflow to complete
        const { result, errors } = await workflowCompletion

        // Assertions

        // Step 0 should have been called once
        expect(retryIntervalStep0InvokeMockSync).toHaveBeenCalledTimes(1)

        // Step 1 should have been called 3 times (2 failures + 1 success)
        expect(retryIntervalStep1InvokeMockSync).toHaveBeenCalledTimes(3)
        expect(retryIntervalStep1InvokeMockSync).toHaveBeenNthCalledWith(1, {
          attemptToSucceedOn,
        })
        expect(retryIntervalStep1InvokeMockSync).toHaveBeenNthCalledWith(2, {
          attemptToSucceedOn,
        })
        expect(retryIntervalStep1InvokeMockSync).toHaveBeenNthCalledWith(3, {
          attemptToSucceedOn,
        })

        // Step 2 should have been called once (after step 1 succeeded)
        expect(retryIntervalStep2InvokeMockSync).toHaveBeenCalledTimes(1)

        // Workflow should complete successfully
        expect(errors === undefined || errors.length === 0).toBe(true)
        expect(result).toBeDefined()
        expect(result.step1).toBeDefined()
        expect(result.step1.success).toBe(true)
        expect(result.step1.attempts).toBe(3)

        // Verify retry intervals are approximately 1 second (with some tolerance)
        if (attemptTimestamps.length >= 2) {
          const firstRetryInterval = attemptTimestamps[1] - attemptTimestamps[0]
          expect(firstRetryInterval).toBeGreaterThan(800) // At least 800ms
          expect(firstRetryInterval).toBeLessThan(2000) // Less than 2s
        }

        if (attemptTimestamps.length >= 3) {
          const secondRetryInterval =
            attemptTimestamps[2] - attemptTimestamps[1]
          expect(secondRetryInterval).toBeGreaterThan(800)
          expect(secondRetryInterval).toBeLessThan(2000)
        }
      })

      it("should properly retry async step with retry interval after failures", async () => {
        // Configure step to succeed on 3rd attempt
        const attemptToSucceedOn = 3

        // Track when each attempt happens
        const attemptTimestamps: number[] = []
        retryIntervalStep1InvokeMock.mockImplementation(() => {
          attemptTimestamps.push(Date.now())
        })

        // Create promise to wait for workflow completion
        const workflowCompletion = new Promise<{ result: any; errors: any }>(
          (resolve) => {
            workflowOrcModule.subscribe({
              workflowId: workflowRetryIntervalId,
              subscriber: async (data) => {
                if (data.eventType === "onFinish") {
                  resolve({
                    result: data.result,
                    errors: data.errors,
                  })
                }
              },
            })
          }
        )

        // Execute workflow
        await workflowOrcModule.run(workflowRetryIntervalId, {
          input: { attemptToSucceedOn },
          throwOnError: false,
        })

        // Wait for async workflow to complete
        const { result, errors } = await workflowCompletion

        // Assertions
        // Step 1 should have been called 3 times (2 failures + 1 success)
        expect(retryIntervalStep1InvokeMock).toHaveBeenCalledTimes(3)

        // Step 2 should have been called once (after step 1 succeeded)
        expect(retryIntervalStep2InvokeMock).toHaveBeenCalledTimes(1)

        // Workflow should complete successfully
        expect(errors === undefined || errors.length === 0).toBe(true)
        expect(result).toBeDefined()
        expect(result.step1).toBeDefined()
        expect(result.step1.success).toBe(true)
        expect(result.step1.attempts).toBe(3)

        // Verify retry intervals are approximately 1 second (with some tolerance)
        if (attemptTimestamps.length >= 2) {
          const firstRetryInterval = attemptTimestamps[1] - attemptTimestamps[0]
          expect(firstRetryInterval).toBeGreaterThan(800) // At least 800ms
          expect(firstRetryInterval).toBeLessThan(2000) // Less than 2s
        }

        if (attemptTimestamps.length >= 3) {
          const secondRetryInterval =
            attemptTimestamps[2] - attemptTimestamps[1]
          expect(secondRetryInterval).toBeGreaterThan(800)
          expect(secondRetryInterval).toBeLessThan(2000)
        }
      })
    })
  },
})
