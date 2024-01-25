import { SqlEntityManager } from "@mikro-orm/postgresql"
import { asValue } from "awilix"
import {
  createPaymentCollections,
  createPaymentSessions,
  createPayments,
} from "../../../__fixtures__"
import { createMedusaContainer } from "@medusajs/utils"
import { PaymentService } from "@services"

import { MikroOrmWrapper } from "../../../utils"
import ContainerLoader from "../../../../src/loaders/container"

jest.setTimeout(30000)

describe("Payment Service", () => {
  let service: PaymentService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()
    testManager = await MikroOrmWrapper.forkManager()

    const container = createMedusaContainer()
    container.register("manager", asValue(repositoryManager))

    await ContainerLoader({ container })

    service = container.resolve("paymentService")

    await createPaymentCollections(testManager)
    await createPaymentSessions(testManager)
    await createPayments(testManager)
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("retrieve with amounts", () => {
    it("should retrieve a payment with computed amounts", async () => {
      let payment: any = await service.retrieve("pay-id-1", {
        select: ["captured_amount"],
      })

      expect(payment.captured_amount).toEqual(0)

      await service.capture([{ amount: 50, payment_id: "pay-id-1" }])

      payment = await service.retrieve("pay-id-1", {
        select: ["captured_amount"],
      })

      expect(payment.captured_amount).toEqual(50)

      await service.capture([{ amount: 25, payment_id: "pay-id-1" }])

      payment = await service.retrieve("pay-id-1", {
        select: ["captured_amount", "refunded_amount"],
      })

      expect(payment.captured_amount).toEqual(75)
      expect(payment.refunded_amount).toEqual(0)
    })
  })
})
