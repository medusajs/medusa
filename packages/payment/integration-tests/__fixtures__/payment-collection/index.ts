import { CreatePaymentCollectionDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { PaymentCollection } from "../../../src/models"
import { defaultPaymentCollectionData } from "./data"

export * from "./data"

export async function createPaymentCollections(
  manager: SqlEntityManager,
  paymentCollectionData: CreatePaymentCollectionDTO[] = defaultPaymentCollectionData
): Promise<PaymentCollection[]> {
  const collections: PaymentCollection[] = []

  for (let data of paymentCollectionData) {
    let collection = manager.create(PaymentCollection, data)

    await manager.persistAndFlush(collection)
  }

  return collections
}
