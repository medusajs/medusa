import { IPaymentModuleService, ProviderWebhookPayload } from "@medusajs/types"
import { ModuleRegistrationName, PaymentWebhookEvents } from "@medusajs/utils"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"

type SerializedBuffer = {
  data: ArrayBuffer
  type: "Buffer"
}

export default async function paymentWebhookhandler({
  event,
  container,
}: SubscriberArgs<ProviderWebhookPayload>) {
  const paymentService: IPaymentModuleService = container.resolve(
    ModuleRegistrationName.PAYMENT
  )

  const input = "data" in event ? event.data : event

  if (
    (input.payload.rawData as unknown as SerializedBuffer).type === "Buffer"
  ) {
    input.payload.rawData = Buffer.from(
      (input.payload.rawData as unknown as SerializedBuffer).data
    )
  }
  await paymentService.processEvent(input)
}

export const config: SubscriberConfig = {
  event: PaymentWebhookEvents.WebhookReceived,
  context: {
    subscriberId: "payment-webhook-handler",
  },
}
