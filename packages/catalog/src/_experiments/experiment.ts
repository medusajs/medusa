import { makeExecutableSchema } from "@graphql-tools/schema"
import {
  cleanGraphQLSchema,
  getFieldsAndRelations,
  MedusaApp,
  MedusaModule,
} from "@medusajs/modules-sdk"
import { JoinerServiceConfigAlias } from "@medusajs/types"
import { ObjectTypeDefinitionNode } from "graphql/index"
import {
  ContainerRegistrationKeys,
  ModulesSdkUtils,
  toCamelCase,
} from "@medusajs/utils"
import { joinerConfig } from "./joiner-config"
import modulesConfig from "./modules-config"

const CustomDirectives = {
  Listeners: {
    name: "Listeners",
    definition: "directive @Listeners (values: [String!]) on OBJECT",
  },
}

/*
parents: { ref: objectRef, targetProp, isList }[]
{
  Product: {
    alias: "product",
    listeners: ["product.created", "product.updated"],
    fields: ["id", "title"],
  },

  Variant: {
    alias: "variant",
    parents: ["Product"],
    listeners: ["variants.created", "variants.updated"],
    fields: ["id", "title", "product.id"],
  },

  PriceSet: {
    alias: "price_set",
    listeners: ["priceset.created", "priceset.updated"],
    fields: ["id"]
  },

  MoneyAmount: {
    parents: ["PriceSet"],
    alias: "price",
    fields: ["amount", "price_set.id"],
    listeners: ["prices.created", "prices.updated"],
  },

  PriceSetVariant: {
    parents: ["Variant", "PriceSet"],
    is_link: true,
    alias: "priceSet",
    listeners: ["pricingLink.attach", "pricingLink.detach"],
    fields: ["price_set.id", "extra_fields", "variant.id"],
  },
}
*/

const configMock2 = {
  schema: `
      """
      type Product @deactivateListeners(values: ["product.created", "product.updated"]) {
        id: string
      }
      """
  
      type Product @Listeners(values: ["product.created", "product.updated"]) {
        id: String
        title: String
        variants: [ProductVariant]
      }
      
      type ProductVariant @Listeners(values: ["variants.created", "variants.updated"]) {
        id: String
        product_id: String
        sku: String
        money_amounts: [MoneyAmount]
      }
      
      type MoneyAmount @Listeners(values: ["prices.created", "prices.updated"]) {
        amount: Int
      }
  `,
}

// TODO: rm, only used for medusa app which will be removed
const pgConnection = ModulesSdkUtils.createPgConnection({
  clientUrl: "postgres://postgres@localhost:5432/medusa",
  schema: "public",
})

const injectedDependencies = {
  [ContainerRegistrationKeys.PG_CONNECTION]: pgConnection,
}
// TODO: end of previous todo

function makeSchemaExecutable(inputSchema) {
  const { schema: cleanedSchema } = cleanGraphQLSchema(inputSchema)
  return makeExecutableSchema({ typeDefs: cleanedSchema })
}

/*const buildObjectConfigurationFromGraphQlSchema = async (schema) => {
  /!**
   * This is just to mock the modules after they have been loaded
   * TODO: remove
   *!/

  await MedusaApp({
    modulesConfig,
    servicesConfig: joinerConfig,
    injectedDependencies,
  })

  const moduleJoinerConfigs = MedusaModule.getAllJoinerConfigs()

  /!**
   * End of the above mock.
   *!/

  // Prepend the @Listeners directive to make it available for graphQL
  const augmentedSchema = CustomDirectives.Listeners.definition + schema

  const executableSchema = makeSchemaExecutable(augmentedSchema)
  const entitiesMap = executableSchema.getTypeMap()

  /!**
   * Start building the internal object configuration from the schema and the information
   * we have about the modules and link modules.
   *!/

  const objectConfiguration = {}

  Object.keys(entitiesMap).forEach((entityName) => {
    if (!entitiesMap[entityName].astNode) {
      return
    }

    const currentObjectConfigurationRef = (objectConfiguration[entityName] ??= {
      entity: entityName,
      parents: [],
      alias: "",
      listeners: [],
      moduleConfig: null,
      fields: [],
    })

    /!**
     * Retrieve the directive @Listeners to set it on the object configuration
     *!/

    const listenerDirective = entitiesMap[entityName].astNode?.directives?.find(
      (directive: any) => {
        return (directive.value = CustomDirectives.Listeners.name)
      }
    )

    if (!listenerDirective) {
      // TODO: maybe re visit that error and condition when discussion the deactivation
      throw new Error(
        "CatalogModule error, a type is defined in the schema configuration but it is missing the @Listeners directive to specify which events to listen to in order to sync the data"
      )
    }

    currentObjectConfigurationRef.listeners = (
      (listenerDirective?.arguments?.[0].value as any).values ?? []
    ).map((v) => v.value)

    /!**
     * Get all the fields from the current type without any relation fields
     *!/

    currentObjectConfigurationRef.fields = getFieldsAndRelations(
      entitiesMap,
      entityName
    )

    /!**
     * This step will assign the related module config to the current entity.
     * In a later step we will be able to verify if the parent and child are part of
     * the same module or not in order to mutate the configuration and
     * apply the correct configuration.
     *!/

    const { relatedModule: currentEntityModule, alias } =
      retrieveModuleAndAlias(entityName, moduleJoinerConfigs)
    currentObjectConfigurationRef.moduleConfig = currentEntityModule
    currentObjectConfigurationRef.alias = alias

    /!**
     * Retrieve immediate parent in the provided schema configuration.
     * This is different from the real parent based on the module configuration, especially
     * if there is any link involved
     *!/

    const schemaParentEntityNames = Object.values(entitiesMap).filter(
      (value) => {
        return (
          value.astNode &&
          (value.astNode as ObjectTypeDefinitionNode).fields?.some((field) => {
            return (field.type as any)?.type?.name?.value === entityName
          })
        )
      }
    )

    /!**
     * If there is any parent, look for their module appartenance. If they are part of the same module
     * Add the parent configuration to the entity configuration. Otherwise, we need to look for the link
     * and manage to create the appropriate configuration.
     *!/

    if (schemaParentEntityNames.length) {
      const parentEntityNames = schemaParentEntityNames.map((parent) => {
        return parent.name
      })

      for (const parent of parentEntityNames) {
        const entityFieldInParent = (
          entitiesMap[parent].astNode as any
        )?.fields?.find((field) => {
          return (field.type as any)?.type?.name?.value === entityName
        })

        const isEntityListInParent =
          entityFieldInParent.type.kind === "ListType"
        const entityTargetPropertyNameInParent = entityFieldInParent.name.value

        const parentObjectConfigurationRef = objectConfiguration[parent]
        const parentModuleConfig = parentObjectConfigurationRef.moduleConfig

        /!**
         * Parent and current entity are part of the same module, or if the parent is already a link then create the parent
         * configuration in the entity configuration.
         *!/

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
          /!**
           * Look for the link module between the parent and the current entity.
           *!/

          const { relatedModule: linkModule, alias: linkAlias } =
            retrieveLinkModuleAndAlias(
              currentObjectConfigurationRef.moduleConfig.serviceName,
              parentModuleConfig.serviceName,
              moduleJoinerConfigs
            )

          /!**
           * construct the link module configuration like for the entity
           *!/

          // TODO: validate the entity name
          const linkEntityName = linkAlias
          const linkObjectConfigurationRef = (objectConfiguration[
            linkEntityName
          ] ??= {
            entity: linkEntityName,
            parents: [
              {
                ref: parentObjectConfigurationRef,
              },
            ],
            alias: linkAlias,
            listeners: [
              `${toCamelCase(linkEntityName)}.attached`,
              `${toCamelCase(linkEntityName)}.detached`,
            ],
            moduleConfig: linkModule,
            fields: [
              ...linkModule.relationships
                .map(
                  (relationship) =>
                    [
                      parentModuleConfig.serviceName,
                      currentEntityModule.serviceName,
                    ].includes(relationship.serviceName) &&
                    relationship.foreignKey
                )
                .filter(Boolean),
              parentObjectConfigurationRef.alias + ".id",
            ],
          })

          /!**
           * If the current entity is not the entity linked from the link
           * module we have to create a new configuration for that entity which
           * will become the current entity parent.
           *!/

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

            linkedEntityObjectConfigurationRef = objectConfiguration[
              linkedEntityNameAndAlias.entityName
            ] ??= {
              entity: linkedEntityNameAndAlias.entityName,
              parents: [
                {
                  ref: linkObjectConfigurationRef,
                  targetProp: linkedEntityNameAndAlias.alias,
                  isList: true,
                },
              ],
              alias: linkedEntityNameAndAlias.alias,
              listeners: [
                toCamelCase(linkedEntityAlias) + ".created",
                toCamelCase(linkedEntityAlias) + ".updated",
              ],
              moduleConfig: linkedEntityModule,
              fields: ["id", linkObjectConfigurationRef.alias + ".id"],
            }
          }

          /!**
           * The link entity configuration become the parent of the current entity
           *!/

          currentObjectConfigurationRef.parents.push({
            ref:
              linkedEntityObjectConfigurationRef || linkObjectConfigurationRef,
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
  })

  console.log(objectConfiguration)
}*/

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

  for (const moduleJoinerConfig of moduleJoinerConfigs.filter(
    (config) => config.isLink
  )) {
    const linkRelationShip = moduleJoinerConfig.relationships
    if (
      linkRelationShip[0].serviceName === parentEntityServiceName &&
      linkRelationShip[1].serviceName === entityServiceName
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

export async function buildObjectConfigurationFromGraphQlSchema(schema) {
  await MedusaApp({
    modulesConfig,
    servicesConfig: joinerConfig,
    injectedDependencies,
  })

  const moduleJoinerConfigs = MedusaModule.getAllJoinerConfigs()
  const augmentedSchema = CustomDirectives.Listeners.definition + schema
  const executableSchema = makeSchemaExecutable(augmentedSchema)
  const entitiesMap = executableSchema.getTypeMap()

  const objectConfiguration = {}

  function getObjectConfigurationRef(entityName) {
    return (objectConfiguration[entityName] ??= {
      entity: entityName,
      parents: [],
      alias: "",
      listeners: [],
      moduleConfig: null,
      fields: [],
    })
  }

  function setListeners(currentObjectConfigurationRef, listenerDirective) {
    if (!listenerDirective) {
      throw new Error(
        "CatalogModule error, a type is defined in the schema configuration but it is missing the @Listeners directive to specify which events to listen to in order to sync the data"
      )
    }

    currentObjectConfigurationRef.listeners = (
      (listenerDirective?.arguments?.[0].value as any)?.values ?? []
    ).map((v) => v.value)
  }

  function processEntity(entityName) {
    if (!entitiesMap[entityName].astNode) {
      return
    }

    const currentObjectConfigurationRef = getObjectConfigurationRef(entityName)

    const listenerDirective = entitiesMap[entityName].astNode?.directives?.find(
      (directive: any) =>
        directive.name.value === CustomDirectives.Listeners.name
    )

    setListeners(currentObjectConfigurationRef, listenerDirective)

    currentObjectConfigurationRef.fields = getFieldsAndRelations(
      entitiesMap,
      entityName
    )

    const { relatedModule: currentEntityModule, alias } =
      retrieveModuleAndAlias(entityName, moduleJoinerConfigs)

    currentObjectConfigurationRef.moduleConfig = currentEntityModule
    currentObjectConfigurationRef.alias = alias

    const schemaParentEntityNames = Object.values(entitiesMap).filter(
      (value) => {
        return (
          value.astNode &&
          (value.astNode as ObjectTypeDefinitionNode).fields?.some((field) => {
            return (field.type as any)?.type?.name?.value === entityName
          })
        )
      }
    )

    if (schemaParentEntityNames.length) {
      const parentEntityNames = schemaParentEntityNames.map((parent) => {
        return parent.name
      })

      for (const parent of parentEntityNames) {
        const entityFieldInParent = (
          entitiesMap[parent].astNode as any
        )?.fields?.find((field) => {
          return (field.type as any)?.type?.name?.value === entityName
        })

        const isEntityListInParent =
          entityFieldInParent.type.kind === "ListType"
        const entityTargetPropertyNameInParent = entityFieldInParent.name.value

        const parentObjectConfigurationRef = getObjectConfigurationRef(parent)
        const parentModuleConfig = parentObjectConfigurationRef.moduleConfig

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
          const { relatedModule: linkModule, alias: linkAlias } =
            retrieveLinkModuleAndAlias(
              currentObjectConfigurationRef.moduleConfig.serviceName,
              parentModuleConfig.serviceName,
              moduleJoinerConfigs
            )

          const linkObjectConfigurationRef =
            getObjectConfigurationRef(linkAlias)

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
                  ].includes(relationship.serviceName) &&
                  relationship.foreignKey
              )
              .filter(Boolean),
            parentObjectConfigurationRef.alias + ".id",
          ]

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
              linkedEntityNameAndAlias.entityName
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
            ref:
              linkedEntityObjectConfigurationRef || linkObjectConfigurationRef,
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

  Object.keys(entitiesMap).forEach(processEntity)

  return objectConfiguration
}

buildObjectConfigurationFromGraphQlSchema(configMock2.schema).then(() => {
  process.exit()
})
