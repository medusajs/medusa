import {
  InternalModuleDeclaration,
  MedusaModule,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"
import {
  ExternalModuleDeclaration,
  ILinkModule,
  LinkModuleDefinition,
  ModuleExports,
  ModuleJoinerConfig,
  ModuleServiceInitializeCustomDataLayerOptions,
  ModuleServiceInitializeOptions,
} from "@medusajs/types"
import {
  arrayDifference,
  ContainerRegistrationKeys,
  lowerCaseFirst,
  ModuleRegistrationName,
  simpleHash,
  toPascalCase,
} from "@medusajs/utils"
import * as linkDefinitions from "../definitions"
import { MigrationsExecutionPlanner } from "../migration"
import { InitializeModuleInjectableDependencies } from "../types"
import {
  composeLinkName,
  composeTableName,
  generateGraphQLSchema,
} from "../utils"
import { getLinkModuleDefinition } from "./module-definition"

export const initialize = async (
  options?:
    | ModuleServiceInitializeOptions
    | ModuleServiceInitializeCustomDataLayerOptions
    | ExternalModuleDeclaration
    | InternalModuleDeclaration,
  pluginLinksDefinitions?: ModuleJoinerConfig[],
  injectedDependencies?: InitializeModuleInjectableDependencies
): Promise<{ [link: string]: ILinkModule }> => {
  const allLinks = {}
  const modulesLoadedKeys = MedusaModule.getLoadedModules().map(
    (mod) => Object.keys(mod)[0]
  )

  const allLinksToLoad = Object.values(linkDefinitions).concat(
    pluginLinksDefinitions ?? []
  )

  for (const linkDefinition of allLinksToLoad) {
    const definition: ModuleJoinerConfig = JSON.parse(
      JSON.stringify(linkDefinition)
    )

    const [primary, foreign] = definition.relationships ?? []

    if (definition.relationships?.length !== 2 && !definition.isReadOnlyLink) {
      throw new Error(
        `Link module ${definition.serviceName} can only link 2 modules.`
      )
    } else if (
      foreign?.foreignKey?.split(",").length > 1 &&
      !definition.isReadOnlyLink
    ) {
      throw new Error(`Foreign key cannot be a composed key.`)
    }

    if (Array.isArray(definition.extraDataFields)) {
      const extraDataFields = definition.extraDataFields
      const definedDbFields = Object.keys(
        definition.databaseConfig?.extraFields || {}
      )
      const difference = arrayDifference(extraDataFields, definedDbFields)

      if (difference.length) {
        throw new Error(
          `extraDataFields (fieldNames: ${difference.join(
            ","
          )}) need to be configured under databaseConfig (serviceName: ${
            definition.serviceName
          }).`
        )
      }
    }

    const serviceKey = !definition.isReadOnlyLink
      ? lowerCaseFirst(
          definition.serviceName ??
            composeLinkName(
              primary.serviceName,
              primary.foreignKey,
              foreign.serviceName,
              foreign.foreignKey
            )
        )
      : simpleHash(JSON.stringify(definition.extends))

    if (modulesLoadedKeys.includes(serviceKey)) {
      continue
    } else if (serviceKey in allLinks) {
      throw new Error(`Link module ${serviceKey} already defined.`)
    }

    if (definition.isReadOnlyLink) {
      const extended: any[] = []
      for (const extension of definition.extends ?? []) {
        if (
          modulesLoadedKeys.includes(extension.serviceName) &&
          modulesLoadedKeys.includes(extension.relationship.serviceName)
        ) {
          extended.push(extension)
        }
      }

      definition.extends = extended
      if (extended.length === 0) {
        continue
      }
    } else if (
      !modulesLoadedKeys.includes(primary.serviceName) ||
      !modulesLoadedKeys.includes(foreign.serviceName)
    ) {
      continue
    }

    const logger =
      injectedDependencies?.[ContainerRegistrationKeys.LOGGER] ?? console

    definition.schema = generateGraphQLSchema(definition, primary, foreign, {
      logger,
    })

    if (!Array.isArray(definition.alias)) {
      definition.alias = definition.alias ? [definition.alias] : []
    }

    for (const alias of definition.alias) {
      alias.args ??= {}

      alias.args.entity = toPascalCase(
        "Link_" +
          (definition.databaseConfig?.tableName ??
            composeTableName(
              primary.serviceName,
              primary.foreignKey,
              foreign.serviceName,
              foreign.foreignKey
            ))
      )
    }

    const moduleDefinition = getLinkModuleDefinition(
      definition,
      primary,
      foreign
    ) as ModuleExports

    const linkModuleDefinition: LinkModuleDefinition = {
      key: serviceKey,
      registrationName: serviceKey,
      label: serviceKey,
      dependencies: [ModuleRegistrationName.EVENT_BUS],
      defaultModuleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: injectedDependencies?.[
          ContainerRegistrationKeys.PG_CONNECTION
        ]
          ? MODULE_RESOURCE_TYPE.SHARED
          : MODULE_RESOURCE_TYPE.ISOLATED,
      },
    }

    const loaded = await MedusaModule.bootstrapLink({
      definition: linkModuleDefinition,
      declaration: options as InternalModuleDeclaration,
      moduleExports: moduleDefinition,
      injectedDependencies,
    })

    allLinks[serviceKey as string] = Object.values(loaded)[0]
  }

  return allLinks
}

/**
 * Prepare an execution plan and run the migrations accordingly.
 * It includes creating, updating, deleting the tables according to the execution plan.
 * If any unsafe sql is identified then we will notify the user to act manually.
 *
 * @param options
 * @param pluginLinksDefinition
 */
export function getMigrationPlanner(
  options: ModuleServiceInitializeOptions,
  pluginLinksDefinition?: ModuleJoinerConfig[]
) {
  const modulesLoadedKeys = MedusaModule.getLoadedModules().map(
    (mod) => Object.keys(mod)[0]
  )

  const allLinksToLoad = Object.values(linkDefinitions).concat(
    pluginLinksDefinition ?? []
  )

  const allLinks = new Set<string>()
  for (const definition of allLinksToLoad) {
    if (definition.isReadOnlyLink) {
      continue
    }

    if (definition.relationships?.length !== 2) {
      throw new Error(
        `Link module ${definition.serviceName} must have 2 relationships.`
      )
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

    if (allLinks.has(serviceKey)) {
      throw new Error(`Link module ${serviceKey} already exists.`)
    }

    allLinks.add(serviceKey)

    if (
      !modulesLoadedKeys.includes(primary.serviceName) ||
      !modulesLoadedKeys.includes(foreign.serviceName)
    ) {
      continue
    }
  }

  return new MigrationsExecutionPlanner(allLinksToLoad, options)
}
