import { IWorkflowEngineService } from "@medusajs/framework/types"
import { Modules, TransactionHandlerType } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  parallelize,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { setTimeout } from "timers/promises"
import { ulid } from "ulid"
import "../__fixtures__"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  testSuite: ({ service: workflowOrcModule }) => {
    describe("Testing race condition of the workflow during retry", () => {
      it("should manage saving multiple async steps in concurrency", async () => {
        const step0 = createStep(
          { name: "step0", async: true, backgroundExecution: true },
          async () => {
            return new StepResponse("result from step 0")
          }
        )

        const step1 = createStep(
          { name: "step1", async: true, backgroundExecution: true },
          async () => {
            return new StepResponse("result from step 1")
          }
        )

        const step2 = createStep(
          { name: "step2", async: true, backgroundExecution: true },
          async () => {
            return new StepResponse("result from step 2")
          }
        )
        const step3 = createStep(
          { name: "step3", async: true, backgroundExecution: true },
          async () => {
            return new StepResponse("result from step 3")
          }
        )

        const step4 = createStep(
          { name: "step4", async: true, backgroundExecution: true },
          async () => {
            return new StepResponse("result from step 4")
          }
        )
        const step5 = createStep({ name: "step5" }, async (all: string[]) => {
          const ret = [...all, "result from step 5"]
          return new StepResponse(ret)
        })

        const workflowId = "workflow-1" + ulid()
        createWorkflow(
          {
            name: workflowId,
            idempotent: true,
            retentionTime: 5,
          },
          function () {
            const all = parallelize(step0(), step1(), step2(), step3(), step4())
            const res = step5(all)
            return new WorkflowResponse(res)
          }
        )

        const transactionId = ulid()
        const done = new Promise<void>((resolve, reject) => {
          void workflowOrcModule.subscribe({
            workflowId: workflowId,
            transactionId,
            subscriber: async (event) => {
              if (event.eventType === "onFinish") {
                resolve(event.result)
              }
            },
          })
        })

        await workflowOrcModule.run(workflowId, {
          throwOnError: false,
          logOnError: true,
          transactionId,
        })

        const result = await done

        expect(result).toEqual([
          "result from step 0",
          "result from step 1",
          "result from step 2",
          "result from step 3",
          "result from step 4",
          "result from step 5",
        ])
      })

      it("should manage saving multiple async steps in concurrency without background execution while setting steps as success manually concurrently", async () => {
        const step0 = createStep({ name: "step0", async: true }, async () => {})

        const step1 = createStep({ name: "step1", async: true }, async () => {})

        const step2 = createStep({ name: "step2", async: true }, async () => {})
        const step3 = createStep({ name: "step3", async: true }, async () => {})

        const step4 = createStep({ name: "step4", async: true }, async () => {})
        const step5 = createStep({ name: "step5" }, async (all: any[]) => {
          const ret = [...all, "result from step 5"]
          return new StepResponse(ret)
        })

        const workflowId = "workflow-1" + ulid()
        createWorkflow(
          {
            name: workflowId,
            idempotent: true,
            retentionTime: 1,
          },
          function () {
            const all = parallelize(step0(), step1(), step2(), step3(), step4())
            const res = step5(all)
            return new WorkflowResponse(res)
          }
        )

        const transactionId = ulid()
        const done = new Promise<void>((resolve, reject) => {
          void workflowOrcModule.subscribe({
            workflowId: workflowId,
            transactionId,
            subscriber: async (event) => {
              if (event.eventType === "onFinish") {
                resolve(event.result)
              }
            },
          })
        })

        await workflowOrcModule.run(workflowId, {
          throwOnError: false,
          logOnError: true,
          transactionId,
        })

        await setTimeout(100) // Just to wait a bit before firering everything

        for (let i = 0; i <= 4; i++) {
          void workflowOrcModule.setStepSuccess({
            idempotencyKey: {
              workflowId: workflowId,
              transactionId: transactionId,
              stepId: `step${i}`,
              action: TransactionHandlerType.INVOKE,
            },
            stepResponse: new StepResponse("result from step " + i),
          })
        }

        const res = await done

        expect(res).toEqual([
          "result from step 0",
          "result from step 1",
          "result from step 2",
          "result from step 3",
          "result from step 4",
          "result from step 5",
        ])
      })

      it("should prevent race continuation of the workflow during retryIntervalAwaiting in background execution", async () => {
        const transactionId = "transaction_id" + ulid()
        const workflowId = "RACE_workflow-1" + ulid()

        const step0InvokeMock = jest.fn()
        const step1InvokeMock = jest.fn()
        const step2InvokeMock = jest.fn()
        const transformMock = jest.fn()

        const step0 = createStep("step0", async (_) => {
          step0InvokeMock()
          return new StepResponse("result from step 0")
        })

        const step1 = createStep("step1", async (_) => {
          step1InvokeMock()
          await setTimeout(200)
          return new StepResponse({ isSuccess: true })
        })

        const step2 = createStep("step2", async (input: any) => {
          step2InvokeMock()
          return new StepResponse({ result: input })
        })

        const subWorkflow = createWorkflow("sub-workflow-1", function () {
          const status = step1()
          return new WorkflowResponse(status)
        })

        createWorkflow(
          {
            name: workflowId,
            idempotent: true,
            retentionTime: 5,
          },
          function () {
            const build = step0()

            const status = subWorkflow.runAsStep({} as any).config({
              async: true,
              compensateAsync: true,
              backgroundExecution: true,
              retryIntervalAwaiting: 0.1,
            })

            const transformedResult = transform({ status }, (data) => {
              transformMock()
              return {
                status: data.status,
              }
            })

            step2(transformedResult)
            return new WorkflowResponse(build)
          }
        )

        const onFinish = new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId,
            transactionId,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                resolve()
              }
            },
          })
        })

        workflowOrcModule
          .run(workflowId, {
            transactionId,
            throwOnError: false,
            logOnError: true,
          })
          .then(({ result }) => {
            expect(result).toBe("result from step 0")
          })

        await onFinish

        expect(step0InvokeMock).toHaveBeenCalledTimes(1)
        expect(step1InvokeMock.mock.calls.length).toBeGreaterThan(1)
        expect(step2InvokeMock).toHaveBeenCalledTimes(1)
        expect(transformMock).toHaveBeenCalledTimes(1)
      })

      it("should prevent race continuation of the workflow compensation during retryIntervalAwaiting in background execution", async () => {
        const transactionId = "transaction_id" + ulid()
        const workflowId = "RACE_workflow-1" + ulid()

        const step0InvokeMock = jest.fn()
        const step0CompensateMock = jest.fn()
        const step1InvokeMock = jest.fn()
        const step1CompensateMock = jest.fn()
        const step2InvokeMock = jest.fn()
        const transformMock = jest.fn()

        const step0 = createStep(
          "RACE_step0",
          async (_) => {
            step0InvokeMock()
            return new StepResponse("result from step 0")
          },
          () => {
            step0CompensateMock()
          }
        )

        const step1 = createStep(
          "RACE_step1",
          async (_) => {
            step1InvokeMock()
            await setTimeout(1000)
            throw new Error("error from step 1")
          },
          () => {
            step1CompensateMock()
          }
        )

        const step2 = createStep("RACE_step2", async (input: any) => {
          step2InvokeMock()
          return new StepResponse({ result: input })
        })

        const subWorkflow = createWorkflow("RACE_sub-workflow-1", function () {
          const status = step1()
          return new WorkflowResponse(status)
        })

        createWorkflow(
          {
            name: workflowId,
          },
          function () {
            const build = step0()

            const status = subWorkflow.runAsStep({} as any).config({
              async: true,
              compensateAsync: true,
              backgroundExecution: true,
              retryIntervalAwaiting: 0.1,
              maxAwaitingRetries: 3,
            })

            const transformedResult = transform({ status }, (data) => {
              transformMock()
              return {
                status: data.status,
              }
            })

            step2(transformedResult)
            return new WorkflowResponse(build)
          }
        )

        const onFinish = new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId,
            transactionId,
            subscriber: async (event) => {
              if (event.eventType === "onFinish") {
                resolve()
              }
            },
          })
        })

        await workflowOrcModule
          .run(workflowId, {
            transactionId,
            throwOnError: false,
            logOnError: true,
          })
          .then(({ result }) => {
            expect(result).toBe("result from step 0")
          })

        await onFinish

        expect(step0InvokeMock).toHaveBeenCalledTimes(1)
        expect(step0CompensateMock).toHaveBeenCalledTimes(1)
        expect(step1InvokeMock).toHaveBeenCalledTimes(3)
        expect(step1CompensateMock.mock.calls.length).toBeGreaterThan(0)
        expect(step2InvokeMock).toHaveBeenCalledTimes(0)
        expect(transformMock).toHaveBeenCalledTimes(0)
      })
    })
  },
})
