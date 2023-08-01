export * from "./services"

import { IEventBusModuleService } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  eventBusModuleService?: IEventBusModuleService
}

export * from "./services"
