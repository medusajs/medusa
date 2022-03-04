import { Connection } from "typeorm"
import { Payment } from "@medusajs/medusa"

export type PaymentFactoryData = {
  provider_id?: string
  order?: string
  cart?: string
  data?: any
  amount?: number
  currency_code?: string
  captured?: Date | boolean
}

export const simplePaymentFactory = async (
  connection: Connection,
  data: PaymentFactoryData,
  _?: number
): Promise<Payment> => {
  const manager = connection.manager

  let captured_at = data.captured
  if (typeof captured_at === "boolean") {
    if (captured_at) {
      captured_at = new Date()
    } else {
      captured_at = null
    }
  } else if (typeof captured_at === "undefined") {
    captured_at = null
  }

  const address = manager.create(Payment, {
    provider_id: data.provider_id ?? "test-pay",
    order_id: data.order,
    cart_id: data.cart,
    data: data.data ?? {},
    amount: data.amount ?? 1000,
    currency_code: data.currency_code ?? "usd",
    captured_at,
  })

  return await manager.save(address)
}
