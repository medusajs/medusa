import { emitEventStep } from "@medusajs/core-flows"
import { Modules, TransactionState } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Workflow Engine API", () => {
      let medusaContainer

      beforeAll(() => {
        medusaContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, medusaContainer)
      })

      describe("Testing WorkflowEngine.run", () => {
        beforeAll(async () => {
          const step1 = createStep(
            {
              name: "my-step",
            },
            async (input: { initial: string }, { container }) => {
              const testMod = container.resolve("testingModule") as any

              return new StepResponse(testMod.methodName(input.initial))
            }
          )

          createWorkflow(
            {
              name: "my-workflow-name",
            },
            function (input: WorkflowData<{ initial: string }>) {
              const stepRes = step1(input)

              return new WorkflowResponse(stepRes)
            }
          )
        })

        it("Should invoke modules passing the current medusa context as argument", async () => {
          const testMod = medusaContainer.resolve("testingModule") as any

          const methodSpy = jest.spyOn(testMod, "methodName")

          const engine = medusaContainer.resolve(Modules.WORKFLOW_ENGINE)

          const res = await engine.run("my-workflow-name", {
            transactionId: "trx-id",
            input: {
              initial: "abc",
            },
            context: {
              meta: {
                myStuff: "myStuff",
              },
            },
          })

          expect(res.result).toEqual("abc called")

          expect(methodSpy).toHaveBeenCalledTimes(1)
          expect(methodSpy).toHaveBeenCalledWith(
            "abc",
            expect.objectContaining({
              transactionId: "trx-id",
              __type: "MedusaContext",
              eventGroupId: expect.any(String),
              idempotencyKey: "my-workflow-name:trx-id:my-step:invoke",
              meta: {
                myStuff: "myStuff",
              },
            })
          )
        })
      })

      describe("Workflows event", () => {
        const failingEventName = "failing-event"

        it("should not compensate the workflow if the event subscriber fails", async () => {
          const step1 = createStep(
            {
              name: "my-step",
            },
            async (_) => {
              return new StepResponse({ result: "success" })
            }
          )

          createWorkflow(
            {
              name: "my-workflow-name-2",
              retentionTime: 50,
            },
            function (input: WorkflowData<{ initial: string }>) {
              const stepRes = step1()

              emitEventStep({
                eventName: failingEventName,
                data: {
                  input: stepRes,
                },
              })

              return new WorkflowResponse(stepRes)
            }
          )

          const container = getContainer()
          const eventBus = container.resolve(
            Modules.EVENT_BUS
          ) as IEventBusModuleService

          const eventSpy = jest.fn()
          eventBus.subscribe(failingEventName, async (event) => {
            eventSpy(event)
            throw new Error("Failed to emit event")
          })

          const engine = container.resolve(Modules.WORKFLOW_ENGINE)

          const transactionId = "trx-id-failing-event"
          const res = await engine.run("my-workflow-name-2", {
            transactionId,
            input: {
              initial: "abc",
            },
          })

          expect(res.result).toEqual({ result: "success" })

          const executions = await engine.listWorkflowExecutions({
            transaction_id: transactionId,
          })

          expect(executions.length).toBe(1)
          expect(executions[0].state).toBe(TransactionState.DONE)

          expect(eventSpy).toHaveBeenCalledTimes(1)
          expect(eventSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              data: {
                input: {
                  result: "success",
                },
              },
            })
          )
        })
      })

      describe("Step timeout with continueOnPermanentFailure", () => {
        it("should continue the workflow when an async step with retryIntervalAwaiting reaches timeout and continueOnPermanentFailure is set", async () => {
          const invokeSpy = jest.fn()
          const invokeSpyB = jest.fn()

          const step1 = createStep(
            {
              name: "step-sync",
            },
            async () => {
              return new StepResponse({ result: "from-step-1" })
            }
          )

          const step2b = createStep(
            {
              name: "step-async-timeout-b",
              async: true,
              timeout: 1,
              retryIntervalAwaiting: 0.3,
              maxAwaitingRetries: 2,
              continueOnPermanentFailure: true,
            },
            async () => {
              invokeSpyB()
            }
          )

          const step2 = createStep(
            {
              name: "step-async-timeout",
              async: true,
              timeout: 1,
              retryIntervalAwaiting: 0.3,
              maxAwaitingRetries: 2,
              continueOnPermanentFailure: true,
              noCompensation: true,
            },
            async () => {
              invokeSpy()
            }
          )

          const step3 = createStep(
            {
              name: "step-after-timeout",
            },
            async () => {
              return new StepResponse({ result: "from-step-3" })
            }
          )

          createWorkflow(
            {
              name: "wf-timeout-continue",
              retentionTime: 50,
            },
            function () {
              step1()
              step2()
              step2b()
              const res3 = step3()
              return new WorkflowResponse(res3)
            }
          )

          const container = getContainer()
          const engine = container.resolve(Modules.WORKFLOW_ENGINE)

          const transactionId = "trx-timeout-continue"
          const { transaction } = await engine.run("wf-timeout-continue", {
            transactionId,
            throwOnError: false,
          })

          // The workflow should be waiting for the async step
          expect(transaction.getState()).toBe(TransactionState.INVOKING)

          // Wait for the step timeout to fire plus some buffer
          await new Promise((resolve) => global.setTimeout(resolve, 4000))

          const executions = await engine.listWorkflowExecutions({
            transaction_id: transactionId,
          })

          expect(executions.length).toBe(1)
          expect(executions[0].state).toBe(TransactionState.DONE)

          expect(invokeSpy).toHaveBeenCalled()
          expect(invokeSpyB).toHaveBeenCalled()
        })
      })
    })
  },
})
