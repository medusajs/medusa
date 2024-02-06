import { EntityName } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { Payment, PaymentSession, PaymentCollection } from "@models"

import {
  defaultPaymentCollectionData,
  defaultPaymentData,
  defaultPaymentSessionData,
} from "./data"

export * from "./data"

async function createEntities<
  T extends EntityName<Payment | PaymentCollection | PaymentSession>
>(manager: SqlEntityManager, entity: T, data: any[]) {
  const created: T[] = []
  for (let record of data) {
    created.push(manager.create(entity, record))
  }

  await manager.persistAndFlush(created)
  return created
}

export async function createPaymentCollections(
  manager: SqlEntityManager,
  paymentCollectionData = defaultPaymentCollectionData
): Promise<PaymentCollection[]> {
  return await createEntities<PaymentCollection>(
    manager,
    PaymentCollection,
    paymentCollectionData
  )
}

export async function createPaymentSessions(
  manager: SqlEntityManager,
  paymentSessionData = defaultPaymentSessionData
): Promise<PaymentCollection[]> {
  return await createEntities<PaymentSession>(
    manager,
    PaymentSession,
    paymentSessionData
  )
}

export async function createPayments(
  manager: SqlEntityManager,
  paymentData = defaultPaymentData
): Promise<PaymentCollection[]> {
  return await createEntities<Payment>(manager, Payment, paymentData)
}
