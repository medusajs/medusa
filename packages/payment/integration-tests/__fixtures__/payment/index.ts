import { CreatePaymentDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { Payment } from "../../../src/models"
import { defaultPaymentData } from "./data"

export * from "./data"

export async function createPayment(
  manager: SqlEntityManager,
  paymentData: CreatePaymentDTO[] = defaultPaymentData
): Promise<Payment[]> {
  const collections: Payment[] = []

  for (let data of paymentData) {
    let collection = manager.create(Payment, data)

    await manager.persistAndFlush(collection)
  }

  return collections
}
