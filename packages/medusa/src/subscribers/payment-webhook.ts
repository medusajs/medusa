import { PaymentWebhookEvents } from "@medusajs/utils"

import {
  IEventBusService,
  IPaymentModuleService,
  ProviderWebhookPayload,
} from "@medusajs/types"
import { EventBusService } from "../services"

type InjectedDependencies = {
  paymentModuleService: IPaymentModuleService
  eventBusService: EventBusService
}

class PaymentWebhookSubscriber {
  private readonly eventBusService_: IEventBusService

  constructor({ eventBusService, paymentModuleService }: InjectedDependencies) {
    this.eventBusService_ = eventBusService

    this.eventBusService_.subscribe(
      PaymentWebhookEvents.WebhookReceived,
      async (data) =>
        paymentModuleService.processEvent(data as ProviderWebhookPayload)
    )
  }
}

export default PaymentWebhookSubscriber
