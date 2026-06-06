import { IEventBusModuleService, Logger } from "@zjedene-medusa/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
  EventBus?: IEventBusModuleService
}
