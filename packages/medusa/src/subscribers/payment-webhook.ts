import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { PaymentWebhookEvents } from "@medusajs/utils"

import { IEventBusService } from "@medusajs/types"
import { AwilixContainer } from "awilix"

class PaymentWebhookSubscriber {
  private readonly eventBusService_: IEventBusService

  constructor(container: AwilixContainer) {
    this.eventBusService_ = container.resolve("eventBusService")

    const paymentModuleService = container.resolve(
      ModuleRegistrationName.PAYMENT
    )

    this.eventBusService_.subscribe(
      PaymentWebhookEvents.WebhookReceived,
      paymentModuleService.onWebhookReceived
    )
  }
}

export default PaymentWebhookSubscriber
