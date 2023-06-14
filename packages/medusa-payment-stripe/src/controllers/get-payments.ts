import { OrderService } from "@medusajs/medusa"
import Stripe from "stripe"
import StripeBase from "../core/stripe-base"
import { WidgetPayment } from "../types"

export async function getStripePayments(req): Promise<WidgetPayment[]> {
  const { order_id } = req.params

  const orderService: OrderService = req.scope.resolve("orderService")
  const stripeBase: StripeBase = req.scope.resolve("stripeProviderService")

  const order = await orderService.retrieve(order_id, {
    relations: ["payments", "swaps", "swaps.payment", "region"],
  })

  const paymentIds = order.payments
    .filter((p) => p.provider_id === "stripe")
    .map((p) => ({ id: p.data.id as string, type: "order" }))

  if (order.swaps.length) {
    const swapPayments = order.swaps
      .map((s) => s.payment)
      .filter((p) => p.provider_id === "stripe")
      .map((p) => ({ id: p.data.id as string, type: "swap" }))

    paymentIds.push(...swapPayments)
  }

  const payments = await Promise.all(
    paymentIds.map(async (payment) => {
      const intent = await stripeBase.stripe_.paymentIntents.retrieve(
        payment.id,
        {
          expand: ["latest_charge"],
        }
      )

      const charge = intent.latest_charge as Stripe.Charge

      return {
        id: intent.id,
        amount: intent.amount,
        created: intent.created,
        risk_score: charge?.outcome?.risk_score ?? null,
        risk_level: charge?.outcome?.risk_level ?? null,
        type: payment.type,
        region: order.region,
      }
    })
  )

  return payments
}
