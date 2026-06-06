import { MedusaModule } from "@zjedene-medusa/framework/modules-sdk"
import {
  ExternalModuleDeclaration,
  ICacheService,
  InternalModuleDeclaration,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { RedisCacheModuleOptions } from "../types"

export const initialize = async (
  options?: RedisCacheModuleOptions | ExternalModuleDeclaration
): Promise<ICacheService> => {
  const serviceKey = Modules.CACHE
  const loaded = await MedusaModule.bootstrap<ICacheService>({
    moduleKey: serviceKey,
    defaultPath: "@zjedene-medusa/cache-redis",
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
  })

  return loaded[serviceKey]
}
