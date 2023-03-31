import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { ICacheService } from "@medusajs/types"
import { RedisCacheModuleOptions } from "../types"

export const initialize = async (
  options?: RedisCacheModuleOptions | ExternalModuleDeclaration
): Promise<ICacheService> => {
  const serviceKey = Modules.CACHE
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/cache-redis",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    undefined
  )

  return loaded[serviceKey] as ICacheService
}
