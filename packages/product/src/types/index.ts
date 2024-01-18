export * from "./services"

import { IEventBusModuleService, Logger } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  eventBusModuleService?: IEventBusModuleService
}

export * from "./events"
export * from "./services"
