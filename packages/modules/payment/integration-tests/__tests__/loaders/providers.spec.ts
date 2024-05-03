import { IPaymentModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { Modules } from "@medusajs/modules-sdk"
import { initModules } from "medusa-test-utils"
import { MikroOrmWrapper } from "../../utils"
import { getInitModuleConfig } from "../../utils/get-init-module-config"
import { createPaymentCollections } from "../../__fixtures__"

jest.setTimeout(30000)

describe("Payment Module Service", () => {
  let service: IPaymentModuleService
  let repositoryManager: SqlEntityManager
  let shutdownFunc: () => Promise<void>

  beforeAll(async () => {
    await MikroOrmWrapper.setupDatabase()

    const initModulesConfig = getInitModuleConfig()
    const { medusaApp, shutdown } = await initModules(initModulesConfig)
    service = medusaApp.modules[Modules.PAYMENT]

    shutdownFunc = shutdown
  })

  afterAll(async () => {
    await shutdownFunc()
  })

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    await createPaymentCollections(repositoryManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("providers", () => {
    it("should load payment plugins", async () => {
      let error = await service
        .createPaymentCollections([
          {
            amount: 200,
            region_id: "req_123",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for PaymentCollection.currency_code is required, 'undefined' found"
      )
    })

    it("should create a payment collection successfully", async () => {
      const [createdPaymentCollection] = await service.createPaymentCollections(
        [{ currency_code: "USD", amount: 200, region_id: "reg_123" }]
      )

      expect(createdPaymentCollection).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          status: "not_paid",
          payment_providers: [],
          payment_sessions: [],
          payments: [],
          currency_code: "USD",
          amount: 200,
        })
      )
    })
  })
})
