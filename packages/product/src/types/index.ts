export * from "./services"

import { IEventBusService, Logger } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  eventBusService?: IEventBusService
  logger?: Logger
}

export * from "./services"
