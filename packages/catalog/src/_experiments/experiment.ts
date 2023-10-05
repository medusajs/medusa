import { ObjectTypeDefinitionNode } from "graphql/index"
import { makeExecutableSchema } from "@graphql-tools/schema"
import {
  cleanGraphQLSchema,
  getFieldsAndRelations,
  MedusaApp,
  MedusaModule,
} from "@medusajs/modules-sdk"
import modulesConfig from "./modules-config"
import { joinerConfig } from "./joiner-config"
import {
  ContainerRegistrationKeys,
  isString,
  ModulesSdkUtils,
} from "@medusajs/utils"

const CustomDirectives = {
  Listeners: {
    name: "Listeners",
    definition: "directive @Listeners (values: [String!]) on OBJECT",
  },
}

/*
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
        variants: [Variant]
      }
      
      type Variant @Listeners(values: ["variants.created", "variants.updated"]) {
        id: String
        product_id: String
        sku: String
        prices: [Price]
      }
      
      type Price @Listeners(values: ["prices.created", "prices.updated"]) {
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

const buildObjectConfigurationFromGraphQlSchema = async (schema) => {
  /**
   * This is just to mock the modules after they have been loaded
   * TODO: remove
   */

  await MedusaApp({
    modulesConfig,
    servicesConfig: joinerConfig,
    injectedDependencies,
  })

  const moduleJoinerConfigs = MedusaModule.getAllJoinerConfigs()

  /**
   * End of the above mock.
   */

  // Prepend the @Listeners directive to make it available for graphQL
  const augmentedSchema = CustomDirectives.Listeners.definition + schema

  const executableSchema = makeSchemaExecutable(augmentedSchema)
  const entitiesMap = executableSchema.getTypeMap()

  /**
   * Start building the internal object configuration from the schema and the information
   * we have about the modules and link modules.
   */

  const objectConfiguration = {}

  Object.keys(entitiesMap).forEach((entityName) => {
    if (!entitiesMap[entityName].astNode) {
      return
    }

    const currentObjectConfigurationRef = (objectConfiguration[entityName] ??= {
      entity: entityName,
      schemaParents: [],
      listeners: [],
      relatedModule: null,
    })

    /**
     * Retrieve the directive @Listeners to set it on the object configuration
     */

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

    /**
     * Retrieve immediate parent in the provided schema configuration.
     * This is different from the real parent based on the module configuration, especially
     * if there is any link involved
     */

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

    currentObjectConfigurationRef.schemaParents = (
      schemaParentEntityNames ?? []
    ).map((parent) => parent.name)

    /**
     * Get all the fields from the current type without any relation fields
     */

    currentObjectConfigurationRef.fields = getFieldsAndRelations(
      entitiesMap,
      entityName
    )

    /**
     * This step will assign the related module config to the current entity.
     * In a later step we will be able to verify if the parent and child are part of
     * the same module or not in order to mutate the configuration and
     * apply the correct configuration.
     */

    for (const moduleJoinerConfig of moduleJoinerConfigs) {
      const moduleSchema = moduleJoinerConfig.schema
      const moduleAliases = moduleJoinerConfig.alias

      /**
       * If the parent entity exist in the module schema, then the current module is the
       * one we are looking for.
       *
       * If the module does not have any schema, then we need to base the search
       * on the provided aliases.
       */

      let relatedModule

      if (moduleSchema) {
        const executableSchema = makeSchemaExecutable(moduleSchema)
        const entitiesMap = executableSchema.getTypeMap()

        const parentEntityExistsInModuleSchema = !!getFieldsAndRelations(
          entitiesMap,
          entityName
        ).length

        if (parentEntityExistsInModuleSchema) {
          relatedModule = moduleJoinerConfig
        }
      } else if (moduleAliases) {
        let aliases = Array.isArray(moduleJoinerConfig.alias)
          ? moduleJoinerConfig.alias
          : [moduleJoinerConfig.alias]
        aliases = aliases.filter(Boolean)

        const parentEntityCorrespondingAlias = aliases.find((alias) => {
          // TODO: Change from name to entity once the migration of the aliases is done
          const aliasName = isString(alias) ? alias : alias?.name
          return aliasName!.toLowerCase() === entityName.toLowerCase()
        })

        if (parentEntityCorrespondingAlias) {
          relatedModule = moduleJoinerConfig
        }
      }

      if (relatedModule) {
        currentObjectConfigurationRef.relatedModule = relatedModule
        break
      }
    }

    // TODO: check if the entity and there parents are part of the same module
    // otherwise create the link configuration, alter the parent configuration of each entity config
    // and apply the parent fields to the entity config
  })

  console.log(objectConfiguration)
}

buildObjectConfigurationFromGraphQlSchema(configMock2.schema).then(() => {
  process.exit()
})
