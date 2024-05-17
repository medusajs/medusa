import {
  IEventBusService,
  IPaymentModuleService,
  ProviderWebhookPayload,
  Subscriber,
} from "@medusajs/types"
import { PaymentWebhookEvents } from "@medusajs/utils"

type SerializedBuffer = {
  data: ArrayBuffer
  type: "Buffer"
}

type InjectedDependencies = {
  paymentModuleService: IPaymentModuleService
  eventBusModuleService: IEventBusService
}

class PaymentWebhookSubscriber {
  private readonly eventBusModuleService_: IEventBusService
  private readonly paymentModuleService_: IPaymentModuleService

  constructor({
    eventBusModuleService,
    paymentModuleService,
  }: InjectedDependencies) {
    this.eventBusModuleService_ = eventBusModuleService
    this.paymentModuleService_ = paymentModuleService

    this.eventBusModuleService_.subscribe(
      PaymentWebhookEvents.WebhookReceived,
      this.processEvent as Subscriber
    )
  }

  /**
   * TODO: consider moving this to a workflow
   */
  processEvent = async (data: ProviderWebhookPayload): Promise<void> => {
    if (
      (data.payload.rawData as unknown as SerializedBuffer).type === "Buffer"
    ) {
      data.payload.rawData = Buffer.from(
        (data.payload.rawData as unknown as SerializedBuffer).data
      )
    }
    await this.paymentModuleService_.processEvent(data)
  }
}

export default PaymentWebhookSubscriber
