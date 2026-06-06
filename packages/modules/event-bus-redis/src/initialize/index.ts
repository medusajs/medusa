import { MedusaModule } from "@zjedene-medusa/framework/modules-sdk"
import {
  ExternalModuleDeclaration,
  IEventBusService,
  InternalModuleDeclaration,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { EventBusRedisModuleOptions } from "../types"

export const initialize = async (
  options?: EventBusRedisModuleOptions | ExternalModuleDeclaration
): Promise<IEventBusService> => {
  const serviceKey = Modules.EVENT_BUS
  const loaded = await MedusaModule.bootstrap<IEventBusService>({
    moduleKey: serviceKey,
    defaultPath: "@zjedene-medusa/event-bus-redis",
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
  })

  return loaded[serviceKey]
}
