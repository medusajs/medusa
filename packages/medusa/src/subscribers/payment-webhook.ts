import { processPaymentWorkflowId } from "@medusajs/core-flows"
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
    (input.payload?.rawData as unknown as SerializedBuffer)?.type === "Buffer"
  ) {
    input.payload.rawData = Buffer.from(
      (input.payload.rawData as unknown as SerializedBuffer).data
    )
  }

  const processedEvent = await paymentService.getWebhookActionAndData(input)

  // Without a payment session id we cannot associate the event with a specific
  // payment session (and therefore cart). Processing it would let the workflow
  // resolve to an arbitrary, unrelated payment session/cart, so we ignore it.
  // This guards against e.g. foreign events delivered by a provider account
  // shared with another integration.
  if (!processedEvent.data?.session_id) {
    return
  }

  if (
    processedEvent?.action === PaymentActions.NOT_SUPPORTED ||
    // We currently don't handle these payment statuses in the processPayment function.
    processedEvent?.action === PaymentActions.CANCELED ||
    processedEvent?.action === PaymentActions.FAILED ||
    processedEvent?.action === PaymentActions.REQUIRES_MORE ||
    processedEvent?.action === PaymentActions.PENDING_AUTHORIZATION
  ) {
    return
  }

  const wfEngine = container.resolve(Modules.WORKFLOW_ENGINE)
  await wfEngine.run(processPaymentWorkflowId, { input: processedEvent })
}

export const config: SubscriberConfig = {
  event: PaymentWebhookEvents.WebhookReceived,
  context: {
    subscriberId: "payment-webhook-handler",
  },
}
