import { IWorkflowEngineService } from "@medusajs/framework/types"
import { Modules, TransactionState } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { ulid } from "ulid"
import "../__fixtures__"

jest.setTimeout(30000)

const queueStepInvokeMock = jest.fn((input: any) => {
  return new StepResponse({ executed: true, input })
})

const queueStep = createStep("queue_execution_step_1", queueStepInvokeMock)

const queueWorkflow = createWorkflow(
  {
    name: "workflow_queue_execution",
    retentionTime: 60,
  },
  function (input: { hello: string }) {
    return new WorkflowResponse(queueStep(input))
  }
)

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  testSuite: ({ service: workflowOrcModule, medusaApp }) => {
    describe("Workflow Orchestrator module queued execution", function () {
      beforeEach(() => {
        jest.clearAllMocks()
      })

      const subscribeToFinish = (transactionId: string) => {
        return new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId: "workflow_queue_execution",
            transactionId,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                resolve()
              }
            },
          })
        })
      }

      it("should acknowledge the run and execute it detached when running via the workflow engine", async () => {
        const transactionId = "queue-tx-" + ulid()
        const finished = subscribeToFinish(transactionId)

        const ret = await workflowOrcModule.run("workflow_queue_execution", {
          input: { hello: "world" },
          transactionId,
          queue: true,
        })

        // The run must not have executed inline in the calling process
        expect(queueStepInvokeMock).toHaveBeenCalledTimes(0)

        expect(ret.acknowledgement).toEqual({
          workflowId: "workflow_queue_execution",
          transactionId,
          hasFinished: false,
          hasFailed: false,
          queued: true,
        })
        expect(ret.result).toBeUndefined()
        expect(ret.transaction).toBeUndefined()

        await finished

        expect(queueStepInvokeMock).toHaveBeenCalledTimes(1)
        expect(queueStepInvokeMock.mock.calls[0][0]).toEqual({
          hello: "world",
        })

        const executions = await workflowOrcModule.listWorkflowExecutions({
          transaction_id: transactionId,
        })

        expect(executions).toHaveLength(1)
        expect(executions[0].state).toEqual(TransactionState.DONE)
      })

      it("should acknowledge the run and execute it detached when running via the exported workflow", async () => {
        const transactionId = "queue-tx-" + ulid()
        const finished = subscribeToFinish(transactionId)

        const { acknowledgement, result, transaction } = await queueWorkflow(
          medusaApp.sharedContainer
        ).run({
          input: { hello: "queued" },
          queue: true,
          context: { transactionId },
        })

        expect(queueStepInvokeMock).toHaveBeenCalledTimes(0)

        expect(acknowledgement).toEqual({
          workflowId: "workflow_queue_execution",
          transactionId,
          hasFinished: false,
          hasFailed: false,
          queued: true,
        })
        expect(result).toBeUndefined()
        expect(transaction).toBeUndefined()

        await finished

        expect(queueStepInvokeMock).toHaveBeenCalledTimes(1)
        expect(queueStepInvokeMock.mock.calls[0][0]).toEqual({
          hello: "queued",
        })
      })

      it("should throw when combining events with a queued run", async () => {
        await expect(
          queueWorkflow(medusaApp.sharedContainer).run({
            input: { hello: "nope" },
            queue: true,
            events: {
              onBegin: () => void 0,
            },
          })
        ).rejects.toThrow(`"events" cannot be combined with "queue"`)

        expect(queueStepInvokeMock).toHaveBeenCalledTimes(0)
      })
    })
  },
})
