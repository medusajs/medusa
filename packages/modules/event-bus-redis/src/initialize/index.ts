import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
} from "@medusajs/modules-sdk"
import { IEventBusService } from "@medusajs/types"
import { EventBusRedisModuleOptions } from "../types"
import { Modules } from "@medusajs/utils"

export const initialize = async (
  options?: EventBusRedisModuleOptions | ExternalModuleDeclaration
): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await MedusaModule.bootstrap<IEventBusService>({
    moduleKey: serviceKey,
    defaultPath: "@medusajs/event-bus-redis",
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
  })

  return loaded[serviceKey]
}
