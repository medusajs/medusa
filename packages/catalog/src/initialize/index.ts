import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusModuleService, RemoteJoinerQuery } from "@medusajs/types"

import { moduleDefinition } from "../module-definition"
import { CatalogModuleOptions } from "../types"
import { CatalogModuleService } from "@services"

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
): Promise<CatalogModuleService> => {
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

  const serviceKey = Modules.CATALOG

  const loaded = await MedusaModule.bootstrap<CatalogModuleService>(
    serviceKey,
    MODULE_PACKAGE_NAMES[Modules.CATALOG],
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleDefinition,
    injectedDependencies
  )

  return loaded[serviceKey]
}
