import { SqlEntityManager } from "@mikro-orm/postgresql"

import { Payment, PaymentSession } from "@models"

import { PaymentCollection } from "../../src/models"
import {
  defaultPaymentCollectionData,
  defaultPaymentData,
  defaultPaymentSessionData,
} from "./data"

export * from "./data"

export async function createPaymentCollections(
  manager: SqlEntityManager,
  paymentCollectionData = defaultPaymentCollectionData
): Promise<PaymentCollection[]> {
  const collections: PaymentCollection[] = []

  for (let data of paymentCollectionData) {
    let collection = manager.create(PaymentCollection, data)

    await manager.persistAndFlush(collection)
  }

  return collections
}

export async function createPaymentSessions(
  manager: SqlEntityManager,
  paymentCollectionData = defaultPaymentSessionData
): Promise<PaymentSession[]> {
  const collections: PaymentSession[] = []

  for (let data of paymentCollectionData) {
    let collection = manager.create(PaymentSession, data)

    await manager.persistAndFlush(collection)
  }

  return collections
}

export async function createPayments(
  manager: SqlEntityManager,
  paymentCollectionData = defaultPaymentData
): Promise<PaymentSession[]> {
  const collections: Payment[] = []

  for (let data of paymentCollectionData) {
    let collection = manager.create(Payment, data)

    await manager.persistAndFlush(collection)
  }

  return collections
}
