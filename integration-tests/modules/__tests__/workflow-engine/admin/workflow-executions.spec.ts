import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { setTimeout } from "timers/promises"

jest.setTimeout(100000)

/**
 * finish the workflow to prevent the runner from waiting for the end of the execution permanently
 */
async function finishWorkflows(
  api: any,
  {
    stepId,
    response,
    executions,
  }: {
    stepId: string
    response?: any
    executions: { transaction_id: string }[]
  }
) {
  const promises: any[] = []
  for (const execution of executions) {
    promises.push(
      api.post(
        `/admin/workflows-executions/my-workflow-name/steps/success`,
        {
          transaction_id: execution.transaction_id,
          step_id: stepId,
          response: response || {
            all: "good",
          },
        },
        adminHeaders
      )
    )
  }

  await Promise.all(promises)
}

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Workflow Engine API", () => {
      let medusaContainer

      beforeAll(() => {
        medusaContainer = getContainer()

        const step1 = createStep(
          {
            name: "my-step",
          },
          async (input: { initial: string }) => {
            return new StepResponse({
              result: input.initial,
            })
          }
        )
        const step2 = createStep(
          {
            name: "my-step-async",
            async: true,
          },
          async () => {}
        )

        createWorkflow(
          {
            name: "my-workflow-name",
            retentionTime: 1000,
          },
          function (input: WorkflowData<{ initial: string }>) {
            step1(input)
            const res = step2()
            return new WorkflowResponse(res)
          }
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, medusaContainer)
      })

      it("Should list all workflows in execution or completed and retrieve them by id", async () => {
        for (let i = 3; i--; ) {
          await api.post(
            `/admin/workflows-executions/my-workflow-name/run`,
            {
              input: {
                initial: "abc",
              },
            },
            adminHeaders
          )
        }

        const executions = await api.get(
          `/admin/workflows-executions`,
          adminHeaders
        )

        expect(executions.data.count).toEqual(3)
        expect(executions.data.workflow_executions.length).toEqual(3)
        expect(executions.data.workflow_executions[0]).toEqual({
          workflow_id: "my-workflow-name",
          transaction_id: expect.any(String),
          id: expect.any(String),
          state: "invoking",
          execution: expect.anything(),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        })

        const retrivedById = await api.get(
          `/admin/workflows-executions/` +
            executions.data.workflow_executions[0].id,
          adminHeaders
        )

        expect(retrivedById.data.workflow_execution).toEqual(
          expect.objectContaining(executions.data.workflow_executions[0])
        )

        await finishWorkflows(api, {
          stepId: "my-step-async",
          executions: executions.data.workflow_executions,
        })
      })

      it("Should list all workflows matching the filters", async () => {
        const promises: any[] = []
        const transactions: string[] = []

        for (let i = 3; i--; ) {
          const transactionId = "transaction_" + (i + 1)
          transactions.push(transactionId)
          promises.push(
            api.post(
              `/admin/workflows-executions/my-workflow-name/run`,
              {
                input: {
                  initial: "abc",
                },
                transaction_id: transactionId,
              },
              adminHeaders
            )
          )
        }

        await Promise.all(promises)

        const executions = await api.get(
          `/admin/workflows-executions?transaction_id[]=transaction_1&transaction_id[]=transaction_2`,
          adminHeaders
        )

        expect(executions.data.count).toEqual(2)
        expect(executions.data.workflow_executions.length).toEqual(2)
        expect(executions.data.workflow_executions[0]).toEqual({
          workflow_id: "my-workflow-name",
          transaction_id: expect.stringMatching(
            new RegExp(transactions.join("|"))
          ),
          id: expect.any(String),
          state: "invoking",
          execution: expect.anything(),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        })
        expect(executions.data.workflow_executions[1]).toEqual({
          workflow_id: "my-workflow-name",
          transaction_id: expect.stringMatching(
            new RegExp(transactions.join("|"))
          ),
          id: expect.any(String),
          state: "invoking",
          execution: expect.anything(),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
        })

        await finishWorkflows(api, {
          stepId: "my-step-async",
          executions: transactions.map((transactionId) => ({
            transaction_id: transactionId,
          })),
        })

        console.log("finished")
      })

      it("Should execute a workflow and retrieve its execution while running and when it is completed", async () => {
        const wf = await api.post(
          `/admin/workflows-executions/my-workflow-name/run`,
          {
            input: {
              initial: "abc",
            },
            transaction_id: "trx_123",
          },
          adminHeaders
        )

        expect(wf.data).toEqual({
          acknowledgement: {
            transactionId: "trx_123",
            workflowId: "my-workflow-name",
            hasFailed: false,
            hasFinished: false,
          },
        })

        await setTimeout(2000)

        const execution = await api.get(
          `/admin/workflows-executions/my-workflow-name/${wf.data.acknowledgement.transactionId}`,
          adminHeaders
        )

        expect(execution.data).toEqual({
          workflow_execution: expect.objectContaining({
            workflow_id: "my-workflow-name",
            transaction_id: "trx_123",
            id: expect.any(String),
            state: "invoking",
            execution: expect.objectContaining({
              hasAsyncSteps: true,
              hasFailedSteps: false,
              hasSkippedSteps: false,
              hasWaitingSteps: true,
              hasRevertedSteps: false,
            }),
            context: expect.objectContaining({
              data: expect.objectContaining({
                invoke: {
                  "my-step": {
                    __type: "Symbol(WorkflowWorkflowData)",
                    output: {
                      __type: "Symbol(WorkflowStepResponse)",
                      output: {
                        result: "abc",
                      },
                      compensateInput: {
                        result: "abc",
                      },
                    },
                  },
                },
                payload: {
                  initial: "abc",
                },
              }),
            }),
          }),
        })

        const respondAsync = await api.post(
          `/admin/workflows-executions/my-workflow-name/steps/success`,
          {
            transaction_id: "trx_123",
            step_id: "my-step-async",
            response: {
              all: "good",
            },
          },
          adminHeaders
        )

        expect(respondAsync.data.success).toEqual(true)

        const completed = await api.get(
          `/admin/workflows-executions/my-workflow-name/trx_123`,
          adminHeaders
        )

        expect(completed.data).toEqual({
          workflow_execution: expect.objectContaining({
            workflow_id: "my-workflow-name",
            transaction_id: "trx_123",
            state: "done",
            execution: expect.objectContaining({
              hasAsyncSteps: true,
              hasFailedSteps: false,
              hasSkippedSteps: false,
              hasWaitingSteps: false,
              hasRevertedSteps: false,
            }),
            context: expect.objectContaining({
              data: expect.objectContaining({
                invoke: expect.objectContaining({
                  "my-step-async": {
                    __type: "Symbol(WorkflowStepResponse)",
                    output: {
                      all: "good",
                    },
                    compensateInput: {
                      all: "good",
                    },
                  },
                }),
              }),
            }),
          }),
        })
      })
    })
  },
})
