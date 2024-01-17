import { IPaymentModuleService } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { initialize } from "../../../../src/initialize"
import { DB_URL, MikroOrmWrapper } from "../../../utils"

jest.setTimeout(30000)

describe("Payment Module Service", () => {
  let service: IPaymentModuleService
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PAYMNET_DB_SCHEMA,
      },
    })
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("create", () => {
    it("should throw an error when required params are not passed", async () => {
      let error = await service
        .createPaymentCollection([
          {
            amount: 200,
            region_id: "req_123",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for PaymentCollection.currency_code is required, 'undefined' found"
      )

      error = await service
        .createPaymentCollection([
          {
            currency_code: "USD",
            region_id: "req_123",
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for PaymentCollection.amount is required, 'undefined' found"
      )

      error = await service
        .createPaymentCollection([
          {
            currency_code: "USD",
            amount: 200,
          } as any,
        ])
        .catch((e) => e)

      expect(error.message).toContain(
        "Value for PaymentCollection.region_id is required, 'undefined' found"
      )
    })

    it("should create a payment collection successfully", async () => {
      const [createdPaymentCollection] = await service.createPaymentCollection([
        { currency_code: "USD", amount: 200, region_id: "reg_123" },
      ])

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
