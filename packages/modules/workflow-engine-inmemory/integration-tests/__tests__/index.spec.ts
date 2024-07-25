import { WorkflowManager } from "@medusajs/orchestration"
import {
  Context,
  IWorkflowEngineService,
  RemoteQueryFunction,
} from "@medusajs/types"
import { Module, Modules, TransactionHandlerType } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { setTimeout as setTimeoutPromise } from "timers/promises"
import "../__fixtures__"
import {
  conditionalStep2Invoke,
  conditionalStep3Invoke,
  workflow2Step2Invoke,
  workflow2Step3Invoke,
} from "../__fixtures__"
import {
  eventGroupWorkflowId,
  workflowEventGroupIdStep1Mock,
  workflowEventGroupIdStep2Mock,
} from "../__fixtures__/workflow_event_group_id"
import { createScheduled } from "../__fixtures__/workflow_scheduled"
import { WorkflowsModuleService } from "@services"
import { asFunction } from "awilix"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  testSuite: ({ service: workflowOrcModule, medusaApp }) => {
    describe("Workflow Orchestrator module", function () {
      let query: RemoteQueryFunction

      beforeEach(() => {
        query = medusaApp.query
      })

      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.WORKFLOW_ENGINE, {
          service: WorkflowsModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual(["workflowExecution"])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          workflowExecution: {
            id: {
              linkable: "workflow_execution_id",
              primaryKey: "id",
              serviceName: "workflows",
              field: "workflowExecution",
            },
          },
        })
      })

      it("should execute an async workflow keeping track of the event group id provided in the context", async () => {
        const eventGroupId = "event-group-id"

        await workflowOrcModule.run(eventGroupWorkflowId, {
          input: {},
          context: {
            eventGroupId,
            transactionId: "transaction_id",
          },
          throwOnError: true,
        })

        await workflowOrcModule.setStepSuccess({
          idempotencyKey: {
            action: TransactionHandlerType.INVOKE,
            stepId: "step_1_event_group_id_background",
            workflowId: eventGroupWorkflowId,
            transactionId: "transaction_id",
          },
          stepResponse: { hey: "oh" },
        })

        // Validate context event group id
        expect(workflowEventGroupIdStep1Mock.mock.calls[0][1]).toEqual(
          expect.objectContaining({ eventGroupId })
        )
        expect(workflowEventGroupIdStep2Mock.mock.calls[0][1]).toEqual(
          expect.objectContaining({ eventGroupId })
        )
      })

      it("should execute an async workflow keeping track of the event group id that has been auto generated", async () => {
        await workflowOrcModule.run(eventGroupWorkflowId, {
          input: {},
          context: {
            transactionId: "transaction_id_2",
          },
          throwOnError: true,
        })

        await workflowOrcModule.setStepSuccess({
          idempotencyKey: {
            action: TransactionHandlerType.INVOKE,
            stepId: "step_1_event_group_id_background",
            workflowId: eventGroupWorkflowId,
            transactionId: "transaction_id_2",
          },
          stepResponse: { hey: "oh" },
        })

        const generatedEventGroupId = (workflowEventGroupIdStep1Mock.mock
          .calls[0][1] as unknown as Context)!.eventGroupId

        // Validate context event group id
        expect(workflowEventGroupIdStep1Mock.mock.calls[0][1]).toEqual(
          expect.objectContaining({ eventGroupId: generatedEventGroupId })
        )
        expect(workflowEventGroupIdStep2Mock.mock.calls[0][1]).toEqual(
          expect.objectContaining({ eventGroupId: generatedEventGroupId })
        )
      })

      describe("Testing basic workflow", function () {
        beforeEach(() => {
          jest.clearAllMocks()
        })

        it("should return a list of workflow executions and remove after completed when there is no retentionTime set", async () => {
          await workflowOrcModule.run("workflow_1", {
            input: {
              value: "123",
            },
            throwOnError: true,
          })

          let executionsList = await query({
            workflow_executions: {
              fields: ["workflow_id", "transaction_id", "state"],
            },
          })

          expect(executionsList).toHaveLength(1)

          const { result } = await workflowOrcModule.setStepSuccess({
            idempotencyKey: {
              action: TransactionHandlerType.INVOKE,
              stepId: "new_step_name",
              workflowId: "workflow_1",
              transactionId: executionsList[0].transaction_id,
            },
            stepResponse: { uhuuuu: "yeaah!" },
          })

          executionsList = await query({
            workflow_executions: {
              fields: ["id"],
            },
          })

          expect(executionsList).toHaveLength(0)
          expect(result).toEqual({
            done: {
              inputFromSyncStep: "oh",
            },
          })
        })

        it("should return a list of workflow executions and keep it saved when there is a retentionTime set", async () => {
          await workflowOrcModule.run("workflow_2", {
            input: {
              value: "123",
            },
            throwOnError: true,
            transactionId: "transaction_1",
          })

          let executionsList = await query({
            workflow_executions: {
              fields: ["id"],
            },
          })

          expect(executionsList).toHaveLength(1)

          await workflowOrcModule.setStepSuccess({
            idempotencyKey: {
              action: TransactionHandlerType.INVOKE,
              stepId: "new_step_name",
              workflowId: "workflow_2",
              transactionId: "transaction_1",
            },
            stepResponse: { uhuuuu: "yeaah!" },
          })

          expect(workflow2Step2Invoke).toBeCalledTimes(2)
          expect(workflow2Step2Invoke.mock.calls[0][0]).toEqual({ hey: "oh" })
          expect(workflow2Step2Invoke.mock.calls[1][0]).toEqual({
            hey: "async hello",
          })

          expect(workflow2Step3Invoke).toBeCalledTimes(1)
          expect(workflow2Step3Invoke.mock.calls[0][0]).toEqual({
            uhuuuu: "yeaah!",
          })

          executionsList = await query({
            workflow_executions: {
              fields: ["id"],
            },
          })

          expect(executionsList).toHaveLength(1)
        })

        it("should revert the entire transaction when a step timeout expires", async () => {
          const { transaction } = await workflowOrcModule.run(
            "workflow_step_timeout",
            {
              input: {},
              throwOnError: false,
            }
          )

          expect(transaction.flow.state).toEqual("reverted")
        })

        it("should revert the entire transaction when the transaction timeout expires", async () => {
          const { transaction } = await workflowOrcModule.run(
            "workflow_transaction_timeout",
            {
              input: {},
              throwOnError: false,
            }
          )

          await setTimeoutPromise(200)

          expect(transaction.flow.state).toEqual("reverted")
        })

        it("should subscribe to a async workflow and receive the response when it finishes", (done) => {
          const transactionId = "trx_123"

          const onFinish = jest.fn(() => {
            done()
          })

          void workflowOrcModule.subscribe({
            workflowId: "workflow_async_background",
            transactionId,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                onFinish()
              }
            },
          })

          void workflowOrcModule.run("workflow_async_background", {
            input: {
              myInput: "123",
            },
            transactionId,
            throwOnError: false,
          })

          expect(onFinish).toHaveBeenCalledTimes(0)
        })

        it("should run conditional steps if condition is true", (done) => {
          void workflowOrcModule.subscribe({
            workflowId: "workflow_conditional_step",
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                done()
                expect(conditionalStep2Invoke).toHaveBeenCalledTimes(2)
                expect(conditionalStep3Invoke).toHaveBeenCalledTimes(1)
              }
            },
          })

          workflowOrcModule.run("workflow_conditional_step", {
            input: {
              runNewStepName: true,
            },
            throwOnError: true,
          })
        })

        it("should not run conditional steps if condition is false", (done) => {
          void workflowOrcModule.subscribe({
            workflowId: "workflow_conditional_step",
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                done()
                expect(conditionalStep2Invoke).toHaveBeenCalledTimes(1)
                expect(conditionalStep3Invoke).toHaveBeenCalledTimes(0)
              }
            },
          })

          workflowOrcModule.run("workflow_conditional_step", {
            input: {
              runNewStepName: false,
            },
            throwOnError: true,
          })
        })
      })

      describe("Scheduled workflows", () => {
        beforeEach(() => {
          jest.clearAllMocks()
        })

        beforeAll(() => {
          jest.useFakeTimers()
          jest.spyOn(global, "setTimeout")
        })

        afterAll(() => {
          jest.useRealTimers()
        })

        it("should execute a scheduled workflow", async () => {
          const spy = createScheduled("standard")

          await jest.runOnlyPendingTimersAsync()
          expect(setTimeout).toHaveBeenCalledTimes(2)
          expect(spy).toHaveBeenCalledTimes(1)

          await jest.runOnlyPendingTimersAsync()
          expect(setTimeout).toHaveBeenCalledTimes(3)
          expect(spy).toHaveBeenCalledTimes(2)
        })

        it("should stop executions after the set number of executions", async () => {
          const spy = await createScheduled("num-executions", {
            cron: "* * * * * *",
            numberOfExecutions: 2,
          })

          await jest.runOnlyPendingTimersAsync()
          expect(spy).toHaveBeenCalledTimes(1)

          await jest.runOnlyPendingTimersAsync()
          expect(spy).toHaveBeenCalledTimes(2)

          await jest.runOnlyPendingTimersAsync()
          expect(spy).toHaveBeenCalledTimes(2)
        })

        it("should remove scheduled workflow if workflow no longer exists", async () => {
          const spy = await createScheduled("remove-scheduled", {
            cron: "* * * * * *",
          })
          const logSpy = jest.spyOn(console, "warn")

          await jest.runOnlyPendingTimersAsync()
          expect(spy).toHaveBeenCalledTimes(1)

          WorkflowManager["workflows"].delete("remove-scheduled")

          await jest.runOnlyPendingTimersAsync()
          expect(spy).toHaveBeenCalledTimes(1)
          expect(logSpy).toHaveBeenCalledWith(
            "Tried to execute a scheduled workflow with ID remove-scheduled that does not exist, removing it from the scheduler."
          )
        })

        it("the scheduled workflow should have access to the shared container", async () => {
          const sharedContainer =
            workflowOrcModule["workflowOrchestratorService_"]["container_"]

          sharedContainer.register(
            "test-value",
            asFunction(() => "test")
          )

          const spy = await createScheduled("shared-container-job", {
            cron: "* * * * * *",
          })
          await jest.runOnlyPendingTimersAsync()
          expect(spy).toHaveBeenCalledTimes(1)
          expect(spy).toHaveReturnedWith(
            expect.objectContaining({ output: { testValue: "test" } })
          )
        })

        it("should fetch an idempotent workflow after its completion", async () => {
          const { transaction: firstRun } = await workflowOrcModule.run(
            "workflow_idempotent",
            {
              input: {
                value: "123",
              },
              throwOnError: true,
              transactionId: "transaction_1",
            }
          )

          let executionsList = await query({
            workflow_executions: {
              fields: ["id"],
            },
          })

          const { transaction: secondRun } = await workflowOrcModule.run(
            "workflow_idempotent",
            {
              input: {
                value: "123",
              },
              throwOnError: true,
              transactionId: "transaction_1",
            }
          )

          const executionsListAfter = await query({
            workflow_executions: {
              fields: ["id"],
            },
          })

          expect(secondRun.flow.startedAt).toEqual(firstRun.flow.startedAt)
          expect(executionsList).toHaveLength(1)
          expect(executionsListAfter).toHaveLength(1)
        })
      })
    })
  },
})
