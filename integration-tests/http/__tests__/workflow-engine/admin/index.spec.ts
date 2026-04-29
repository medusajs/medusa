import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, TransactionState } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setTimeout } from "timers/promises"
import { IWorkflowEngineService } from "@medusajs/framework/types"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container
    let workflowOrcModule: IWorkflowEngineService

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      workflowOrcModule = container.resolve(Modules.WORKFLOW_ENGINE)
    })

    describe("GET /admin/workflow-executions", () => {
      it("should filter using q", async () => {
        const step1 = createStep(
          {
            name: "my-step",
          },
          async (_) => {
            return new StepResponse({ result: "success" })
          }
        )

        const workflowName = "workflow-admin/workflow-executions"
        createWorkflow(
          {
            name: workflowName,
            retentionTime: 50,
          },
          function (input: WorkflowData<{ initial: string }>) {
            const stepRes = step1()

            return new WorkflowResponse(stepRes)
          }
        )

        const engine = container.resolve(Modules.WORKFLOW_ENGINE)

        const transactionId = "test-transaction-id"
        await engine.run(workflowName, {
          transactionId,
          input: {
            initial: "test",
          },
        })

        const transactionId2 = "unknown"
        await engine.run(workflowName, {
          transactionId: transactionId2,
          input: {
            initial: "test",
          },
        })

        const q = "transaction-id"
        const response = await api.get(
          `/admin/workflows-executions?q=${q}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.workflow_executions.length).toEqual(1)
        expect(response.data.workflow_executions[0].transaction_id).toEqual(
          transactionId
        )

        const q2 = "known"
        const response2 = await api.get(
          `/admin/workflows-executions?q=${q2}`,
          adminHeaders
        )

        expect(response2.status).toEqual(200)
        expect(response2.data.workflow_executions.length).toEqual(1)
        expect(response2.data.workflow_executions[0].transaction_id).toEqual(
          transactionId2
        )
      })
    })

    describe("POST /admin/workflow-execution/[workflow_id]/steps/failure", function () {
        it("should set step as failed", async () => {
            const stepId = 'test-step'
            const step = createStep({
                name: stepId,
                async: true,
            }, () => { })

            const workflowId = 'test-workflow'
            createWorkflow({
                name: workflowId,
                retentionTime: 60,
            }, () => {
                step()
                return new WorkflowResponse(void 0)
            })

            const transactionId = "test-transaction"
            const engine = container.resolve(Modules.WORKFLOW_ENGINE) as IWorkflowEngineService
            await engine.run(workflowId, {
                transactionId
            })
            let workflowDetail = (await api.get(`/admin/workflows-executions/${workflowId}/${transactionId}`, adminHeaders)).data.workflow_execution

            expect(workflowDetail.state).toBe(TransactionState.INVOKING)

            const setFailureResponse = await api.post(`/admin/workflows-executions/${workflowId}/steps/failure`, {
                transaction_id: transactionId,
                step_id: stepId
            }, adminHeaders)

            expect(setFailureResponse.status).toBe(200)
            expect(setFailureResponse.data).toEqual(
                expect.objectContaining({
                    success: true,
                })
            )

            workflowDetail = (await api.get(`/admin/workflows-executions/${workflowId}/${transactionId}`, adminHeaders)).data.workflow_execution
            
            expect(workflowDetail).toEqual(
                expect.objectContaining({
                    state: TransactionState.REVERTED,
                })
            )
        })
    })

    describe("Workflow Orchestrator module subscribe", function () {
      it("should subscribe to a workflow and receive the response when it finishes", async () => {
        const step1 = createStep({ name: "step1" }, async () => {
          return new StepResponse("step1")
        })
        const step2 = createStep({ name: "step2" }, async () => {
          await setTimeout(1000)
          return new StepResponse("step2")
        })

        const workflowId =
          "workflow" + Math.random().toString(36).substring(2, 15)
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
          await setTimeout(1000)
          return new StepResponse("step2_1")
        })

        const workflow2Id =
          "workflow_2" + Math.random().toString(36).substring(2, 15)
        createWorkflow(workflow2Id, function (input) {
          step1_1()
          step2_1().config({
            async: true,
          })
          return new WorkflowResponse("workflow_2")
        })

        const transactionId =
          "trx_123" + Math.random().toString(36).substring(2, 15)
        const transactionId2 =
          "trx_124" + Math.random().toString(36).substring(2, 15)

        const onWorkflowFinishSpy = jest.fn()

        const onWorkflowFinishPromise = new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId: workflowId,
            transactionId,
            subscriber: (event) => {
              console.log("event", event)
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
              console.log("event", event)
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
          await setTimeout(1000)
          return new StepResponse("step2")
        })

        const workflowId =
          "workflow" + Math.random().toString(36).substring(2, 15)
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
          await setTimeout(1000)
          return new StepResponse("step2_1")
        })

        const workflow2Id =
          "workflow_2" + Math.random().toString(36).substring(2, 15)
        createWorkflow(workflow2Id, function (input) {
          step1_1()
          step2_1().config({
            async: true,
          })
          return new WorkflowResponse("workflow_2")
        })

        const transactionId =
          "trx_123" + Math.random().toString(36).substring(2, 15)
        const transactionId2 =
          "trx_124" + Math.random().toString(36).substring(2, 15)

        const onWorkflowFinishSpy = jest.fn()

        const onWorkflowFinishPromise = new Promise<void>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId: workflowId,
            transactionId,
            subscriber: (event) => {
              console.log("event", event)
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
              console.log("event", event)
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
