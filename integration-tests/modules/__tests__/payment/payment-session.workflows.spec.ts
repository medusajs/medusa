import {
  createPaymentSessionsWorkflow,
  createPaymentSessionsWorkflowId,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPaymentModuleService, IRegionModuleService } from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../environment-helpers/bootstrap-app"
import { getContainer } from "../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../environment-helpers/use-db"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

describe("Carts workflows", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let paymentModule: IPaymentModuleService
  let regionModule: IRegionModuleService
  let remoteLink

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    paymentModule = appContainer.resolve(ModuleRegistrationName.PAYMENT)
    regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
    remoteLink = appContainer.resolve("remoteLink")
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  describe("createPaymentSessionWorkflow", () => {
    it("should create payment sessions", async () => {
      const region = await regionModule.create({
        currency_code: "usd",
        name: "US",
      })

      let paymentCollection = await paymentModule.createPaymentCollections({
        currency_code: "usd",
        amount: 1000,
        region_id: region.id,
      })

      await createPaymentSessionsWorkflow(appContainer).run({
        input: {
          payment_collection_id: paymentCollection.id,
          provider_id: "pp_system_default",
          context: {},
          data: {},
        },
      })

      paymentCollection = await paymentModule.retrievePaymentCollection(
        paymentCollection.id,
        {
          relations: ["payment_sessions"],
        }
      )

      expect(paymentCollection).toEqual(
        expect.objectContaining({
          id: paymentCollection.id,
          currency_code: "usd",
          amount: 1000,
          region_id: region.id,
          payment_sessions: expect.arrayContaining([
            expect.objectContaining({
              amount: 1000,
              currency_code: "usd",
              provider_id: "pp_system_default",
            }),
          ]),
        })
      )
    })

    describe("compensation", () => {
      it("should delete created payment collection if a subsequent step fails", async () => {
        const workflow = createPaymentSessionsWorkflow(appContainer)

        workflow.appendAction("throw", createPaymentSessionsWorkflowId, {
          invoke: async function failStep() {
            throw new Error(
              `Failed to do something after creating payment sessions`
            )
          },
        })

        const region = await regionModule.create({
          currency_code: "usd",
          name: "US",
        })

        let paymentCollection = await paymentModule.createPaymentCollections({
          currency_code: "usd",
          amount: 1000,
          region_id: region.id,
        })

        const { errors } = await workflow.run({
          input: {
            payment_collection_id: paymentCollection.id,
            provider_id: "pp_system_default",
            context: {},
            data: {},
          },
          throwOnError: false,
        })

        expect(errors).toEqual([
          {
            action: "throw",
            handlerType: "invoke",
            error: new Error(
              `Failed to do something after creating payment sessions`
            ),
          },
        ])

        const sessions = await paymentModule.listPaymentSessions({
          payment_collection_id: paymentCollection.id,
        })

        expect(sessions).toHaveLength(0)
      })
    })
  })
})
