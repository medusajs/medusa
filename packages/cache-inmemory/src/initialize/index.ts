import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import { ICacheService } from "@medusajs/types"
import { InMemoryCacheModuleOptions } from "../types"

export const initialize = async (
  options?: InMemoryCacheModuleOptions | ExternalModuleDeclaration
): Promise<ICacheService> => {
  const serviceKey = Modules.CACHE
  const loaded = await MedusaModule.bootstrap(
    serviceKey,
    "@medusajs/cache-inmemory",
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    undefined
  )

  return loaded[serviceKey] as ICacheService
}
