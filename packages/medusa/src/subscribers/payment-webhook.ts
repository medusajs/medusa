import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"

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
