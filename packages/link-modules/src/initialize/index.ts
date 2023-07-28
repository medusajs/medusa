import * as linkDefinitions from "../definitions"

import {
  ExternalModuleDeclaration,
  InternalModuleDeclaration,
  MODULE_PACKAGE_NAMES,
  MedusaModule,
  Modules,
} from "@medusajs/modules-sdk"
import {
  IProductModuleService,
  JoinerRelationship,
  LoadedModule,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
  ModuleDefinition,
  ModuleExports,
  ModuleJoinerConfig,
  ModulesSdkTypes,
} from "@medusajs/types"
import { kebabCase, lowerCaseFirst, toPascalCase } from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"
import { InitializeModuleInjectableDependencies } from "../types"
import { composeLinkName } from "../utils"

//import { moduleDefinition } from "../module-definition"

console.log(JSON.stringify(linkDefinitions, null, 2))

type ILinkModule = {}

function getLinkModuleInstance(serviceKey) {
  return {
    service: {} as any,
    loaders: [] as any,
  }
}

function getClass(...properties) {
  return class {
    constructor(...values) {
      properties.forEach((name, idx) => {
        this[name] = values[idx]
      })
    }
  }
}

function generateEntity(
  primary: JoinerRelationship,
  foreign: JoinerRelationship
) {
  const fieldNames = primary.foreignKey
    .split(",")
    .concat(foreign.foreignKey.split(","))

  const fields = fieldNames.reduce((acc, curr) => {
    acc[curr] = {
      type: "string",
      nullable: false,
    }
    return acc
  }, {})

  return new EntitySchema({
    class: getClass(
      ...fieldNames.concat("created_at", "updated_at", "deleted_at")
    ) as any,
    properties: {
      ...fields,
      created_at: {
        type: "Date",
        default: "CURRENT_TIMESTAMP",
        nullable: false,
      },
      updated_at: {
        type: "Date",
        default: "CURRENT_TIMESTAMP",
        nullable: false,
      },
      deleted_at: { type: "Date", nullable: true },
    },
    indexes: [
      {
        properties: primary.foreignKey.includes(",")
          ? primary.foreignKey.split(",")
          : primary.foreignKey,
        name: "IDX_" + primary.foreignKey.split(",").join("_"),
      },
      {
        properties: foreign.foreignKey.includes(",")
          ? foreign.foreignKey.split(",")
          : foreign.foreignKey,
        name: "IDX_" + foreign.foreignKey.split(",").join("_"),
      },
    ],
  })
}

export const initialize = async (
  options?:
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration,
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
        `Link module ${definition.serviceName} must have exactly 2 relationships.`
      )
    }

    if (definition.isReadOnlyLink) {
      continue
    }

    const [primary, foreign] = definition.relationships ?? []
    const serviceKey =
      definition.serviceName ??
      composeLinkName(
        primary.serviceName,
        primary.foreignKey,
        foreign.serviceName,
        foreign.foreignKey
      )

    if (modulesLoadedKeys.includes(serviceKey)) {
      continue
    } else if (serviceKey in allLinks) {
      throw new Error(`Link module ${serviceKey} already exists.`)
    }

    console.log(generateEntity(primary, foreign))

    /*
    const moduleDefinition = getLinkModuleInstance(serviceKey) as ModuleExports

    const loaded = await MedusaModule.bootstrap<ILinkModule>(
      serviceKey,
      MODULE_PACKAGE_NAMES[Modules.LINK_MODULE],
      options as InternalModuleDeclaration | ExternalModuleDeclaration,
      moduleDefinition,
      injectedDependencies
    )

    allLinks[serviceKey] = Object.values(loaded)[0]
    */
  }

  return allLinks
}

initialize()
