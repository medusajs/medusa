import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
} from "@medusajs/modules-sdk"
import { ICacheService } from "@medusajs/types"
import { InMemoryCacheModuleOptions } from "../types"
import { Modules } from "@medusajs/utils"

export const initialize = async (
  options?: InMemoryCacheModuleOptions | ExternalModuleDeclaration
): Promise<ICacheService> => {
  const serviceKey = Modules.CACHE
  const loaded = await MedusaModule.bootstrap<ICacheService>({
    moduleKey: serviceKey,
    defaultPath: "@medusajs/cache-inmemory",
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
  })

  return loaded[serviceKey]
}
