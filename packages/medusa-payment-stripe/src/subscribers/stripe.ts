import { type SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa"
import Stripe from "stripe"
import { handlePaymentHook } from "../api/utils/utils"

export default async function stripeHandler({
  data,
  container,
}: SubscriberArgs<Stripe.Event>) {
  const event = data
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  await handlePaymentHook({
    event,
    container,
    paymentIntent,
  })
}

export const config: SubscriberConfig = {
  event: "medusa.stripe_payment_intent_update",
  context: {
    subscriberId: "medusa.stripe_payment_intent_update",
  },
}
