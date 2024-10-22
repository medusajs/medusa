import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

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
    })
  },
})
