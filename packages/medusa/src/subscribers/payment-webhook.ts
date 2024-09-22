import { onPaymentProcessedWorkflow } from "@medusajs/core-flows"
import { IPaymentModuleService, ProviderWebhookPayload } from "@medusajs/types"
import { Modules, PaymentActions, PaymentWebhookEvents } from "@medusajs/utils"
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
    Modules.PAYMENT
  )

  const input = event.data

  if (
    (input.payload.rawData as unknown as SerializedBuffer).type === "Buffer"
  ) {
    input.payload.rawData = Buffer.from(
      (input.payload.rawData as unknown as SerializedBuffer).data
    )
  }

  // We process the event separately from the workflow. The state of the workflow should not interfere with the payment event processing.
  const processedEvent = await paymentService.processEvent(input)

  if (processedEvent.action !== PaymentActions.NOT_SUPPORTED) {
    onPaymentProcessedWorkflow(container).run({
      input: processedEvent,
    })
  }
}

export const config: SubscriberConfig = {
  event: PaymentWebhookEvents.WebhookReceived,
  context: {
    subscriberId: "payment-webhook-handler",
  },
}
