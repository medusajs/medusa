import { onPaymentProcessedWorkflow } from "@medusajs/core-flows"
import { IPaymentModuleService, ProviderWebhookPayload } from "@medusajs/types"
import { Modules, PaymentWebhookEvents } from "@medusajs/utils"
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

  // We process the event separately from the workflow. The payment processing should not depend on the workflow execution.
  //   We always want to process the payment event.
  const processedEvent = await paymentService.processEvent(input)

  if (processedEvent) {
    await onPaymentProcessedWorkflow(container).run({
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
