import { type SubscriberArgs, type SubscriberConfig } from "@medusajs/medusa"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export default async function paymentWebhookHandler({
  data,
  container,
}: SubscriberArgs) {
  const paymentModuleService = container.resolve(ModuleRegistrationName.PAYMENT)
  await paymentModuleService.onWebhookReceived(data)
}

export const config: SubscriberConfig = {
  event: "payment.webhook_received",
  context: {
    subscriberId: "payment.webhook_received",
  },
}
