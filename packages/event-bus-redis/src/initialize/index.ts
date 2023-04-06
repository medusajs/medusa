import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusService } from "@medusajs/types"
import { EventBusRedisModuleOptions } from "../types"

export const initialize = async (
  options?: EventBusRedisModuleOptions | ExternalModuleDeclaration
): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/event-bus-redis",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    undefined
  )

  return loaded[serviceKey] as IEventBusService
}
