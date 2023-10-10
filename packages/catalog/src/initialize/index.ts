import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import {
  IEventBusModuleService,
  IProductModuleService,
  RemoteJoinerQuery,
} from "@medusajs/types"

import { moduleDefinition } from "../module-definition"
import { CatalogModuleOptions } from "../types"

export const initialize = async (
  options:
    | CatalogModuleOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies: {
    eventBusModuleService: IEventBusModuleService
    remoteQuery: (
      query: string | RemoteJoinerQuery | object,
      variables?: Record<string, unknown>
    ) => Promise<any>
  }
): Promise<IProductModuleService> => {
  if (!injectedDependencies?.eventBusModuleService) {
    throw new Error(
      "CatalogModule is missing the eventBusModuleService dependency to work"
    )
  }

  if (!injectedDependencies?.remoteQuery) {
    throw new Error(
      "CatalogModule is missing the remoteQuery dependency to work"
    )
  }

  const serviceKey = Modules.PRODUCT

  const loaded = await MedusaModule.bootstrap<IProductModuleService>(
    serviceKey,
    MODULE_PACKAGE_NAMES[Modules.PRODUCT],
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleDefinition,
    injectedDependencies
  )

  return loaded[serviceKey]
}
