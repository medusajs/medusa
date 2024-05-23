import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPaymentModuleService, ProviderWebhookPayload } from "@medusajs/types"
import { PaymentWebhookEvents } from "@medusajs/utils"
import { SubscriberArgs, SubscriberConfig } from "../types/subscribers"

type SerializedBuffer = {
  data: ArrayBuffer
  type: "Buffer"
}

export default async function paymentWebhookhandler({
  data,
  container,
}: SubscriberArgs<ProviderWebhookPayload>) {
  const paymentService: IPaymentModuleService = container.resolve(
    ModuleRegistrationName.PAYMENT
  )

  const input = "data" in data ? data.data : data

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
