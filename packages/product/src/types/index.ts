export * from "./services"

import { IEventBusModuleService } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  eventBusService?: IEventBusModuleService
}

export * from "./services"
