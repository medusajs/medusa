export * from "./services"

import { Context, IEventBusModuleService, Logger } from "@medusajs/types"
import { MessageAggregator } from "@medusajs/utils"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  eventBusModuleService?: IEventBusModuleService
}

export interface InternalContext extends Context {
  messageAggregator?: MessageAggregator
}

export * from "./events"
export * from "./services"
