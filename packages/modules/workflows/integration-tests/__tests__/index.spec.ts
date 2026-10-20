/**
 * Ported from the workflow-engine-inmemory and workflow-engine-redis suites.
 *
 * Dropped:
 * - Redis module options (queueName, jobQueueName, redisUrl) and the
 *   TestDatabase.clearTables helper: Redis/BullMQ setup, there is no Redis
 *   and each test gets a fresh database.
 * - "should remove scheduled workflow if workflow no longer exists": unknown
 *   workflows are no longer removed from the scheduler with a warning; it is
 *   replaced by a case that unregisters the workflow.
 * - Cleaner job through the storage's clearExpiredExecutions: storage internals,
 *   replaced by engine.deleteExpired().
 */
import { asFunction } from "@medusajs/framework/awilix"
import {
  Context,
  IWorkflowEngineService,
  LegacyTransaction,
  RemoteQueryFunction,
} from "@medusajs/framework/types"
import {
  Module,
  Modules,
  promiseAll,
  TransactionHandlerType,
  TransactionState,
  TransactionStepStatus,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  isWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { setTimeout as setTimeoutSync } from "timers"
import { setTimeout as setTimeoutPromise } from "timers/promises"
import { ulid } from "ulid"
import { WorkflowsModuleService } from "../../src/services"
import * as fixtures from "../__fixtures__"
import {
  conditionalStep2Invoke,
  conditionalStep3Invoke,
  workflow2Step2Invoke,
  workflow2Step3Invoke,
  workflowNotIdempotentWithRetentionStep2Invoke,
  workflowNotIdempotentWithRetentionStep3Invoke,
} from "../__fixtures__"
import {
  step1CompensateMock as step1CompensateMockAutoRetries,
  step1InvokeMock as step1InvokeMockAutoRetries,
  step2CompensateMock as step2CompensateMockAutoRetries,
  step2InvokeMock as step2InvokeMockAutoRetries,
} from "../__fixtures__/workflow_1_auto_retries"
import {
  step1CompensateMock as step1CompensateMockAutoRetriesFalse,
  step1InvokeMock as step1InvokeMockAutoRetriesFalse,
  step2CompensateMock as step2CompensateMockAutoRetriesFalse,
  step2InvokeMock as step2InvokeMockAutoRetriesFalse,
} from "../__fixtures__/workflow_1_auto_retries_false"
import {
  step1InvokeMock as step1InvokeMockManualRetry,
  step2InvokeMock as step2InvokeMockManualRetry,
} from "../__fixtures__/workflow_1_manual_retry_step"
import {
  eventGroupWorkflowId,
  workflowEventGroupIdStep1Mock,
  workflowEventGroupIdStep2Mock,
} from "../__fixtures__/workflow_event_group_id"
import { createScheduled } from "../__fixtures__/workflow_scheduled"

jest.setTimeout(60000)

const fixtureWorkflows = Object.values(fixtures).filter(isWorkflow)

function times(num) {
  let resolver
  let counter = 0
  const promise = new Promise((resolve) => {
    resolver = resolve
  })

  return {
    next: () => {
      counter += 1
      if (counter === num) {
        resolver()
      }
    },
    // Force resolution after 10 seconds to prevent infinite awaiting
    promise: Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeoutSync(
          () => reject("times has not been resolved after 10 seconds."),
          10000
        )
      }),
    ]),
  }
}

async function waitFor(
  assertion: () => unknown | Promise<unknown>,
  timeoutMs = 10000
) {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    try {
      await assertion()
      return
    } catch (error) {
      if (Date.now() > deadline) {
        throw error
      }
      await setTimeoutPromise(50)
    }
  }
}

moduleIntegrationTestRunner<IWorkflowEngineService>({
  moduleName: Modules.WORKFLOW_ENGINE,
  resolve: __dirname + "/../..",
  moduleOptions: {
    pollIntervalMs: 100,
  },
  testSuite: ({ service: workflowOrcModule, medusaApp }) => {
    describe("Workflow Orchestrator module", function () {
      let query: RemoteQueryFunction

      beforeEach(async () => {
        jest.clearAllMocks()
        query = medusaApp.query

        // v2: workflows are not registered on import
        await workflowOrcModule.registerWorkflows(fixtureWorkflows)
      })

      afterEach(async () => {
        // The runner does not shut the module down when it shares the
        // connection, so stop polling before the database is dropped.
        await (workflowOrcModule as any).engine.shutdown({ graceMs: 0 })
      })

      const onFinish = (workflowId: string, transactionId?: string) =>
        new Promise<any>((resolve) => {
          void workflowOrcModule.subscribe({
            workflowId,
            transactionId,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                resolve(event)
              }
            },
          })
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
              entity: "WorkflowExecution",
              primaryKey: "id",
              serviceName: "workflows",
              field: "workflowExecution",
            },
            transaction_id: {
              linkable: "workflow_execution_transaction_id",
              entity: "WorkflowExecution",
              primaryKey: "transaction_id",
              serviceName: "workflows",
              field: "workflowExecution",
            },
            workflow_id: {
              linkable: "workflow_execution_workflow_id",
              entity: "WorkflowExecution",
              primaryKey: "workflow_id",
              serviceName: "workflows",
              field: "workflowExecution",
            },
            run_id: {
              linkable: "workflow_execution_run_id",
              entity: "WorkflowExecution",
              primaryKey: "run_id",
              serviceName: "workflows",
              field: "workflowExecution",
            },
          },
        })
      })

      it("should register, list and unregister workflows", async () => {
        const registered = await workflowOrcModule.listRegisteredWorkflows()
        expect(registered.map((workflow) => workflow.id)).toEqual(
          expect.arrayContaining(["workflow_1", "workflow_sync"])
        )

        await workflowOrcModule.unregisterWorkflows(["workflow_sync"])

        const afterUnregister =
          await workflowOrcModule.listRegisteredWorkflows()
        expect(afterUnregister.map((workflow) => workflow.id)).not.toContain(
          "workflow_sync"
        )

        await expect(
          workflowOrcModule.run("workflow_sync", { input: {} })
        ).rejects.toThrow('Workflow "workflow_sync" is not registered')

        await expect(
          workflowOrcModule.registerWorkflows([{ name: "not-a-workflow" }])
        ).rejects.toThrow(
          "Only workflows created with createWorkflow can be registered"
        )
      })

      describe("Cancel transaction", function () {
        it("should cancel an ongoing execution with async unfinished yet step", async () => {
          const transactionId = "transaction-to-cancel-id" + ulid()
          const step1 = createStep("step1", async () => {
            return new StepResponse("step1")
          })

          const step2 = createStep("step2", async () => {
            await setTimeoutPromise(200)
            return new StepResponse("step2")
          })

          const step3 = createStep("step3", async () => {
            return new StepResponse("step3")
          })

          const workflowId = "workflow-to-cancel-id" + ulid()

          const workflow = createWorkflow(
            { name: workflowId, retentionTime: 60 },
            function () {
              step1()
              step2().config({ async: true })
              step3()

              return new WorkflowResponse("finished")
            }
          )
          await workflowOrcModule.registerWorkflows([workflow])

          const finished = onFinish(workflowId, transactionId)

          await workflowOrcModule.run(workflowId, {
            input: {},
            transactionId,
          })

          await setTimeoutPromise(100)

          await workflowOrcModule.cancel(workflowId, {
            transactionId,
          })

          await finished

          const execution = await workflowOrcModule.listWorkflowExecutions({
            transaction_id: transactionId,
          })

          expect(execution.length).toEqual(1)
          expect(execution[0].state).toEqual(TransactionState.REVERTED)
        })

        it("should cancel a complete execution with a sync workflow running as async", async () => {
          const workflowId = "workflow-to-cancel-id" + ulid()
          const transactionId = "transaction-to-cancel-id" + ulid()
          const step1 = createStep("step1", async () => {
            return new StepResponse("step1")
          })

          const step2 = createStep("step2", async () => {
            return new StepResponse("step2")
          })

          const step3 = createStep("step3", async () => {
            return new StepResponse("step3")
          })

          const subWorkflowId = "sub-workflow-id" + ulid()
          const subWorkflow = createWorkflow(
            { name: subWorkflowId, retentionTime: 60 },
            function () {
              return new WorkflowResponse(step2())
            }
          )

          const workflow = createWorkflow(
            { name: workflowId, retentionTime: 60 },
            function () {
              step1()
              subWorkflow.runAsStep({ input: {} }).config({ async: true })
              step3()

              return new WorkflowResponse("finished")
            }
          )
          await workflowOrcModule.registerWorkflows([subWorkflow, workflow])

          const finished = onFinish(workflowId, transactionId)

          await workflowOrcModule.run(workflowId, {
            input: {},
            transactionId,
          })

          await finished

          await workflowOrcModule.cancel(workflowId, {
            transactionId,
          })

          const execution = await workflowOrcModule.listWorkflowExecutions({
            transaction_id: transactionId,
          })

          expect(execution.length).toEqual(1)
          expect(execution[0].state).toEqual(TransactionState.REVERTED)
        })

        it("should cancel an ongoing execution with a sync workflow running as async", async () => {
          const workflowId = "workflow-to-cancel-id" + ulid()
          const transactionId = "transaction-to-cancel-id" + ulid()
          const step1 = createStep("step1", async () => {
            return new StepResponse("step1")
          })

          const step2 = createStep("step2", async () => {
            await setTimeoutPromise(500)
            return new StepResponse("step2")
          })

          const step3 = createStep("step3", async () => {
            return new StepResponse("step3")
          })

          const subWorkflowId = "sub-workflow-id" + ulid()
          const subWorkflow = createWorkflow(
            { name: subWorkflowId, retentionTime: 60 },
            function () {
              return new WorkflowResponse(step2())
            }
          )

          const workflow = createWorkflow(
            { name: workflowId, retentionTime: 60 },
            function () {
              step1()
              subWorkflow.runAsStep({ input: {} }).config({ async: true })
              step3()

              return new WorkflowResponse("finished")
            }
          )
          await workflowOrcModule.registerWorkflows([subWorkflow, workflow])

          await workflowOrcModule.run(workflowId, {
            input: {},
            transactionId,
          })

          await setTimeoutPromise(100)

          await workflowOrcModule.cancel(workflowId, {
            transactionId,
          })

          await waitFor(async () => {
            const execution = await workflowOrcModule.listWorkflowExecutions({
              transaction_id: transactionId,
            })

            expect(execution.length).toEqual(1)
            expect(execution[0].state).toEqual(TransactionState.REVERTED)
          })
        })

        it("should cancel an ongoing execution with sync steps only", async () => {
          const transactionId = "transaction-to-cancel-id" + ulid()
          const step1 = createStep("step1", async () => {
            return new StepResponse("step1")
          })

          const step2 = createStep("step2", async () => {
            await setTimeoutPromise(500)
            return new StepResponse("step2")
          })

          const step3 = createStep("step3", async () => {
            return new StepResponse("step3")
          })

          const workflowId = "workflow-to-cancel-id" + ulid()

          const workflow = createWorkflow(
            { name: workflowId, retentionTime: 60 },
            function () {
              step1()
              step2()
              step3()

              return new WorkflowResponse("finished")
            }
          )
          await workflowOrcModule.registerWorkflows([workflow])

          await workflowOrcModule.run(workflowId, {
            input: {},
            transactionId,
          })

          await setTimeoutPromise(100)

          await workflowOrcModule.cancel(workflowId, {
            transactionId,
          })

          await waitFor(async () => {
            const execution = await workflowOrcModule.listWorkflowExecutions({
              transaction_id: transactionId,
            })

            expect(execution.length).toEqual(1)
            expect(execution[0].state).toEqual(TransactionState.REVERTED)
          })
        })
      })

      it("should manually retry a step that is taking too long to finish", async () => {
        const transactionId = "transaction-manual-retry" + ulid()
        const workflowId = "workflow_1_manual_retry_step"

        await workflowOrcModule.run(workflowId, {
          input: {},
          transactionId,
        })

        expect(step1InvokeMockManualRetry).toHaveBeenCalledTimes(1)
        expect(step2InvokeMockManualRetry).toHaveBeenCalledTimes(1)

        const finished = onFinish(workflowId, transactionId)

        await workflowOrcModule.retryStep({
          idempotencyKey: {
            workflowId,
            transactionId,
            stepId: "step_2",
            action: "invoke",
          },
        })

        await finished

        expect(step1InvokeMockManualRetry).toHaveBeenCalledTimes(1)
        expect(step2InvokeMockManualRetry).toHaveBeenCalledTimes(2)
      })

      it("should retry steps X times automatically when maxRetries is set", async () => {
        const transactionId = "transaction-auto-retries" + ulid()
        const workflowId = "workflow_1_auto_retries"

        const finished = onFinish(workflowId, transactionId)

        void workflowOrcModule.run(workflowId, {
          input: {},
          transactionId,
        })

        await finished

        expect(step1InvokeMockAutoRetries).toHaveBeenCalledTimes(1)
        expect(step2InvokeMockAutoRetries).toHaveBeenCalledTimes(3)
        expect(step1CompensateMockAutoRetries).toHaveBeenCalledTimes(1)
        expect(step2CompensateMockAutoRetries).toHaveBeenCalledTimes(1)
      })

      it("should retry an async step that runs a failing workflow", async () => {
        const childStepMock = jest.fn().mockImplementation(() => {
          throw new Error("child failed")
        })
        const childStep = createStep("retried-child-step-" + ulid(), () =>
          childStepMock()
        )
        const childId = "retried-child-" + ulid()
        const child = createWorkflow(
          { name: childId, store: true, retentionTime: 60 },
          function () {
            childStep()
            return new WorkflowResponse(void 0)
          }
        )

        const parentId = "retried-parent-" + ulid()
        const parent = createWorkflow(
          { name: parentId, store: true, retentionTime: 60 },
          function () {
            child.runAsStep({ input: {} }).config({
              async: true,
              backgroundExecution: true,
              maxRetries: 2,
            })
            return new WorkflowResponse(void 0)
          }
        )
        await workflowOrcModule.registerWorkflows([child, parent])

        const transactionId = "retried-trx-" + ulid()
        const finished = onFinish(parentId, transactionId)
        await workflowOrcModule.run(parentId, {
          transactionId,
          throwOnError: false,
        })
        await finished

        expect(childStepMock).toHaveBeenCalledTimes(3)
      })

      it("should not return a finished transaction as running", async () => {
        const step = createStep("finished-step-" + ulid(), () => {
          return new StepResponse("done")
        })
        const workflowId = "finished-" + ulid()
        const workflow = createWorkflow(
          { name: workflowId, store: true, retentionTime: 60 },
          function () {
            step()
            return new WorkflowResponse(void 0)
          }
        )
        await workflowOrcModule.registerWorkflows([workflow])

        const transactionId = "finished-trx-" + ulid()
        await workflowOrcModule.run(workflowId, { transactionId })

        await expect(
          workflowOrcModule.getRunningTransaction(workflowId, transactionId)
        ).rejects.toThrow(`Transaction ${transactionId} could not be found.`)
      })

      it("should not retry steps X times automatically when maxRetries is set and autoRetry is false", async () => {
        const transactionId = "transaction-auto-retries" + ulid()
        const workflowId = "workflow_1_auto_retries_false"

        const waitForFailedAttempt = (attempts: number) =>
          waitFor(async () => {
            const transaction = (await workflowOrcModule.getRunningTransaction(
              workflowId,
              transactionId
            )) as LegacyTransaction
            const step = transaction.getFlow().steps["_root.step_2"]
            expect(step.attempts).toEqual(attempts)
            expect(step.invoke.status).toEqual(
              TransactionStepStatus.TEMPORARY_FAILURE
            )
          })

        const finished = onFinish(workflowId, transactionId)

        await workflowOrcModule.run(workflowId, {
          input: {},
          transactionId,
          throwOnError: false,
        })

        await waitForFailedAttempt(1)

        expect(step1InvokeMockAutoRetriesFalse).toHaveBeenCalledTimes(1)
        expect(step2InvokeMockAutoRetriesFalse).toHaveBeenCalledTimes(1)
        expect(step1CompensateMockAutoRetriesFalse).toHaveBeenCalledTimes(0)
        expect(step2CompensateMockAutoRetriesFalse).toHaveBeenCalledTimes(0)

        // v2: running the same transaction id again while it is in progress
        // rejects instead of retrying the step; retries go through retryStep
        await expect(
          workflowOrcModule.run(workflowId, {
            input: {},
            transactionId,
            throwOnError: false,
          })
        ).rejects.toThrow(
          "Transaction already started for transactionId: " + transactionId
        )

        const retryStep = () =>
          workflowOrcModule.retryStep({
            idempotencyKey: {
              workflowId,
              transactionId,
              stepId: "step_2",
              action: "invoke",
            },
            options: { throwOnError: false },
          })

        await retryStep()
        await waitForFailedAttempt(2)

        expect(step1InvokeMockAutoRetriesFalse).toHaveBeenCalledTimes(1)
        expect(step2InvokeMockAutoRetriesFalse).toHaveBeenCalledTimes(2)
        expect(step1CompensateMockAutoRetriesFalse).toHaveBeenCalledTimes(0)
        expect(step2CompensateMockAutoRetriesFalse).toHaveBeenCalledTimes(0)

        await retryStep()
        await finished

        expect(step1InvokeMockAutoRetriesFalse).toHaveBeenCalledTimes(1)
        expect(step2InvokeMockAutoRetriesFalse).toHaveBeenCalledTimes(3)
        expect(step1CompensateMockAutoRetriesFalse).toHaveBeenCalledTimes(1)
        expect(step2CompensateMockAutoRetriesFalse).toHaveBeenCalledTimes(1)
      })

      it("should prevent executing twice the same workflow in perfect concurrency with the same transactionId and non idempotent and not async but retention time is set", async () => {
        const transactionId = "transaction_id" + ulid()
        const workflowId = "workflow_id" + ulid()

        const step1 = createStep("step1", async () => {
          await setTimeoutPromise(100)
          return new StepResponse("step1")
        })

        const workflow = createWorkflow(
          {
            name: workflowId,
            retentionTime: 1000,
          },
          function () {
            return new WorkflowResponse(step1())
          }
        )
        await workflowOrcModule.registerWorkflows([workflow])

        const [result1, result2] = await promiseAll([
          workflowOrcModule
            .run(workflowId, {
              input: {},
              transactionId,
            })
            .catch((e) => e),
          workflowOrcModule
            .run(workflowId, {
              input: {},
              transactionId,
            })
            .catch((e) => e),
        ])

        expect(result1.result || result2.result).toEqual("step1")
        expect(result2.message || result1.message).toEqual(
          "Transaction already started for transactionId: " + transactionId
        )
      })

      it("should execute an async workflow keeping track of the event group id provided in the context", async () => {
        const eventGroupId = "event-group-id"
        const transactionId = "transaction_id" + ulid()

        await workflowOrcModule.run(eventGroupWorkflowId, {
          input: {},
          transactionId,
          context: {
            eventGroupId,
          },
          throwOnError: true,
        })

        await workflowOrcModule.setStepSuccess({
          idempotencyKey: {
            action: TransactionHandlerType.INVOKE,
            stepId: "step_1_event_group_id_background",
            workflowId: eventGroupWorkflowId,
            transactionId,
          },
          stepResponse: { hey: "oh" },
        })

        await waitFor(() =>
          expect(workflowEventGroupIdStep2Mock).toHaveBeenCalledTimes(1)
        )

        // Validate context event group id
        expect(
          (workflowEventGroupIdStep1Mock.mock.calls[0] as any[])[1]
        ).toEqual(expect.objectContaining({ eventGroupId }))
        expect(
          (workflowEventGroupIdStep2Mock.mock.calls[0] as any[])[1]
        ).toEqual(expect.objectContaining({ eventGroupId }))
      })

      it("should execute an async workflow keeping track of the event group id that has been auto generated", async () => {
        const transactionId = "transaction_id_2" + ulid()
        await workflowOrcModule.run(eventGroupWorkflowId, {
          input: {},
          transactionId,
          throwOnError: true,
        })

        await workflowOrcModule.setStepSuccess({
          idempotencyKey: {
            action: TransactionHandlerType.INVOKE,
            stepId: "step_1_event_group_id_background",
            workflowId: eventGroupWorkflowId,
            transactionId,
          },
          stepResponse: { hey: "oh" },
        })

        await waitFor(() =>
          expect(workflowEventGroupIdStep2Mock).toHaveBeenCalledTimes(1)
        )

        const generatedEventGroupId = ((
          workflowEventGroupIdStep1Mock.mock.calls[0] as any[]
        )[1] as unknown as Context)!.eventGroupId

        expect(generatedEventGroupId).toEqual(expect.any(String))

        // Validate context event group id
        expect(
          (workflowEventGroupIdStep1Mock.mock.calls[0] as any[])[1]
        ).toEqual(
          expect.objectContaining({ eventGroupId: generatedEventGroupId })
        )
        expect(
          (workflowEventGroupIdStep2Mock.mock.calls[0] as any[])[1]
        ).toEqual(
          expect.objectContaining({ eventGroupId: generatedEventGroupId })
        )
      })

      it("should give a workflow run from a step its own event group", async () => {
        const childContexts: Context[] = []
        const childStep = createStep("child-group-step-" + ulid(), (_, ctx) => {
          childContexts.push(ctx.context!)
          return new StepResponse()
        })
        const childId = "child-group-" + ulid()
        const child = createWorkflow(childId, function () {
          childStep()
          return new WorkflowResponse(void 0)
        })

        const parentContexts: Context[] = []
        const parentStep = createStep(
          "parent-group-step-" + ulid(),
          async (_, { container, context }) => {
            parentContexts.push(context!)
            await container
              .resolve<IWorkflowEngineService>(Modules.WORKFLOW_ENGINE)
              .run(childId, {})
            return new StepResponse()
          }
        )
        const parentId = "parent-group-" + ulid()
        const parent = createWorkflow(
          { name: parentId, store: true, retentionTime: 60 },
          function () {
            parentStep()
            return new WorkflowResponse(void 0)
          }
        )
        await workflowOrcModule.registerWorkflows([child, parent])

        await workflowOrcModule.run(parentId, { throwOnError: true })

        expect(childContexts[0].eventGroupId).toEqual(expect.any(String))
        expect(childContexts[0].eventGroupId).not.toEqual(
          parentContexts[0].eventGroupId
        )
        expect(childContexts[0].preventReleaseEvents).toBe(false)
      })

      it("should compose nested workflows w/ async steps", async () => {
        const asyncResults: any[] = []
        const mockStep1Fn = jest.fn().mockImplementation(() => {
          const res = { obj: "return from 1" }
          asyncResults.push(res)
          return new StepResponse(res)
        })
        const mockStep2Fn = jest.fn().mockImplementation(async () => {
          await setTimeoutPromise(100)
          const res = { obj: "return from 2" }
          asyncResults.push(res)
          return new StepResponse(res)
        })

        const mockStep3Fn = jest.fn().mockImplementation(() => {
          const res = { obj: "return from 3" }
          asyncResults.push(res)
          return new StepResponse(res)
        })

        const step1 = createStep("step1", mockStep1Fn)
        const step2 = createStep(
          {
            name: "step2",
            async: true,
            backgroundExecution: true,
          },
          mockStep2Fn
        )
        const step3 = createStep("step3", mockStep3Fn)

        const wf3 = createWorkflow("workflow3", function (input) {
          return new WorkflowResponse(step2(input))
        })

        const wf2 = createWorkflow("workflow2", function (input) {
          const ret3 = wf3.runAsStep({
            input: {},
          })
          return new WorkflowResponse(ret3)
        })

        const workflowId = "workflow1"
        const wf1 = createWorkflow(workflowId, function (input) {
          step1(input)
          wf2.runAsStep({ input })
          const fourth = step3({})
          return new WorkflowResponse(fourth)
        })
        await workflowOrcModule.registerWorkflows([wf3, wf2, wf1])

        asyncResults.push("begin workflow")
        await workflowOrcModule.run(workflowId, {
          input: {},
        })

        const finished = onFinish(workflowId)

        asyncResults.push("returned workflow")

        await finished

        expect(asyncResults).toEqual([
          "begin workflow",
          { obj: "return from 1" },
          "returned workflow",
          { obj: "return from 2" },
          { obj: "return from 3" },
        ])
      })

      describe("Testing basic workflow", function () {
        it("should return a list of workflow executions and remove after completed when there is no retentionTime set", async () => {
          await workflowOrcModule.run("workflow_1", {
            input: {
              value: "123",
            },
            throwOnError: true,
          })

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["workflow_id", "transaction_id", "state"],
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

          ;({ data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          }))

          expect(executionsList).toHaveLength(0)
          expect(result).toEqual({
            done: {
              inputFromSyncStep: "oh",
            },
          })
        })

        it("should return a list of workflow executions and keep it saved when there is a retentionTime set", async () => {
          const transactionId = "transaction_1" + ulid()
          await workflowOrcModule.run("workflow_2", {
            input: {
              value: "123",
            },
            throwOnError: true,
            transactionId,
          })

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          })

          expect(executionsList).toHaveLength(1)

          await workflowOrcModule.setStepSuccess({
            idempotencyKey: {
              action: TransactionHandlerType.INVOKE,
              stepId: "new_step_name",
              workflowId: "workflow_2",
              transactionId,
            },
            stepResponse: { uhuuuu: "yeaah!" },
          })

          expect(workflow2Step2Invoke).toHaveBeenCalledTimes(2)
          expect(workflow2Step2Invoke.mock.calls[0][0]).toEqual({ hey: "oh" })
          expect(workflow2Step2Invoke.mock.calls[1][0]).toEqual({})

          expect(workflow2Step3Invoke).toHaveBeenCalledTimes(1)
          expect(workflow2Step3Invoke.mock.calls[0][0]).toEqual({
            uhuuuu: "yeaah!",
          })
          ;({ data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          }))

          expect(executionsList).toHaveLength(1)
        })

        it("should return a list of failed workflow executions and keep it saved when there is a retentionTime set", async () => {
          const transactionId = "transaction_1" + ulid()
          await workflowOrcModule.run("workflow_2", {
            input: {
              value: "123",
            },
            transactionId,
          })

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          })

          expect(executionsList).toHaveLength(1)

          await workflowOrcModule.setStepFailure({
            idempotencyKey: {
              action: TransactionHandlerType.INVOKE,
              stepId: "new_step_name",
              workflowId: "workflow_2",
              transactionId,
            },
            stepResponse: { uhuuuu: "yeaah!" },
            options: {
              throwOnError: false,
            },
          })
          ;({ data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id", "state"],
          }))

          expect(executionsList).toHaveLength(1)
          expect(executionsList[0].state).toEqual("reverted")
        })

        it("should throw from setStepFailure when the run reverts unless throwOnError is false", async () => {
          const transactionId = "transaction_1" + ulid()
          await workflowOrcModule.run("workflow_2", {
            input: {
              value: "123",
            },
            transactionId,
          })

          const setStepError = await workflowOrcModule
            .setStepFailure({
              idempotencyKey: {
                action: TransactionHandlerType.INVOKE,
                stepId: "new_step_name",
                workflowId: "workflow_2",
                transactionId,
              },
              stepResponse: new Error("Step failed from outside"),
            })
            .catch((e) => e)

          expect(setStepError).toEqual(
            expect.objectContaining({
              message: "Step failed from outside",
            })
          )

          const executions = await workflowOrcModule.listWorkflowExecutions({
            transaction_id: transactionId,
          })

          expect(executions).toHaveLength(1)
          expect(executions[0].state).toEqual(TransactionState.REVERTED)
        })

        it("should throw if setStepFailure fails", async () => {
          const { acknowledgement } = await workflowOrcModule.run(
            "workflow_2_revert_fail",
            {
              input: {
                value: "123",
              },
            }
          )

          let done = false
          void workflowOrcModule.subscribe({
            workflowId: "workflow_2_revert_fail",
            transactionId: acknowledgement.transactionId,
            subscriber: (event) => {
              if (event.eventType === "onFinish") {
                done = true
              }
            },
          })

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          })

          expect(executionsList).toHaveLength(1)

          const setStepError = await workflowOrcModule
            .setStepFailure({
              idempotencyKey: {
                action: TransactionHandlerType.INVOKE,
                stepId: "broken_step_2",
                workflowId: "workflow_2_revert_fail",
                transactionId: acknowledgement.transactionId,
              },
              stepResponse: { uhuuuu: "yeaah!" },
            })
            .catch((e) => {
              return e
            })

          // v2: a non-error step response becomes an Error("Step failed")
          // carrying the response, instead of the stringified response
          expect(setStepError).toEqual(
            expect.objectContaining({
              message: "Step failed",
              response: { uhuuuu: "yeaah!" },
              stack: expect.any(String),
            })
          )
          ;({ data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id", "state", "context"],
          }))

          expect(executionsList).toHaveLength(1)
          expect(executionsList[0].state).toEqual("failed")
          await waitFor(() => expect(done).toBe(true))
        })

        it("should return a list of workflow executions and keep it saved when there is a retentionTime set but allow for executing the same workflow multiple times with different run_id if the workflow is considered done", async () => {
          const transactionId = "transaction_1" + ulid()
          await workflowOrcModule.run(
            "workflow_not_idempotent_with_retention",
            {
              input: {
                value: "123",
              },
              transactionId,
            }
          )

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id", "run_id", "transaction_id"],
          })

          expect(executionsList).toHaveLength(1)

          expect(
            workflowNotIdempotentWithRetentionStep2Invoke
          ).toHaveBeenCalledTimes(2)
          expect(
            workflowNotIdempotentWithRetentionStep2Invoke.mock.calls[0][0]
          ).toEqual({ hey: "oh" })
          expect(
            workflowNotIdempotentWithRetentionStep2Invoke.mock.calls[1][0]
          ).toEqual({
            hey: "hello",
          })
          expect(
            workflowNotIdempotentWithRetentionStep3Invoke
          ).toHaveBeenCalledTimes(1)
          expect(
            workflowNotIdempotentWithRetentionStep3Invoke.mock.calls[0][0]
          ).toEqual({
            notAsyncResponse: "hello",
          })

          await workflowOrcModule.run(
            "workflow_not_idempotent_with_retention",
            {
              input: {
                value: "123",
              },
              transactionId,
            }
          )

          // v2: execution filters take plain values, so the previous run is
          // excluded here instead of with an `id: { $nin }` filter
          const { data: allExecutions } = await query.graph({
            entity: "workflow_executions",
            fields: ["id", "run_id", "transaction_id"],
          })
          const executionsList2 = allExecutions.filter(
            (execution) => !executionsList.some((e) => e.id === execution.id)
          )

          expect(allExecutions).toHaveLength(2)
          expect(executionsList2).toHaveLength(1)
          expect(executionsList2[0].run_id).not.toEqual(
            executionsList[0].run_id
          )
          expect(executionsList2[0].transaction_id).toEqual(
            executionsList[0].transaction_id
          )
        })

        it("should revert the entire transaction when a step timeout expires", async () => {
          const { transaction, errors } = (await workflowOrcModule.run(
            "workflow_step_timeout",
            {
              input: {
                myInput: "123",
              },
              throwOnError: false,
              logOnError: true,
            }
          )) as Awaited<{
            transaction: LegacyTransaction
            result: any
            errors: any
          }>

          expect(transaction.getFlow().state).toEqual("reverted")
          expect(errors).toHaveLength(1)
          expect(errors[0].action).toEqual("step_1")
          // v2: StepTimeoutError replaces TransactionStepTimeoutError
          expect(errors[0].error.name).toEqual("StepTimeoutError")
        })

        it("should revert the entire transaction when the transaction timeout expires", async () => {
          const { transaction, errors } = (await workflowOrcModule.run(
            "workflow_transaction_timeout",
            {
              input: {},
              transactionId: "trx" + ulid(),
              throwOnError: false,
            }
          )) as Awaited<{
            transaction: LegacyTransaction
            result: any
            errors: any
          }>

          expect(transaction.getFlow().state).toEqual("reverted")
          expect(errors).toHaveLength(1)
          expect(errors[0].action).toEqual("step_1")
          // v2: RunTimeoutError replaces TransactionTimeoutError
          expect(errors[0].error.name).toEqual("RunTimeoutError")
        })

        it("should revert the entire transaction when a step timeout expires in a async step", async () => {
          const transactionId = "transaction_1" + ulid()
          const finished = onFinish(
            "workflow_step_timeout_async",
            transactionId
          )

          await workflowOrcModule.run("workflow_step_timeout_async", {
            input: {
              myInput: "123",
            },
            transactionId,
            throwOnError: false,
          })

          await finished

          const { transaction, result, errors } = (await workflowOrcModule.run(
            "workflow_step_timeout_async",
            {
              input: {
                myInput: "123",
              },
              transactionId,
              throwOnError: false,
            }
          )) as Awaited<{
            transaction: LegacyTransaction
            result: any
            errors: any
          }>

          expect(transaction.getFlow().state).toEqual("reverted")
          expect(result).toEqual(undefined)
          expect(errors).toHaveLength(1)
          expect(errors[0].action).toEqual("step_1_async")
          expect(errors[0].error.name).toEqual("StepTimeoutError")
        })

        it("should revert the entire transaction when the transaction timeout expires in a transaction containing an async step", async () => {
          const transactionId = "transaction_1" + ulid()
          const finished = onFinish(
            "workflow_transaction_timeout_async",
            transactionId
          )

          await workflowOrcModule.run("workflow_transaction_timeout_async", {
            input: {},
            transactionId,
            throwOnError: false,
          })

          await finished

          const { transaction, result, errors } = (await workflowOrcModule.run(
            "workflow_transaction_timeout_async",
            {
              input: {},
              transactionId,
              throwOnError: false,
            }
          )) as Awaited<{
            transaction: LegacyTransaction
            result: any
            errors: any
          }>

          expect(transaction.getFlow().state).toEqual("reverted")
          expect(result).toEqual(undefined)
          expect(errors).toHaveLength(1)
          expect(errors[0].action).toEqual("step_1_async")
          expect(errors[0].error.name).toEqual("RunTimeoutError")
        })

        it("should complete an async workflow that returns a StepResponse", async () => {
          const transactionId = "transaction_1" + ulid()

          const finished = onFinish("workflow_async_background", transactionId)

          const { transaction, result } = await workflowOrcModule.run(
            "workflow_async_background",
            {
              input: {
                myInput: "123",
              },
              transactionId,
              throwOnError: true,
            }
          )

          // v2: the state is read with getFlow(), there is no `flow` property
          expect(transaction.getFlow().state).toEqual(TransactionState.INVOKING)
          expect(result).toEqual(undefined)

          await finished
        })

        it("should subscribe to a async workflow and receive the response when it finishes", async () => {
          const transactionId = "trx_123" + ulid()

          const finished = onFinish("workflow_async_background", transactionId)

          void workflowOrcModule.run("workflow_async_background", {
            input: {
              myInput: "123",
            },
            transactionId,
            throwOnError: false,
          })

          await finished
        })

        it("should not skip step if condition is true", async () => {
          const transactionId = "trx_123_when" + ulid()

          const finished = onFinish("wf-when", transactionId)

          void workflowOrcModule.run("wf-when", {
            input: {
              callSubFlow: true,
            },
            transactionId,
            throwOnError: true,
            logOnError: true,
          })

          const event = await finished

          expect(event.result).toEqual({
            result: { result: "hi from outside" },
          })
        })

        it("should cancel an async sub workflow when compensating", async () => {
          const workflowId = "workflow_async_background_fail"
          const transactionId = "trx_123_compensate_async_sub_workflow" + ulid()

          let onCompensateStepSuccess: any = null

          const finished = new Promise<void>((resolve) => {
            void workflowOrcModule.subscribe({
              workflowId,
              transactionId,
              subscriber: (event) => {
                if (event.eventType === "onCompensateStepSuccess") {
                  onCompensateStepSuccess = event
                }
                if (event.eventType === "onFinish") {
                  resolve()
                }
              },
            })
          })

          void workflowOrcModule.run(workflowId, {
            input: {
              callSubFlow: true,
            },
            transactionId,
            throwOnError: false,
            logOnError: false,
          })

          await finished

          expect(onCompensateStepSuccess).toBeDefined()
          expect(onCompensateStepSuccess!.step.id).toEqual(
            "_root.nested_sub_flow_async_fail-as-step" // The workflow as step
          )
          expect(onCompensateStepSuccess!.step.compensate).toEqual({
            state: "reverted",
            status: "ok",
          })
        })

        it("should cancel and revert a completed workflow", async () => {
          const workflowId = "workflow_sync"

          const { acknowledgement, transaction: trx } =
            await workflowOrcModule.run(workflowId, {
              input: {
                value: "123",
              },
            })

          expect(trx.getFlow().state).toEqual("done")
          expect(acknowledgement.hasFinished).toBe(true)

          const { transaction } = await workflowOrcModule.cancel(workflowId, {
            transactionId: acknowledgement.transactionId,
          })

          expect(transaction.getFlow().state).toEqual("reverted")
        })

        it("should cancel and revert a non idempotent completed workflow with rentention time given a specific transaction id", async () => {
          const workflowId = "workflow_not_idempotent_with_retention"
          const transactionId = "trx_123" + ulid()

          await workflowOrcModule.run(workflowId, {
            input: {
              value: "123",
            },
            transactionId,
          })

          let executions = await workflowOrcModule.listWorkflowExecutions({
            transaction_id: transactionId,
          })

          expect(executions.length).toEqual(1)
          expect(executions[0].state).toEqual(TransactionState.DONE)
          expect(executions[0].transaction_id).toEqual(transactionId)

          await workflowOrcModule.cancel(workflowId, {
            transactionId,
          })

          executions = await workflowOrcModule.listWorkflowExecutions({
            transaction_id: transactionId,
          })

          expect(executions.length).toEqual(1)
          expect(executions[0].state).toEqual(TransactionState.REVERTED)
        })

        it("should run conditional steps if condition is true", async () => {
          const finished = onFinish("workflow_conditional_step")

          void workflowOrcModule.run("workflow_conditional_step", {
            input: {
              runNewStepName: true,
            },
            throwOnError: true,
          })

          await finished

          expect(conditionalStep2Invoke).toHaveBeenCalledTimes(2)
          expect(conditionalStep3Invoke).toHaveBeenCalledTimes(1)
        })

        it("should not run conditional steps if condition is false", async () => {
          const eventTypes: string[] = []
          const finished = new Promise<void>((resolve) => {
            void workflowOrcModule.subscribe({
              workflowId: "workflow_conditional_step",
              subscriber: (event) => {
                eventTypes.push(event.eventType)
                if (event.eventType === "onFinish") {
                  resolve()
                }
              },
            })
          })

          void workflowOrcModule.run("workflow_conditional_step", {
            input: {
              runNewStepName: false,
            },
            throwOnError: true,
          })

          await finished

          expect(conditionalStep2Invoke).toHaveBeenCalledTimes(1)
          expect(conditionalStep3Invoke).toHaveBeenCalledTimes(0)
          // v2: skipped steps are reported to subscribers
          expect(eventTypes).toContain("onStepSkipped")
        })
      })

      describe("Testing complex workflows", function () {
        it("should execute workflow + workflow as step + manual workflow within a step correctly", async () => {
          const workflowA_id = "workflow_a"
          const workflowB_id = "workflow_b"
          const workflowC_id = "workflow_c"

          const stepB_1 = createStep("stepB_1", async (input, context) => {
            let results: any[] = []
            for (let i = 0; i < 2; i++) {
              const { result } = await workflowOrcModule.run(workflowC_id, {
                input: {},
              })

              results.push(result)
            }

            return new StepResponse(results)
          })

          const stepC_1 = createStep("stepC_1", async (input, context) => {
            return new StepResponse({
              stepC_1_result: "stepC_1_result",
            })
          })

          const workflowC = createWorkflow(workflowC_id, (input) => {
            const result = stepC_1()
            return new WorkflowResponse(result)
          })

          const workflowB = createWorkflow(workflowB_id, (input) => {
            const result = stepB_1()
            return new WorkflowResponse(result)
          })

          const workflowA = createWorkflow(workflowA_id, (input) => {
            const workflowB_response = workflowB.runAsStep({
              input: {},
            })

            return new WorkflowResponse({ workflowB_response })
          })
          await workflowOrcModule.registerWorkflows([
            workflowC,
            workflowB,
            workflowA,
          ])

          const { result } = await workflowOrcModule.run(workflowA_id, {
            input: {},
            throwOnError: false,
          })

          expect(result).toEqual({
            workflowB_response: [
              {
                stepC_1_result: "stepC_1_result",
              },
              {
                stepC_1_result: "stepC_1_result",
              },
            ],
          })
        })

        it("should execute workflow + workflow as step + manual workflow within a step that fail but do not fail the step", async () => {
          const workflowA_id = "workflow_a"
          const workflowB_id = "workflow_b"
          const workflowC_id = "workflow_c"

          const stepB_1 = createStep("stepB_1", async (input, context) => {
            let results: any[] = []
            for (let i = 0; i < 2; i++) {
              const { errors } = await workflowOrcModule.run(workflowC_id, {
                input: {},
                throwOnError: false,
              })

              results.push(errors)
            }

            return new StepResponse(results)
          })

          const stepC_1 = createStep("stepC_1", async (input, context) => {
            throw new Error("Workflow C failed")
          })

          const workflowC = createWorkflow(workflowC_id, (input) => {
            const result = stepC_1()
            return new WorkflowResponse(result)
          })

          const workflowB = createWorkflow(workflowB_id, (input) => {
            const result = stepB_1()
            return new WorkflowResponse(result)
          })

          const workflowA = createWorkflow(workflowA_id, (input) => {
            const workflowB_response = workflowB.runAsStep({
              input: {},
            })

            return new WorkflowResponse({ workflowB_response })
          })
          await workflowOrcModule.registerWorkflows([
            workflowC,
            workflowB,
            workflowA,
          ])

          const { result, transaction } = await workflowOrcModule.run(
            workflowA_id,
            {
              input: {},
              throwOnError: false,
            }
          )

          expect((transaction as LegacyTransaction).getFlow().state).toEqual(
            TransactionState.DONE
          )
          expect(result).toEqual({
            workflowB_response: [
              [
                {
                  action: "stepC_1",
                  handlerType: TransactionHandlerType.INVOKE,
                  error: expect.objectContaining({
                    message: "Workflow C failed",
                  }),
                },
              ],
              [
                {
                  action: "stepC_1",
                  handlerType: TransactionHandlerType.INVOKE,
                  error: expect.objectContaining({
                    message: "Workflow C failed",
                  }),
                },
              ],
            ],
          })
        })
      })

      describe("Scheduled workflows", () => {
        beforeEach(() => {
          // Register test-value in the container for all tests
          const sharedContainer = (workflowOrcModule as any).container_

          sharedContainer.register(
            "test-value",
            asFunction(() => "test")
          )
        })

        it("should execute a scheduled workflow", async () => {
          const wait = times(2)
          const { workflow, spy } = createScheduled("standard", wait.next)
          await workflowOrcModule.registerWorkflows([workflow])

          await wait.promise
          expect(spy).toHaveBeenCalledTimes(2)

          // v2: scheduled runs get a deterministic transaction id and the fire
          // time as input
          const [input, context] = spy.mock.calls[0] as any[]
          expect(input).toEqual({ scheduledFor: expect.any(String) })
          expect(context.transactionId).toEqual(
            `schedule:standard:${input.scheduledFor}`
          )
        })

        it("should stop executions after the set number of executions", async () => {
          const wait = times(2)
          const { workflow, spy } = createScheduled(
            "num-executions",
            wait.next,
            {
              interval: 1000,
              numberOfExecutions: 2,
            }
          )
          await workflowOrcModule.registerWorkflows([workflow])

          await wait.promise
          expect(spy).toHaveBeenCalledTimes(2)

          // Make sure that on the next tick it doesn't execute again
          await setTimeoutPromise(1500)
          expect(spy).toHaveBeenCalledTimes(2)
        })

        it("should stop executing a scheduled workflow once it is unregistered", async () => {
          const wait = times(1)

          const { workflow, spy } = createScheduled(
            "remove-scheduled",
            wait.next,
            {
              interval: 1000,
            }
          )
          await workflowOrcModule.registerWorkflows([workflow])

          await wait.promise
          expect(spy).toHaveBeenCalledTimes(1)

          // v2: replaces removing a schedule whose workflow no longer exists
          await workflowOrcModule.unregisterWorkflows(["remove-scheduled"])

          await setTimeoutPromise(1500)
          expect(spy).toHaveBeenCalledTimes(1)
        })

        it("should skip a fire while the previous scheduled run has not finished", async () => {
          const invoke = jest.fn()
          const waitingStep = createStep(
            { name: "waiting_step", async: true },
            async () => {
              invoke()
            }
          )
          const workflow = createWorkflow(
            { name: "forbid-concurrency", schedule: { interval: 300 } },
            function () {
              waitingStep()
            }
          )
          await workflowOrcModule.registerWorkflows([workflow])

          await waitFor(() => expect(invoke).toHaveBeenCalledTimes(1))

          // v2: concurrency "forbid" is the default and is enforced
          await setTimeoutPromise(1200)
          expect(invoke).toHaveBeenCalledTimes(1)
        })

        it("the scheduled workflow should have access to the shared container", async () => {
          const wait = times(1)

          const { workflow, spy } = createScheduled(
            "shared-container-job",
            wait.next,
            {
              interval: 1000,
            }
          )
          await workflowOrcModule.registerWorkflows([workflow])
          await wait.promise

          expect(spy).toHaveBeenCalledTimes(1)

          expect(spy).toHaveReturnedWith(
            expect.objectContaining({ output: { testValue: "test" } })
          )
        })

        it("should fetch an idempotent workflow after its completion", async () => {
          const transactionId = "transaction_1" + ulid()
          const { transaction: firstRun } = (await workflowOrcModule.run(
            "workflow_idempotent",
            {
              input: {
                value: "123",
              },
              throwOnError: true,
              transactionId,
            }
          )) as Awaited<{ transaction: LegacyTransaction }>

          let { data: executionsList } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          })

          const { transaction: secondRun } = (await workflowOrcModule.run(
            "workflow_idempotent",
            {
              input: {
                value: "123",
              },
              throwOnError: true,
              transactionId,
            }
          )) as Awaited<{ transaction: LegacyTransaction }>

          const { data: executionsListAfter } = await query.graph({
            entity: "workflow_executions",
            fields: ["id"],
          })

          expect(secondRun.getFlow().startedAt).toEqual(
            firstRun.getFlow().startedAt
          )
          expect(executionsList).toHaveLength(1)
          expect(executionsListAfter).toHaveLength(1)
        })

        it("should display error when multiple async steps are running in parallel", async () => {
          const finished = onFinish("workflow_parallel_async")

          void workflowOrcModule.run("workflow_parallel_async", {
            input: {},
            throwOnError: false,
          })

          const { errors } = await finished

          const errMessage = errors[0]?.error.message
          expect(errMessage).toContain("Error in parallel step")
          expect(errors).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                action: "step_2",
                handlerType: "invoke",
              }),
            ])
          )
        })
      })

      describe("Cleaner job", function () {
        it("should remove expired executions of finished workflows and keep the others", async () => {
          const doneWorkflowId = "done-workflow-" + ulid()
          const doneWorkflow = createWorkflow(
            { name: doneWorkflowId, retentionTime: 1 },
            () => {
              return new WorkflowResponse("done")
            }
          )

          const failingWorkflowId = "failing-workflow-" + ulid()
          const failingStep = createStep("failing-step", () => {
            throw new Error("I am failing")
          })
          const failingWorkflow = createWorkflow(
            { name: failingWorkflowId, retentionTime: 1 },
            () => {
              failingStep()
            }
          )

          const revertingStep = createStep(
            "reverting-step",
            () => {
              throw new Error("I am reverting")
            },
            () => {
              return new StepResponse("reverted")
            }
          )

          const revertingWorkflowId = "reverting-workflow-" + ulid()
          const revertingWorkflow = createWorkflow(
            { name: revertingWorkflowId, retentionTime: 1 },
            () => {
              revertingStep()
              return new WorkflowResponse("reverted")
            }
          )

          const runningWorkflowId = "running-workflow-" + ulid()
          const longRunningStep = createStep("long-running-step", async () => {
            await setTimeoutPromise(10000)
            return new StepResponse("long running finished")
          })
          const runningWorkflow = createWorkflow(
            { name: runningWorkflowId, retentionTime: 1 },
            () => {
              longRunningStep().config({
                async: true,
                backgroundExecution: true,
              })
              return new WorkflowResponse("running workflow started")
            }
          )

          const notExpiredWorkflowId = "not-expired-workflow-" + ulid()
          const notExpiredWorkflow = createWorkflow(
            { name: notExpiredWorkflowId, retentionTime: 1000 },
            () => {
              return new WorkflowResponse("not expired")
            }
          )

          await workflowOrcModule.registerWorkflows([
            doneWorkflow,
            failingWorkflow,
            revertingWorkflow,
            runningWorkflow,
            notExpiredWorkflow,
          ])

          const trx_done = "trx-done-" + ulid()
          const trx_failed = "trx-failed-" + ulid()
          const trx_reverting = "trx-reverting-" + ulid()
          const trx_running = "trx-running-" + ulid()
          const trx_not_expired = "trx-not-expired-" + ulid()

          // run workflows
          await workflowOrcModule.run(doneWorkflowId, {
            transactionId: trx_done,
          })

          await workflowOrcModule.run(failingWorkflowId, {
            transactionId: trx_failed,
            throwOnError: false,
          })

          await workflowOrcModule.run(revertingWorkflowId, {
            transactionId: trx_reverting,
            throwOnError: false,
          })

          await workflowOrcModule.run(runningWorkflowId, {
            transactionId: trx_running,
          })

          await workflowOrcModule.run(notExpiredWorkflowId, {
            transactionId: trx_not_expired,
          })

          const executions = await workflowOrcModule.listWorkflowExecutions()
          expect(executions).toHaveLength(5)

          await setTimeoutPromise(2000)

          // v2: expired runs are deleted by the engine's retention task
          await (workflowOrcModule as any).engine.deleteExpired()

          let remainingExecutions =
            await workflowOrcModule.listWorkflowExecutions()

          expect(remainingExecutions).toHaveLength(2)

          const remainingTrxIds = remainingExecutions
            .map((e) => e.transaction_id)
            .sort()

          expect(remainingTrxIds).toEqual([trx_not_expired, trx_running].sort())

          const notExpiredExec = remainingExecutions.find(
            (e) => e.transaction_id === trx_not_expired
          )
          expect(notExpiredExec?.state).toBe(TransactionState.DONE)

          const runningExec = remainingExecutions.find(
            (e) => e.transaction_id === trx_running
          )
          expect(runningExec?.state).toBe(TransactionState.INVOKING)
        })
      })
    })
  },
})
