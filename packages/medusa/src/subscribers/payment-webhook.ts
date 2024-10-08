import {
  onPaymentProcessedWorkflow,
  processPaymentWorkflow,
} from "@medusajs/core-flows"
import {
  IPaymentModuleService,
  ProviderWebhookPayload,
} from "@medusajs/framework/types"
import {
  Modules,
  PaymentActions,
  PaymentWebhookEvents,
} from "@medusajs/framework/utils"
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

  const processedEvent = await paymentService.getWebhookActionAndData(input)

  if (processedEvent?.action === PaymentActions.NOT_SUPPORTED) {
    return
  }

  if (!processedEvent.data) {
    return
  }

  await processPaymentWorkflow(container).run({
    input: processedEvent,
  })

  // We process the intended side effects of payment processing separately.
  await onPaymentProcessedWorkflow(container).run({
    input: processedEvent,
  })
}

export const config: SubscriberConfig = {
  event: PaymentWebhookEvents.WebhookReceived,
  context: {
    subscriberId: "payment-webhook-handler",
  },
}
