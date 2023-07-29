import * as linkDefinitions from "../definitions"

import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_PACKAGE_NAMES,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import {
  JoinerRelationship,
  LoaderOptions,
  ModuleExports,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/types"

import { InitializeModuleInjectableDependencies } from "../types"
import { composeLinkName } from "../utils"
import { getLoaders } from "../loaders"
import { getMigration } from "../migration"
import { getModuleService } from "@services"
import { lowerCaseFirst } from "@medusajs/utils"

//import { moduleDefinition } from "../module-definition"

type ILinkModule = {}

function getLinkModuleInstance(
  joinerConfig,
  primary: JoinerRelationship,
  foreign: JoinerRelationship
) {
  return {
    service: getModuleService(joinerConfig),
    loaders: getLoaders({
      joinerConfig,
      primary,
      foreign,
    }),
  }
}

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  modulesDefinition?: ModuleJoinerConfig[],
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<ILinkModule> => {
  const allLinks = {}
  const modulesLoadedKeys = MedusaModule.getLoadedModules().map(
    (mod) => Object.keys(mod)[0]
  )

  const allLinksToLoad = Object.values(linkDefinitions).concat(
    modulesDefinition ?? []
  )

  for (const definition of allLinksToLoad) {
    if (definition.relationships?.length !== 2 && !definition.isReadOnlyLink) {
      throw new Error(
        `Link module ${definition.serviceName} must have 2 relationships.`
      )
    }

    if (definition.isReadOnlyLink) {
      // TODO: register links that only exports a joiner extending other services
      continue
    }

    const [primary, foreign] = definition.relationships ?? []
    const serviceKey = lowerCaseFirst(
      definition.serviceName ??
        composeLinkName(
          primary.serviceName,
          primary.foreignKey,
          foreign.serviceName,
          foreign.foreignKey
        )
    )

    if (modulesLoadedKeys.includes(serviceKey)) {
      continue
    } else if (serviceKey in allLinks) {
      throw new Error(`Link module ${serviceKey} already exists.`)
    }

    if (
      !modulesLoadedKeys.includes(primary.serviceName) ||
      !modulesLoadedKeys.includes(foreign.serviceName)
    ) {
      console.log(
        "Missing module:",
        primary.serviceName,
        ":",
        modulesLoadedKeys.includes(primary.serviceName),
        foreign.serviceName,
        ":",
        modulesLoadedKeys.includes(foreign.serviceName)
      )
      //continue
    }

    const moduleDefinition = getLinkModuleInstance(
      definition,
      primary,
      foreign
    ) as ModuleExports

    const loaded = await MedusaModule.bootstrap<ILinkModule>(
      Modules.LINK_MODULE,
      MODULE_PACKAGE_NAMES[Modules.LINK_MODULE],
      options as InternalModuleDeclaration | ExternalModuleDeclaration,
      moduleDefinition,
      injectedDependencies
    )

    allLinks[serviceKey] = Object.values(loaded)[0]
  }

  return allLinks
}

export async function runMigrations(
  { options, logger }: Omit<LoaderOptions, "container">,
  modulesDefinition?: ModuleJoinerConfig[]
) {
  const modulesLoadedKeys = MedusaModule.getLoadedModules().map(
    (mod) => Object.keys(mod)[0]
  )

  const allLinksToLoad = Object.values(linkDefinitions).concat(
    modulesDefinition ?? []
  )

  const allLinks = new Set<string>()
  for (const definition of allLinksToLoad) {
    if (definition.relationships?.length !== 2 && !definition.isReadOnlyLink) {
      throw new Error(
        `Link module ${definition.serviceName} must have 2 relationships.`
      )
    }

    if (definition.isReadOnlyLink) {
      continue
    }

    const [primary, foreign] = definition.relationships ?? []
    const serviceKey = lowerCaseFirst(
      definition.serviceName ??
        composeLinkName(
          primary.serviceName,
          primary.foreignKey,
          foreign.serviceName,
          foreign.foreignKey
        )
    )

    if (modulesLoadedKeys.includes(serviceKey)) {
      continue
    } else if (allLinks.has(serviceKey)) {
      throw new Error(`Link module ${serviceKey} already exists.`)
    }

    allLinks.add(serviceKey)

    if (
      !modulesLoadedKeys.includes(primary.serviceName) ||
      !modulesLoadedKeys.includes(foreign.serviceName)
    ) {
      //continue
    }

    const migrate = getMigration(serviceKey, primary, foreign)
    await migrate({ options, logger })
  }
}
