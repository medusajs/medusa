import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusModuleService, RemoteJoinerQuery } from "@medusajs/types"

import { moduleDefinition } from "../module-definition"
import { SearchModuleOptions } from "../types"
import { SearchModuleService } from "@services"

export const initialize = async (
  options:
    | SearchModuleOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  injectedDependencies: {
    eventBusModuleService: IEventBusModuleService
    remoteQuery: (
      query: string | RemoteJoinerQuery | object,
      variables?: Record<string, unknown>
    ) => Promise<any>
  }
): Promise<SearchModuleService> => {
  if (!injectedDependencies?.eventBusModuleService) {
    throw new Error(
      "SearchModule is missing the eventBusModuleService dependency to work"
    )
  }

  if (!injectedDependencies?.remoteQuery) {
    throw new Error(
      "SearchModule is missing the remoteQuery dependency to work"
    )
  }

  const serviceKey = Modules.SEARCH

  const loaded = await MedusaModule.bootstrap<SearchModuleService>(
    serviceKey,
    MODULE_PACKAGE_NAMES[Modules.SEARCH],
    options as InternalModuleDeclaration | ExternalModuleDeclaration,
    moduleDefinition,
    injectedDependencies
  )

  return loaded[serviceKey]
}
