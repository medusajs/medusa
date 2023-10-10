import {
  cleanGraphQLSchema,
  getFieldsAndRelations,
  MedusaModule,
} from "@medusajs/modules-sdk"
import { ObjectTypeDefinitionNode } from "graphql/index"
import { toCamelCase } from "@medusajs/utils"
import { JoinerServiceConfigAlias } from "@medusajs/types"
import { makeExecutableSchema } from "@graphql-tools/schema"

export const CustomDirectives = {
  Listeners: {
    configurationPropertyName: "listeners",
    isRequired: true,
    name: "Listeners",
    directive: "@Listeners",
    definition: "directive @Listeners (values: [String!]) on OBJECT",
  },
}

function makeSchemaExecutable(inputSchema: string) {
  const { schema: cleanedSchema } = cleanGraphQLSchema(inputSchema)
  return makeExecutableSchema({ typeDefs: cleanedSchema })
}

function retrieveLinkedEntityNameAndAliasFromLinkModule(
  linkModuleJoinerConfig,
  relatedModuleJoinerConfig
) {
  const linkRelationships = linkModuleJoinerConfig.relationships
  const linkRelationship = linkRelationships.find((relationship) => {
    return relatedModuleJoinerConfig.serviceName === relationship.serviceName
  })

  const foreignKey = linkRelationship.foreignKey

  let alias
  let entityName

  const linkableKeys = relatedModuleJoinerConfig.linkableKeys
  entityName = linkableKeys[foreignKey]

  if (!entityName) {
    throw new Error(
      `CatalogModule error, unable to retrieve the entity name from the link module configuration for the linkable key ${foreignKey}.`
    )
  }

  const moduleAliases = relatedModuleJoinerConfig.alias

  if (moduleAliases) {
    alias = retrieveAliasForEntity(
      entityName,
      relatedModuleJoinerConfig.serviceName,
      relatedModuleJoinerConfig.alias
    )
  }

  if (!alias) {
    throw new Error(
      `CatalogModule error, the module ${relatedModuleJoinerConfig.serviceName} has a schema but does not have any alias for the entity ${entityName}. Please add an alias to the module configuration and the entity it correspond to in the args under the entity property.`
    )
  }

  return { entityName, alias }
}

function retrieveAliasForEntity(entityName, serviceName, aliases) {
  aliases = Array.isArray(aliases) ? aliases : [aliases]

  aliases = aliases.filter(Boolean)

  aliases = aliases
    .filter(Boolean)
    .map((alias) => {
      const names = Array.isArray(alias?.name) ? alias?.name : [alias?.name]
      return names?.map((name) => ({
        name,
        args: alias?.args,
      }))
    })
    .flat() as JoinerServiceConfigAlias[]

  let alias = aliases.find((alias) => {
    const curEntity = alias!.args?.entity || alias?.name
    return curEntity && curEntity.toLowerCase() === entityName.toLowerCase()
  })
  alias = alias?.name

  return alias
}

function retrieveModuleAndAlias(entityName, moduleJoinerConfigs) {
  let relatedModule
  let alias

  for (const moduleJoinerConfig of moduleJoinerConfigs) {
    const moduleSchema = moduleJoinerConfig.schema
    const moduleAliases = moduleJoinerConfig.alias

    /**
     * If the entity exist in the module schema, then the current module is the
     * one we are looking for.
     *
     * If the module does not have any schema, then we need to base the search
     * on the provided aliases. in any case, we try to get both
     */

    if (moduleSchema) {
      const executableSchema = makeSchemaExecutable(moduleSchema)
      const entitiesMap = executableSchema.getTypeMap()

      if (entitiesMap[entityName]) {
        relatedModule = moduleJoinerConfig
      }
    }

    if (moduleAliases) {
      alias = retrieveAliasForEntity(
        entityName,
        moduleJoinerConfig.serviceName,
        moduleJoinerConfig.alias
      )

      if (alias) {
        relatedModule = moduleJoinerConfig
      }
    }

    if (relatedModule) {
      break
    }
  }

  if (!relatedModule) {
    throw new Error(
      `CatalogModule error, unable to retrieve the module that correspond to the entity ${entityName}. Please add the entity to the module schema or add an alias to the module configuration and the entity it correspond to in the args under the entity property.`
    )
  }

  if (!alias) {
    throw new Error(
      `CatalogModule error, the module ${relatedModule?.serviceName} has a schema but does not have any alias for the entity ${entityName}. Please add an alias to the module configuration and the entity it correspond to in the args under the entity property.`
    )
  }

  return { relatedModule, alias }
}

function retrieveLinkModuleAndAlias(
  entityServiceName,
  parentEntityServiceName,
  moduleJoinerConfigs
) {
  let relatedModule
  let alias
  let entityName

  for (const moduleJoinerConfig of moduleJoinerConfigs.filter(
    (config) => config.isLink
  )) {
    const linkPrimary = moduleJoinerConfig.relationships[0]
    const linkForeign = moduleJoinerConfig.relationships[1]

    if (
      linkPrimary.serviceName === parentEntityServiceName &&
      linkForeign.serviceName === entityServiceName
    ) {
      relatedModule = moduleJoinerConfig
      alias = moduleJoinerConfig.alias[0].name
      alias = Array.isArray(alias) ? alias[0] : alias
    }
  }

  if (!relatedModule) {
    throw new Error(
      `CatalogModule error, unable to retrieve the link module that correspond to the services ${parentEntityServiceName} - ${entityServiceName}.`
    )
  }

  return { relatedModule, alias }
}

function getObjectConfigurationRef(entityName, { objectConfigurationRef }) {
  return (objectConfigurationRef[entityName] ??= {
    entity: entityName,
    parents: [],
    alias: "",
    listeners: [],
    moduleConfig: null,
    fields: [],
  })
}

function setCustomDirectives(currentObjectConfigurationRef, directives) {
  for (const customDirectiveConfiguration of Object.values(CustomDirectives)) {
    const directive = directives.find(
      (typeDirective) =>
        typeDirective.name.value === customDirectiveConfiguration.name
    )

    if (!directive) {
      if (customDirectiveConfiguration.isRequired) {
        throw new Error(
          `CatalogModule error, the type ${currentObjectConfigurationRef.entity} defined in the schema is missing the ${customDirectiveConfiguration.directive} directive which is required`
        )
      }

      return
    }

    // Only support array directive value for now
    currentObjectConfigurationRef[
      customDirectiveConfiguration.configurationPropertyName
    ] = ((directive.arguments[0].value as any)?.values ?? []).map(
      (v) => v.value
    )
  }
}

function processEntity(
  entityName,
  { entitiesMap, moduleJoinerConfigs, objectConfigurationRef }
) {
  /**
   * Get the reference to the object configuration for the current entity.
   */

  const currentObjectConfigurationRef = getObjectConfigurationRef(entityName, {
    objectConfigurationRef,
  })

  /**
   * Retrieve and set the custom directives for the current entity.
   */

  setCustomDirectives(
    currentObjectConfigurationRef,
    entitiesMap[entityName].astNode?.directives ?? []
  )

  currentObjectConfigurationRef.fields = getFieldsAndRelations(
    entitiesMap,
    entityName
  )

  /**
   * Retrieve the module and alias for the current entity.
   */

  const { relatedModule: currentEntityModule, alias } = retrieveModuleAndAlias(
    entityName,
    moduleJoinerConfigs
  )

  currentObjectConfigurationRef.moduleConfig = currentEntityModule
  currentObjectConfigurationRef.alias = alias

  /**
   * Retrieve the parent entities for the current entity.
   */

  const schemaParentEntity = Object.values(entitiesMap).filter((value: any) => {
    return (
      value.astNode &&
      (value.astNode as ObjectTypeDefinitionNode).fields?.some((field) => {
        return (field.type as any)?.type?.name?.value === entityName
      })
    )
  })

  /**
   * If the current entity has parent entities, then we need to process them.
   */

  if (schemaParentEntity.length) {
    const parentEntityNames = schemaParentEntity.map((parent: any) => {
      return parent.name
    })

    for (const parent of parentEntityNames) {
      /**
       * Retrieve the parent entity field in the schema
       */

      const entityFieldInParent = (
        entitiesMap[parent].astNode as any
      )?.fields?.find((field) => {
        return (field.type as any)?.type?.name?.value === entityName
      })

      const isEntityListInParent = entityFieldInParent.type.kind === "ListType"
      const entityTargetPropertyNameInParent = entityFieldInParent.name.value

      /**
       * Retrieve the parent entity object configuration reference.
       */

      const parentObjectConfigurationRef = getObjectConfigurationRef(parent, {
        objectConfigurationRef,
      })
      const parentModuleConfig = parentObjectConfigurationRef.moduleConfig

      /**
       * If the parent entity and the current entity are part of the same servive then configure the parent and
       * add the parent id as a field to the current entity.
       */

      if (
        currentObjectConfigurationRef.moduleConfig.serviceName ===
          parentModuleConfig.serviceName ||
        parentModuleConfig.isLink
      ) {
        currentObjectConfigurationRef.parents.push({
          ref: parentObjectConfigurationRef,
          targetProp: entityTargetPropertyNameInParent,
          isList: isEntityListInParent,
        })

        currentObjectConfigurationRef.fields.push(
          parentObjectConfigurationRef.alias + ".id"
        )
      } else {
        /**
         * If the parent entity and the current entity are not part of the same service then we need to
         * find the link module that join them.
         */

        const { relatedModule: linkModule, alias: linkAlias } =
          retrieveLinkModuleAndAlias(
            currentObjectConfigurationRef.moduleConfig.serviceName,
            parentModuleConfig.serviceName,
            moduleJoinerConfigs
          )

        const linkObjectConfigurationRef = getObjectConfigurationRef(
          linkAlias,
          { objectConfigurationRef }
        )

        /**
         * Add the schema parent entity as a parent to the link module and configure it.
         */

        linkObjectConfigurationRef.parents = [
          {
            ref: parentObjectConfigurationRef,
          },
        ]
        linkObjectConfigurationRef.alias = linkAlias
        linkObjectConfigurationRef.listeners = [
          `${toCamelCase(linkAlias)}.attached`,
          `${toCamelCase(linkAlias)}.detached`,
        ]
        linkObjectConfigurationRef.moduleConfig = linkModule
        linkObjectConfigurationRef.fields = [
          ...linkModule.relationships
            .map(
              (relationship) =>
                [
                  parentModuleConfig.serviceName,
                  currentEntityModule.serviceName,
                ].includes(relationship.serviceName) && relationship.foreignKey
            )
            .filter(Boolean),
          parentObjectConfigurationRef.alias + ".id",
        ]

        /**
         * If the current entity is not the entity that is used to join the link module and the parent entity
         * then we need to add the new entity that join them and then add the link as its parent
         * before setting the new entity as the true parent of the current entity.
         */

        let linkedEntityObjectConfigurationRef
        if (currentObjectConfigurationRef.alias !== linkAlias) {
          const linkedEntityNameAndAlias =
            retrieveLinkedEntityNameAndAliasFromLinkModule(
              linkModule,
              currentEntityModule
            )

          const {
            relatedModule: linkedEntityModule,
            alias: linkedEntityAlias,
          } = retrieveModuleAndAlias(
            linkedEntityNameAndAlias.entityName,
            moduleJoinerConfigs
          )

          linkedEntityObjectConfigurationRef = getObjectConfigurationRef(
            linkedEntityNameAndAlias.entityName,
            { objectConfigurationRef }
          )

          linkedEntityObjectConfigurationRef.parents.push({
            ref: linkObjectConfigurationRef,
            targetProp: linkedEntityNameAndAlias.alias,
            isList: true,
          })

          linkedEntityObjectConfigurationRef.alias =
            linkedEntityNameAndAlias.alias
          linkedEntityObjectConfigurationRef.listeners = [
            toCamelCase(linkedEntityAlias) + ".created",
            toCamelCase(linkedEntityAlias) + ".updated",
          ]
          linkedEntityObjectConfigurationRef.moduleConfig = linkedEntityModule
          linkedEntityObjectConfigurationRef.fields = [
            "id",
            linkObjectConfigurationRef.alias + ".id",
          ]
        }

        currentObjectConfigurationRef.parents.push({
          ref: linkedEntityObjectConfigurationRef || linkObjectConfigurationRef,
          inConfiguration: parentObjectConfigurationRef,
          targetProp: entityTargetPropertyNameInParent,
          isList: isEntityListInParent,
        })

        currentObjectConfigurationRef.fields.push(
          (linkedEntityObjectConfigurationRef || linkObjectConfigurationRef)
            .alias + ".id"
        )
      }
    }
  }
}

/**
 * This util build an internal configuration object from the provided schema.
 * It will resolve all modules, fields, link module configuration to build
 * the appropriate configuration for the catalog module.
 *
 * This configuration will be used to re construct the expected output object from a search
 * but can also be used for anything since the relation tree is available through ref.
 *
 * @param schema
 */
export function buildFullConfigurationFromSchema(schema) {
  const moduleJoinerConfigs = MedusaModule.getAllJoinerConfigs()
  const augmentedSchema = CustomDirectives.Listeners.definition + schema
  const executableSchema = makeSchemaExecutable(augmentedSchema)
  const entitiesMap = executableSchema.getTypeMap()

  const objectConfiguration = {}

  Object.keys(entitiesMap).forEach((entityName) => {
    if (!entitiesMap[entityName].astNode) {
      return
    }

    processEntity(entityName, {
      entitiesMap,
      moduleJoinerConfigs,
      objectConfigurationRef: objectConfiguration,
    })
  })

  return objectConfiguration
}
