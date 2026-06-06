import { IWorkflowEngineService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@zjedene-medusa/framework/workflows-sdk"
import { moduleIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { setTimeout as setTimeoutSync } from "timers"
import { setTimeout as setTimeoutPromise } from "timers/promises"
import { ulid } from "ulid"
import "../__fixtures__"

jest.setTimeout(60000)

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  testSuite: ({ service: workflowOrcModule }) => {
    describe("Workflow Orchestrator module subscribe", function () {
      it("should subscribe to a workflow and receive the response when it finishes", async () => {
        const step1 = createStep({ name: "step1" }, async () => {
          return new StepResponse("step1")
        })
        const step2 = createStep({ name: "step2" }, async () => {
          await setTimeoutPromise(1000)
          return new StepResponse("step2")
        })

        const workflowId = "workflow" + ulid()
        createWorkflow(workflowId, function (input) {
          step1()
          step2().config({
            async: true,
          })
          return new WorkflowResponse("workflow")
        })

        const step1_1 = createStep({ name: "step1_1" }, async () => {
          return new StepResponse("step1_1")
        })
        const step2_1 = createStep({ name: "step2_1" }, async () => {
          await setTimeoutPromise(1000)
          return new StepResponse("step2_1")
        })

        const workflow2Id = "workflow_2" + ulid()
        createWorkflow(workflow2Id, function (input) {
          step1_1()
          step2_1().config({
            async: true,
          })
          return new WorkflowResponse("workflow_2")
        })

        const transactionId = "trx_123" + ulid()
        const transactionId2 = "trx_124" + ulid()

        const onWorkflowFinishSpy = jest.fn()

        const onWorkflowFinishPromise = new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId: workflowId,
            transactionId,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                onWorkflowFinishSpy()
                workflowOrcModule.run(workflow2Id, {
                  transactionId: transactionId2,
                })
                resolve()
              }
            },
          })
        })

        const onWorkflow2FinishSpy = jest.fn()

        const workflow2FinishPromise = new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId: workflow2Id,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                onWorkflow2FinishSpy()
                resolve()
              }
            },
          })
        })

        workflowOrcModule.run(workflowId, {
          transactionId,
        })

        await onWorkflowFinishPromise
        await workflow2FinishPromise

        expect(onWorkflowFinishSpy).toHaveBeenCalledTimes(1)
        expect(onWorkflow2FinishSpy).toHaveBeenCalledTimes(1)
      })

      it("should subscribe to a workflow and receive the response when it finishes (2)", async () => {
        const step1 = createStep({ name: "step1" }, async () => {
          return new StepResponse("step1")
        })
        const step2 = createStep({ name: "step2" }, async () => {
          await setTimeoutPromise(1000)
          return new StepResponse("step2")
        })

        const workflowId = "workflow" + ulid()
        createWorkflow(workflowId, function (input) {
          step1()
          step2().config({
            async: true,
          })
          return new WorkflowResponse("workflow")
        })

        const step1_1 = createStep({ name: "step1_1" }, async () => {
          return new StepResponse("step1_1")
        })
        const step2_1 = createStep({ name: "step2_1" }, async () => {
          await setTimeoutPromise(1000)
          return new StepResponse("step2_1")
        })

        const workflow2Id = "workflow_2" + ulid()
        createWorkflow(workflow2Id, function (input) {
          step1_1()
          step2_1().config({
            async: true,
          })
          return new WorkflowResponse("workflow_2")
        })

        const transactionId = "trx_123" + ulid()
        const transactionId2 = "trx_124" + ulid()

        const onWorkflowFinishSpy = jest.fn()

        const onWorkflowFinishPromise = new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId: workflowId,
            transactionId,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                onWorkflowFinishSpy()
                workflowOrcModule.run(workflow2Id, {
                  transactionId: transactionId2,
                })
                resolve()
              }
            },
          })
        })

        const onWorkflow2FinishSpy = jest.fn()

        const workflow2FinishPromise = new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId: workflow2Id,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                onWorkflow2FinishSpy()
                resolve()
              }
            },
          })
        })

        workflowOrcModule.run(workflowId, {
          transactionId,
        })

        await onWorkflowFinishPromise
        await workflow2FinishPromise

        expect(onWorkflowFinishSpy).toHaveBeenCalledTimes(1)
        expect(onWorkflow2FinishSpy).toHaveBeenCalledTimes(1)
      })
    })
  },
})
