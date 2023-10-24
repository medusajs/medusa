import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_PACKAGE_NAMES,
  Modules,
} from "@medusajs/modules-sdk"
import { IEventBusModuleService, RemoteJoinerQuery } from "@medusajs/types"

import { SearchModuleService } from "@services"
import { moduleDefinition } from "../module-definition"
import { SearchModuleOptions } from "../types"

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

  const loaded = await MedusaModule.bootstrap<SearchModuleService>({
    moduleKey: serviceKey,
    defaultPath: MODULE_PACKAGE_NAMES[Modules.SEARCH],
    declaration: options as
      | InternalModuleDeclaration
      | ExternalModuleDeclaration,
    injectedDependencies,
    moduleExports: moduleDefinition,
  })

  return loaded[serviceKey]
}
