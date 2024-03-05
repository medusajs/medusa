import { IEventBusModuleService, Logger } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  eventBusService?: IEventBusModuleService
}

export const FulfillmentIdentifiersRegistrationName =
  "fulfillment_providers_identifier"
