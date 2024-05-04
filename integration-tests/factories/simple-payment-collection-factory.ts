import { DataSource } from "typeorm"

import { simpleRegionFactory } from "./simple-region-factory"
import { simplePaymentFactory } from "./simple-payment-factory"
import { Payment, PaymentCollection } from "@medusajs/medusa"

export const simplePaymentCollectionFactory = async (
  dataSource: DataSource,
  data: Partial<PaymentCollection> = {}
): Promise<PaymentCollection> => {
  const manager = dataSource.manager

  const defaultData = {
    currency_code: data.currency_code ?? "usd",
    type: data.type ?? "order_edit",
    status: data.status ?? "not_paid",
    amount: data.amount ?? 1000,
    created_by: data.created_by ?? "admin_user",
  }

  if (!data.region && !data.region_id) {
    data.region = await simpleRegionFactory(dataSource, {
      id: data.region_id || "test-region",
      currency_code: defaultData.currency_code,
    })
    data.region_id = data.region.id
  }

  if (data.payments?.length) {
    const payments: Payment[] = []
    for (const payment of data.payments) {
      payment.currency_code = payment.currency_code ?? defaultData.currency_code

      const savedPayment = await simplePaymentFactory(
        dataSource,
        payment as any
      )
      payments.push(savedPayment)
    }

    data.payments = payments
  }

  const obj = {
    ...defaultData,
    ...data,
  }

  const payCol = manager.create<PaymentCollection>(PaymentCollection, obj)

  return await manager.save<PaymentCollection>(payCol)
}
