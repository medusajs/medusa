import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  IndexTypes,
  JoinerServiceConfigAlias,
  ModuleJoinerConfig,
  ModuleJoinerRelationship,
} from "@medusajs/framework/types"
import {
  buildModuleResourceEventName,
  CommonEvents,
  GraphQLUtils,
  kebabCase,
  lowerCaseFirst,
} from "@medusajs/framework/utils"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import { baseGraphqlSchema } from "./base-graphql-schema"

export const CustomDirectives = {
  Listeners: {
    configurationPropertyName: "listeners",
    isRequired: true,
    name: "Listeners",
    directive: "@Listeners",
    definition: "directive @Listeners (values: [String!]) on OBJECT",
  },
}

export function makeSchemaExecutable(inputSchema: string) {
  const { schema: cleanedSchema } = GraphQLUtils.cleanGraphQLSchema(inputSchema)

  if (!cleanedSchema) {
    return
  }

  return GraphQLUtils.makeExecutableSchema({
    typeDefs: cleanedSchema,
  })
}

/**
 * Retrieve the property name of the source entity that corresponds to the target entity
 * @param sourceEntityName - The name of the source entity
 * @param targetEntityName - The name of the target entity
 * @param entitiesMap - The map of entities configured in the module
 * @param servicesEntityMap - The map of entities configured in the services
 * @param node - The node of the source entity
 * @returns The property name and if it is an array of the source entity property that corresponds to the target entity
 */
function retrieveEntityPropByType({
  sourceEntityName,
  targetEntityName,
  entitiesMap,
  servicesEntityMap,
  node,
}: {
  sourceEntityName?: string
  targetEntityName: string
  entitiesMap?: Record<string, any>
  servicesEntityMap?: Record<string, any>
  node?: any
}): { name: string; isArray: boolean } | undefined {
  if (!node && !entitiesMap && !servicesEntityMap) {
    throw new Error(
      "Index Module error, unable to retrieve the entity property by type. Please provide either the entitiesMap and servicesEntityMap or the node."
    )
  }

  const retrieveFieldNode = (
    node: any
  ): { name: string; isArray: boolean } | undefined => {
    const astNode = node?.astNode
    const fields = astNode?.fields ?? []

    for (const field of fields) {
      let type = field.type
      let isArray = false
      while (type.type) {
        if (type.kind === GraphQLUtils.Kind.LIST_TYPE) {
          isArray = true
        }
        type = type.type
      }
      if (type.name?.value === targetEntityName) {
        return { name: field.name?.value, isArray }
      }
    }

    return
  }

  let prop: any
  if (node) {
    prop = retrieveFieldNode(node)
  }

  if (entitiesMap && !prop) {
    prop = retrieveFieldNode(entitiesMap[sourceEntityName!])
  }

  if (servicesEntityMap && !prop) {
    prop = retrieveFieldNode(servicesEntityMap[sourceEntityName!])
  }

  return (
    prop && {
      name: prop?.name,
      isArray: prop?.isArray,
    }
  )
}

function extractNameFromAlias(
  alias: JoinerServiceConfigAlias | JoinerServiceConfigAlias[]
) {
  const alias_ = Array.isArray(alias) ? alias[0] : alias
  const names = Array.isArray(alias_?.name) ? alias_?.name : [alias_?.name]
  return names[0]
}

function retrieveAliasForEntity(entityName: string, aliases) {
  aliases = aliases ? (Array.isArray(aliases) ? aliases : [aliases]) : []

  for (const alias of aliases) {
    const names = Array.isArray(alias.name) ? alias.name : [alias.name]

    if (alias.entity === entityName) {
      return names[0]
    }

    for (const name of names) {
      if (name.toLowerCase() === entityName.toLowerCase()) {
        return name
      }
    }
  }
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
      const entitiesMap = executableSchema?.getTypeMap()

      if (entitiesMap?.[entityName]) {
        relatedModule = moduleJoinerConfig
      }
    }

    if (relatedModule && moduleAliases) {
      alias = retrieveAliasForEntity(entityName, moduleJoinerConfig.alias)
    }

    if (relatedModule) {
      break
    }
  }

  if (!relatedModule) {
    return { relatedModule: null, alias: null }
  }

  if (!alias) {
    throw new Error(
      `Index Module error, the module ${relatedModule?.serviceName} has a schema but does not have any alias for the entity ${entityName}. Please add an alias to the module configuration and the entity it correspond to in the args under the entity property.`
    )
  }

  return { relatedModule, alias }
}

// TODO: rename util
function retrieveLinkModuleAndAlias({
  primaryEntity,
  primaryModuleConfig,
  foreignEntity,
  foreignModuleConfig,
  moduleJoinerConfigs,
  servicesEntityMap,
  entitiesMap,
}: {
  primaryEntity: string
  primaryModuleConfig: ModuleJoinerConfig
  foreignEntity: string
  foreignModuleConfig: ModuleJoinerConfig
  moduleJoinerConfigs: ModuleJoinerConfig[]
  servicesEntityMap: Record<string, any>
  entitiesMap: Record<string, any>
}): {
  entityName: string
  alias: string
  linkModuleConfig: ModuleJoinerConfig
  intermediateEntityNames: string[]
  isInverse?: boolean
  isList?: boolean
  inverseSideProp?: string
}[] {
  const linkModulesMetadata: {
    entityName: string
    alias: string
    linkModuleConfig: ModuleJoinerConfig
    intermediateEntityNames: string[]
    isInverse?: boolean
    inverseSideProp?: string
    isList?: boolean
  }[] = []

  for (const linkModuleJoinerConfig of moduleJoinerConfigs.filter(
    (config) => config.isLink && !config.isReadOnlyLink
  )) {
    const linkPrimary =
      linkModuleJoinerConfig.relationships![0] as ModuleJoinerRelationship
    const linkForeign =
      linkModuleJoinerConfig.relationships![1] as ModuleJoinerRelationship

    const isDirectMatch =
      linkPrimary.serviceName === primaryModuleConfig.serviceName &&
      linkForeign.serviceName === foreignModuleConfig.serviceName &&
      linkPrimary.entity === primaryEntity

    const isInverseMatch =
      linkPrimary.serviceName === foreignModuleConfig.serviceName &&
      linkForeign.serviceName === primaryModuleConfig.serviceName &&
      linkPrimary.entity === foreignEntity

    if (!(isDirectMatch || isInverseMatch)) {
      continue
    }

    const primaryEntityLinkableKey = isDirectMatch
      ? linkPrimary.foreignKey
      : linkForeign.foreignKey
    const isTheForeignKeyEntityEqualPrimaryEntity =
      primaryModuleConfig.linkableKeys?.[primaryEntityLinkableKey] ===
      primaryEntity

    const foreignEntityLinkableKey = isDirectMatch
      ? linkForeign.foreignKey
      : linkPrimary.foreignKey
    const isTheForeignKeyEntityEqualForeignEntity =
      foreignModuleConfig.linkableKeys?.[foreignEntityLinkableKey] ===
      foreignEntity

    const relationshipsTypes =
      linkModuleJoinerConfig.relationships
        ?.map((relationship) => relationship.entity!)
        .filter(Boolean) ?? []

    const filteredEntitiesMap = {
      [linkModuleJoinerConfig.alias?.[0].entity]:
        entitiesMap[linkModuleJoinerConfig.alias?.[0].entity],
    }
    const filteredServicesEntityMap = {
      [linkModuleJoinerConfig.alias?.[0].entity]:
        servicesEntityMap[linkModuleJoinerConfig.alias?.[0].entity],
    }

    for (const relationshipType of relationshipsTypes) {
      filteredEntitiesMap[relationshipType] = entitiesMap[relationshipType]
      filteredServicesEntityMap[relationshipType] =
        servicesEntityMap[relationshipType]
    }

    const linkName = linkModuleJoinerConfig.extends?.find((extend) => {
      return (
        (extend.serviceName === primaryModuleConfig.serviceName ||
          extend.relationship.serviceName ===
            foreignModuleConfig.serviceName) &&
        (extend.relationship.primaryKey === primaryEntityLinkableKey ||
          extend.relationship.primaryKey === foreignEntityLinkableKey)
      )
    })?.relationship.serviceName

    if (!linkName) {
      throw new Error(
        `Index Module error, unable to retrieve the link module name for the services ${primaryModuleConfig.serviceName} - ${foreignModuleConfig.serviceName}. Please be sure that the extend relationship service name is set correctly`
      )
    }

    if (!linkModuleJoinerConfig.alias?.[0]?.entity) {
      throw new Error(
        `Index Module error, unable to retrieve the link module entity name for the services ${primaryModuleConfig.serviceName} - ${foreignModuleConfig.serviceName}. Please be sure that the link module alias has an entity property in the args.`
      )
    }

    if (
      isTheForeignKeyEntityEqualPrimaryEntity &&
      isTheForeignKeyEntityEqualForeignEntity
    ) {
      /**
       * The link will become the parent of the foreign entity, that is why the alias must be the one that correspond to the extended foreign module
       */

      const inverseSideProp = retrieveEntityPropByType({
        targetEntityName: primaryEntity,
        sourceEntityName: linkModuleJoinerConfig.alias[0].entity,
        servicesEntityMap: filteredServicesEntityMap,
        entitiesMap: filteredEntitiesMap,
      })

      linkModulesMetadata.push({
        entityName: linkModuleJoinerConfig.alias[0].entity,
        alias: extractNameFromAlias(linkModuleJoinerConfig.alias),
        linkModuleConfig: linkModuleJoinerConfig,
        intermediateEntityNames: [],
        isInverse: isInverseMatch,
        isList: inverseSideProp?.isArray,
        inverseSideProp: inverseSideProp?.name,
      })
    } else {
      const intermediateEntityName =
        foreignModuleConfig.linkableKeys![foreignEntityLinkableKey]

      const moduleSchema = isDirectMatch
        ? foreignModuleConfig.schema!
        : primaryModuleConfig.schema!

      if (!moduleSchema) {
        throw new Error(
          `Index Module error, unable to retrieve the intermediate entity name for the services ${primaryModuleConfig.serviceName} - ${foreignModuleConfig.serviceName}. Please be sure that the foreign module ${foreignModuleConfig.serviceName} has a schema.`
        )
      }

      const entitiesMap = servicesEntityMap
      let intermediateEntities: string[] = []
      let foundCount = 0
      let foundName: string | null = null
      const isForeignEntityChildOfIntermediateEntity = (
        entityName: string,
        visited: Set<string> = new Set()
      ): boolean => {
        if (visited.has(entityName)) {
          return false
        }
        visited.add(entityName)

        for (const entityType of Object.values(entitiesMap)) {
          const inverseSideProp = retrieveEntityPropByType({
            node: entityType,
            targetEntityName: entityName,
          })

          if (
            entityType.astNode?.kind === "ObjectTypeDefinition" &&
            inverseSideProp
          ) {
            if (entityType.name === intermediateEntityName) {
              foundName = entityType.name
              ++foundCount
              return true
            } else {
              const inverseSideProp = isForeignEntityChildOfIntermediateEntity(
                entityType.name,
                visited
              )
              if (inverseSideProp) {
                intermediateEntities.push(entityType.name)
                return true
              }
            }
          }
        }
        return false
      }

      isForeignEntityChildOfIntermediateEntity(
        isDirectMatch ? foreignEntity : primaryEntity
      )

      if (foundCount !== 1) {
        throw new Error(
          `Index Module error, unable to retrieve the intermediate entities for the services ${
            primaryModuleConfig.serviceName
          } - ${foreignModuleConfig.serviceName} between ${
            isDirectMatch ? foreignEntity : primaryEntity
          } and ${intermediateEntityName}. Multiple paths or no path found. Please check your schema in ${
            foreignModuleConfig.serviceName
          }`
        )
      }

      intermediateEntities.push(foundName!)

      /**
       * The link will become the parent of the foreign entity, that is why the alias must be the one that correspond to the extended foreign module
       */

      const directInverseSideProp = retrieveEntityPropByType({
        targetEntityName: isDirectMatch
          ? primaryEntity
          : linkModuleJoinerConfig.alias[0].entity,
        sourceEntityName: isDirectMatch
          ? linkModuleJoinerConfig.alias[0].entity
          : primaryEntity,
        servicesEntityMap: filteredServicesEntityMap,
        entitiesMap: filteredEntitiesMap,
      })

      linkModulesMetadata.push({
        entityName: linkModuleJoinerConfig.alias[0].entity,
        alias: extractNameFromAlias(linkModuleJoinerConfig.alias),
        linkModuleConfig: linkModuleJoinerConfig,
        intermediateEntityNames: intermediateEntities,
        inverseSideProp: directInverseSideProp?.name,
        isList: directInverseSideProp?.isArray,
        isInverse: isInverseMatch,
      })
    }
  }

  if (!linkModulesMetadata.length) {
    console.warn(
      `Index Module warning, unable to retrieve the link module that correspond to the entities ${primaryEntity} - ${foreignEntity}.`
    )
  }

  return linkModulesMetadata
}

function getObjectRepresentationRef(
  entityName,
  { objectRepresentationRef }
): IndexTypes.SchemaObjectEntityRepresentation {
  return (objectRepresentationRef[entityName] ??= {
    entity: entityName,
    parents: [],
    alias: "",
    listeners: [],
    moduleConfig: null,
    fields: [],
  })
}

function setCustomDirectives(currentObjectRepresentationRef, directives) {
  for (const customDirectiveConfiguration of Object.values(CustomDirectives)) {
    const directive = directives.find(
      (typeDirective) =>
        typeDirective.name.value === customDirectiveConfiguration.name
    )

    if (!directive) {
      return
    }

    // Only support array directive value for now
    currentObjectRepresentationRef[
      customDirectiveConfiguration.configurationPropertyName
    ] = ((directive.arguments[0].value as any)?.values ?? []).map(
      (v) => v.value
    )
  }
}

function processEntity(
  entityName: string,
  {
    entitiesMap,
    servicesEntityMap,
    moduleJoinerConfigs,
    objectRepresentationRef,
  }: {
    entitiesMap: any
    servicesEntityMap: any
    moduleJoinerConfigs: ModuleJoinerConfig[]
    objectRepresentationRef: IndexTypes.SchemaObjectRepresentation
  }
) {
  /**
   * Get the reference to the object representation for the current entity.
   */

  const currentObjectRepresentationRef = getObjectRepresentationRef(
    entityName,
    {
      objectRepresentationRef,
    }
  )

  /**
   * Retrieve and set the custom directives for the current entity.
   */

  setCustomDirectives(
    currentObjectRepresentationRef,
    entitiesMap[entityName].astNode?.directives ?? []
  )

  // Merge and deduplicate the fields
  currentObjectRepresentationRef.fields ??= []
  currentObjectRepresentationRef.fields =
    currentObjectRepresentationRef.fields.concat(
      ...(GraphQLUtils.gqlGetFieldsAndRelations(entitiesMap, entityName) ?? [])
    )
  currentObjectRepresentationRef.fields = Array.from(
    new Set(currentObjectRepresentationRef.fields)
  )

  /**
   * Retrieve the module and alias for the current entity.
   */

  const { relatedModule: currentEntityModule, alias } = retrieveModuleAndAlias(
    entityName,
    moduleJoinerConfigs
  )

  if (
    !currentEntityModule &&
    currentObjectRepresentationRef.listeners.length > 0
  ) {
    const example = JSON.stringify({
      alias: [
        {
          name: "entity-alias",
          entity: entityName,
        },
      ],
    })
    throw new Error(
      `Index Module error, unable to retrieve the module that corresponds to the entity ${entityName}.\nPlease add the entity to the module schema or add an alias to the joiner config like the example below:\n${example}`
    )
  }

  if (currentEntityModule) {
    objectRepresentationRef._serviceNameModuleConfigMap[
      currentEntityModule.serviceName
    ] = currentEntityModule
    currentObjectRepresentationRef.moduleConfig = currentEntityModule
    currentObjectRepresentationRef.alias = alias
  }
  /**
   * Retrieve the parent entities for the current entity.
   */

  const schemaParentEntity = Object.values(entitiesMap).filter((value: any) => {
    return (
      value.astNode &&
      (value.astNode as GraphQLUtils.ObjectTypeDefinitionNode).fields?.some(
        (field: any) => {
          let currentType = field.type
          while (currentType.type) {
            currentType = currentType.type
          }

          return currentType.name?.value === entityName
        }
      )
    )
  })

  if (!schemaParentEntity.length) {
    return
  }

  /**
   * If the current entity has parent entities, then we need to process them.
   */
  const parentEntityNames = schemaParentEntity.map((parent: any) => {
    return parent.name
  })

  for (const parent of parentEntityNames) {
    /**
     * Retrieve the parent entity field in the schema
     */

    const entityFieldInParent = retrieveEntityPropByType({
      sourceEntityName: parent,
      targetEntityName: entityName,
      entitiesMap,
      servicesEntityMap,
    })!

    const entityTargetPropertyNameInParent = entityFieldInParent.name
    const entityTargetPropertyIsListInParent = entityFieldInParent.isArray

    /**
     * Retrieve the parent entity object representation reference.
     */
    if (!objectRepresentationRef[parent]) {
      processEntity(parent, {
        entitiesMap,
        servicesEntityMap,
        moduleJoinerConfigs,
        objectRepresentationRef,
      })
    }

    const parentObjectRepresentationRef = getObjectRepresentationRef(parent, {
      objectRepresentationRef,
    })
    const parentModuleConfig = parentObjectRepresentationRef.moduleConfig

    // If the entity is not part of any module, just set the parent and continue
    if (!currentObjectRepresentationRef.moduleConfig) {
      const parentAlreadyExists = currentObjectRepresentationRef.parents.some(
        (existingParent) =>
          existingParent.ref?.entity === parentObjectRepresentationRef.entity &&
          existingParent.targetProp === entityTargetPropertyNameInParent
      )

      const parentPropertyNameWithinCurrentEntity = retrieveEntityPropByType({
        sourceEntityName: entityName,
        targetEntityName: parent,
        entitiesMap,
        servicesEntityMap,
      })

      if (!parentAlreadyExists) {
        currentObjectRepresentationRef.parents.push({
          ref: parentObjectRepresentationRef,
          targetProp: entityTargetPropertyNameInParent,
          inverseSideProp: parentPropertyNameWithinCurrentEntity?.name!,
          isList: entityTargetPropertyIsListInParent,
        })
      } else {
        return
      }

      continue
    }

    /**
     * If the parent entity and the current entity are part of the same service then configure the parent and
     * add the parent id as a field to the current entity.
     */

    if (
      currentObjectRepresentationRef.moduleConfig.serviceName ===
        parentModuleConfig.serviceName ||
      parentModuleConfig.isLink ||
      currentObjectRepresentationRef.moduleConfig.isLink
    ) {
      const parentPropertyNameWithinCurrentEntity = retrieveEntityPropByType({
        sourceEntityName: entityName,
        targetEntityName: parent,
        entitiesMap,
        servicesEntityMap,
      })

      const parentAlreadyExists = currentObjectRepresentationRef.parents.some(
        (existingParent) =>
          existingParent.ref?.entity === parentObjectRepresentationRef.entity &&
          existingParent.targetProp === entityTargetPropertyNameInParent
      )

      if (!parentAlreadyExists) {
        currentObjectRepresentationRef.parents.push({
          ref: parentObjectRepresentationRef,
          targetProp: entityTargetPropertyNameInParent,
          inverseSideProp: parentPropertyNameWithinCurrentEntity?.name!,
          isList: entityTargetPropertyIsListInParent,
        })
      }

      const propertyToAdd = parentPropertyNameWithinCurrentEntity?.name + ".id"

      if (
        parentPropertyNameWithinCurrentEntity &&
        !currentObjectRepresentationRef.fields.includes(propertyToAdd)
      ) {
        currentObjectRepresentationRef.fields.push(propertyToAdd)
      }

      if (parentAlreadyExists) {
        return
      }
    } else {
      /**
       * If the parent entity and the current entity are not part of the same service then we need to
       * find the link module that join them.
       */

      const linkModuleMetadatas = retrieveLinkModuleAndAlias({
        primaryEntity: parentObjectRepresentationRef.entity,
        primaryModuleConfig: parentModuleConfig,
        foreignEntity: currentObjectRepresentationRef.entity,
        foreignModuleConfig: currentEntityModule,
        moduleJoinerConfigs,
        servicesEntityMap,
        entitiesMap,
      })

      for (const linkModuleMetadata of linkModuleMetadatas) {
        const linkObjectRepresentationRef = getObjectRepresentationRef(
          linkModuleMetadata.entityName,
          { objectRepresentationRef }
        )

        objectRepresentationRef._serviceNameModuleConfigMap[
          linkModuleMetadata.linkModuleConfig.serviceName ||
            linkModuleMetadata.entityName
        ] = linkModuleMetadata.linkModuleConfig

        /**
         * Add the schema parent entity as a parent to the link module and configure it.
         */

        linkObjectRepresentationRef.parents ??= []

        if (
          !linkObjectRepresentationRef.parents.some(
            (parent) =>
              parent.ref.entity === parentObjectRepresentationRef.entity
          )
        ) {
          linkObjectRepresentationRef.parents.push({
            ref: parentObjectRepresentationRef,
            targetProp: linkModuleMetadata.alias,
            inverseSideProp: linkModuleMetadata.inverseSideProp ?? "",
            isList: linkModuleMetadata.isList,
            isInverse: linkModuleMetadata.isInverse,
          })
        }
        linkObjectRepresentationRef.alias = linkModuleMetadata.alias
        linkObjectRepresentationRef.listeners = [
          `${linkModuleMetadata.entityName}.${CommonEvents.ATTACHED}`,
          `${linkModuleMetadata.entityName}.${CommonEvents.DETACHED}`,
        ]
        linkObjectRepresentationRef.moduleConfig =
          linkModuleMetadata.linkModuleConfig

        linkObjectRepresentationRef.fields = [
          "id",
          ...linkModuleMetadata.linkModuleConfig
            .relationships!.map(
              (relationship) =>
                [
                  parentModuleConfig.serviceName,
                  currentEntityModule.serviceName,
                ].includes(relationship.serviceName) && relationship.foreignKey
            )
            .filter((v): v is string => Boolean(v)),
        ]

        /**
         * If the current entity is not the entity that is used to join the link module and the parent entity
         * then we need to add the new entity that join them and then add the link as its parent
         * before setting the new entity as the true parent of the current entity.
         */

        for (
          let i = linkModuleMetadata.intermediateEntityNames.length - 1;
          i >= 0;
          --i
        ) {
          const intermediateEntityName =
            linkModuleMetadata.intermediateEntityNames[i]

          const isLastIntermediateEntity =
            i === linkModuleMetadata.intermediateEntityNames.length - 1

          const parentIntermediateEntityRef = isLastIntermediateEntity
            ? linkObjectRepresentationRef
            : objectRepresentationRef[
                linkModuleMetadata.intermediateEntityNames[i + 1]
              ]

          const {
            relatedModule: intermediateEntityModule,
            alias: intermediateEntityAlias,
          } = retrieveModuleAndAlias(
            intermediateEntityName,
            moduleJoinerConfigs
          )

          const intermediateEntityObjectRepresentationRef =
            getObjectRepresentationRef(intermediateEntityName, {
              objectRepresentationRef,
            })

          objectRepresentationRef._serviceNameModuleConfigMap[
            intermediateEntityModule.serviceName
          ] = intermediateEntityModule

          const parentPropertyNameWithinIntermediateEntity =
            retrieveEntityPropByType({
              sourceEntityName: intermediateEntityName,
              targetEntityName: parentIntermediateEntityRef.entity,
              entitiesMap: entitiesMap,
              servicesEntityMap: servicesEntityMap,
            })

          const intermediateEntityTargetPropertyIsListInParent =
            retrieveEntityPropByType({
              sourceEntityName: parentIntermediateEntityRef.entity,
              targetEntityName: intermediateEntityName,
              entitiesMap: entitiesMap,
              servicesEntityMap: servicesEntityMap,
            })?.isArray

          const parentRef = {
            ref: parentIntermediateEntityRef,
            targetProp: intermediateEntityAlias,
            inverseSideProp: parentPropertyNameWithinIntermediateEntity?.name!,
            isList: intermediateEntityTargetPropertyIsListInParent,
          }

          const parentAlreadyExists =
            intermediateEntityObjectRepresentationRef.parents.some(
              (existingParent) =>
                existingParent.ref?.entity ===
                  parentIntermediateEntityRef.entity &&
                existingParent.targetProp === intermediateEntityAlias
            )

          if (!parentAlreadyExists) {
            intermediateEntityObjectRepresentationRef.parents.push(parentRef)
          }

          intermediateEntityObjectRepresentationRef.alias =
            intermediateEntityAlias
          const kebabCasedServiceName = lowerCaseFirst(
            kebabCase(intermediateEntityModule.serviceName)
          )
          intermediateEntityObjectRepresentationRef.listeners = [
            buildModuleResourceEventName({
              action: CommonEvents.CREATED,
              objectName: intermediateEntityName,
              prefix: kebabCasedServiceName,
            }),
            buildModuleResourceEventName({
              action: CommonEvents.UPDATED,
              objectName: intermediateEntityName,
              prefix: kebabCasedServiceName,
            }),
            buildModuleResourceEventName({
              action: CommonEvents.DELETED,
              objectName: intermediateEntityName,
              prefix: kebabCasedServiceName,
            }),
          ]
          intermediateEntityObjectRepresentationRef.moduleConfig =
            intermediateEntityModule
          if (
            !intermediateEntityObjectRepresentationRef.fields.includes("id")
          ) {
            intermediateEntityObjectRepresentationRef.fields.push("id")
          }

          /**
           * We push the parent id only between intermediate entities but not between intermediate and link
           */

          if (!isLastIntermediateEntity) {
            const propertyToAdd =
              parentPropertyNameWithinIntermediateEntity?.name + ".id"

            if (
              parentPropertyNameWithinIntermediateEntity &&
              !intermediateEntityObjectRepresentationRef.fields.includes(
                propertyToAdd
              )
            ) {
              intermediateEntityObjectRepresentationRef.fields.push(
                propertyToAdd
              )
            }
          }
        }

        /**
         * If there is any intermediate entity then we need to set the last one as the parent field for the current entity.
         * otherwise there is not need to set the link id field into the current entity.
         */

        let currentParentIntermediateRef = linkObjectRepresentationRef
        if (linkModuleMetadata.intermediateEntityNames.length) {
          currentParentIntermediateRef =
            objectRepresentationRef[
              linkModuleMetadata.intermediateEntityNames[0]
            ]

          const parentPropertyNameWithinCurrentEntity =
            retrieveEntityPropByType({
              sourceEntityName: currentObjectRepresentationRef.entity,
              targetEntityName: currentParentIntermediateRef.entity,
              entitiesMap: servicesEntityMap,
            })

          const propertyToAdd =
            parentPropertyNameWithinCurrentEntity?.name + ".id"

          if (
            parentPropertyNameWithinCurrentEntity &&
            !currentObjectRepresentationRef.fields.includes(propertyToAdd)
          ) {
            currentObjectRepresentationRef.fields.push(propertyToAdd)
          }
        }

        const parentPropertyNameWithinCurrentEntity = retrieveEntityPropByType({
          sourceEntityName: currentObjectRepresentationRef.entity,
          targetEntityName: currentParentIntermediateRef.entity,
          entitiesMap: servicesEntityMap,
        })

        const entityTargetPropertyIsListInParent = retrieveEntityPropByType({
          sourceEntityName: currentParentIntermediateRef.entity,
          targetEntityName: currentObjectRepresentationRef.entity,
          entitiesMap: entitiesMap,
          servicesEntityMap: servicesEntityMap,
        })?.isArray

        const parentAlreadyExists = currentObjectRepresentationRef.parents.some(
          (existingParent) =>
            existingParent.ref?.entity ===
              currentParentIntermediateRef.entity &&
            existingParent.targetProp === entityTargetPropertyNameInParent
        )

        if (!parentAlreadyExists) {
          currentObjectRepresentationRef.parents.push({
            ref: currentParentIntermediateRef,
            inSchemaRef: parentObjectRepresentationRef,
            targetProp: entityTargetPropertyNameInParent,
            inverseSideProp: parentPropertyNameWithinCurrentEntity?.name!,
            isList: entityTargetPropertyIsListInParent,
          })
        }
      }
    }
  }
}

function getServicesEntityMap(
  moduleJoinerConfigs,
  addtionalSchema: string = ""
) {
  return makeSchemaExecutable(
    baseGraphqlSchema +
      "\n" +
      moduleJoinerConfigs
        .map((joinerConfig) => joinerConfig?.schema ?? "")
        .join("\n") +
      "\n" +
      addtionalSchema
  )!.getTypeMap()
}

/**
 * Build a special object which will be used to retrieve the correct
 * object representation using path tree
 *
 * @example
 * {
 *   _schemaPropertiesMap: {
 *     "product": <ProductRef>
 *     "product.variants": <ProductVariantRef>
 *   }
 * }
 */

function buildAliasMap(
  objectRepresentation: IndexTypes.SchemaObjectRepresentation
) {
  const aliasMap: IndexTypes.SchemaObjectRepresentation["_schemaPropertiesMap"] =
    {}

  function recursivelyBuildAliasPath(
    current: IndexTypes.SchemaObjectEntityRepresentation,
    parentPath = "",
    aliases: {
      alias: string
      shortCutOf?: string
      isInverse?: boolean
      isList?: boolean
    }[] = [],
    visited: Set<string> = new Set(),
    pathStack: string[] = []
  ): {
    alias: string
    shortCutOf?: string
    isInverse?: boolean
    isList?: boolean
  }[] {
    const pathIdentifier = `${current.entity}:${parentPath}`

    if (pathStack.includes(pathIdentifier)) {
      return []
    }

    pathStack.push(pathIdentifier)

    if (visited.has(current.entity)) {
      pathStack.pop()
      return []
    }

    visited.add(current.entity)

    for (const parentEntity of current.parents) {
      const newParentPath = parentPath
        ? `${parentEntity.targetProp}.${parentPath}`
        : parentEntity.targetProp

      const newVisited = new Set(visited)
      const newPathStack = [...pathStack]

      const parentAliases = recursivelyBuildAliasPath(
        parentEntity.ref,
        newParentPath,
        [],
        newVisited,
        newPathStack
      ).map((aliasObj) => ({
        alias: aliasObj.alias,
        isInverse: parentEntity.isInverse,
        isList: parentEntity.isList,
      }))

      aliases.push(...parentAliases)

      // Handle shortcut paths via inSchemaRef
      if (parentEntity.inSchemaRef) {
        const shortCutOf = parentAliases[0]
        if (!shortCutOf) {
          continue
        }

        const shortcutAliases_ = recursivelyBuildAliasPath(
          parentEntity.inSchemaRef,
          newParentPath,
          [],
          new Set(visited),
          [...pathStack]
        )

        // Assign all shortcut aliases to the parent aliases
        const shortcutAliases: any[] = []
        shortcutAliases_.forEach((shortcutAlias) => {
          parentAliases.forEach((aliasObj) => {
            let isSamePath =
              aliasObj.alias.split(".")[0] === shortcutAlias.alias.split(".")[0]

            if (!isSamePath) {
              return
            }

            shortcutAliases.push({
              alias: shortcutAlias.alias,
              shortCutOf: aliasObj.alias,
              isList: parentEntity.isList ?? true,
              isInverse: shortcutAlias.isInverse,
            })
          })
        })

        // Only add shortcut aliases if they don’t duplicate existing paths
        for (const shortcut of shortcutAliases) {
          if (!aliases.some((a) => a.alias === shortcut?.alias)) {
            aliases.push(shortcut!)
          }
        }
      }
    }

    // Add the current entity's alias, avoiding duplication
    const pathSegments = parentPath ? parentPath.split(".") : []
    const baseAlias =
      pathSegments.length && pathSegments[0] === current.alias
        ? parentPath // If parentPath already starts with this alias, use it as-is
        : `${current.alias}${parentPath ? `.${parentPath}` : ""}`

    if (!aliases.some((a) => a.alias === baseAlias)) {
      aliases.push({
        alias: baseAlias,
        isInverse: false,
      })
    }

    pathStack.pop()
    visited.delete(current.entity)

    return aliases
  }

  for (const objectRepresentationKey of Object.keys(
    objectRepresentation
  ).filter(
    (key) => !schemaObjectRepresentationPropertiesToOmit.includes(key)
  )) {
    const entityRepresentationRef =
      objectRepresentation[objectRepresentationKey]
    const aliases = recursivelyBuildAliasPath(entityRepresentationRef)

    for (const alias of aliases) {
      if (aliasMap[alias.alias] && !alias.shortCutOf) {
        continue
      }

      aliasMap[alias.alias] = {
        ref: entityRepresentationRef,
        shortCutOf: alias.shortCutOf,
        isList: alias.isList,
        isInverse: alias.isInverse,
      }
    }
  }

  return aliasMap
}

function buildSchemaFromFilterableLinks(
  moduleJoinerConfigs: ModuleJoinerConfig[],
  servicesEntityMap: Record<string, any>
): string {
  const allFilterable = moduleJoinerConfigs.flatMap((config) => {
    const entities: any[] = []

    const schema = config.schema

    if (config.isLink) {
      if (!config.relationships?.some((r) => r.filterable?.length)) {
        return []
      }

      for (const relationship of config.relationships) {
        relationship.filterable ??= []
        if (
          !relationship.filterable?.length ||
          !relationship.filterable?.includes("id")
        ) {
          relationship.filterable.push("id")
        }

        const fieldAliasMap: Record<string, string[]> = {}
        for (const extend of config.extends ?? []) {
          fieldAliasMap[extend.serviceName] = Object.keys(
            extend.fieldAlias ?? {}
          )
          fieldAliasMap[extend.serviceName].push(extend.relationship.alias)
        }

        const serviceName = relationship.serviceName
        entities.push({
          serviceName,
          entity: relationship.entity,
          fields: Array.from(
            new Set(
              relationship.filterable.concat(fieldAliasMap[serviceName] ?? [])
            )
          ),
          schema,
        })
      }

      return entities
    }

    let aliases = config.alias ?? []
    aliases = (Array.isArray(aliases) ? aliases : [aliases]).filter(
      (a) => a.filterable?.length && a.entity
    )

    for (const alias of aliases) {
      entities.push({
        serviceName: config.serviceName,
        entity: alias.entity,
        fields: Array.from(new Set(alias.filterable)),
        schema,
      })
    }
    return entities
  })

  const getGqlType = (entity, field) => {
    const fieldRef = (servicesEntityMap[entity] as any)?._fields?.[field]

    if (!fieldRef) {
      return
    }

    const fieldType = fieldRef.type.toString()
    const isArray = fieldType.startsWith("[")
    let currentType = fieldType.replace(/\[|\]|\!/g, "")
    const isEnum =
      fieldRef.type?.ofType?.astNode?.kind ===
      GraphQLUtils.Kind.ENUM_TYPE_DEFINITION

    if (isEnum) {
      currentType = "String"
    }

    return isArray ? `[${currentType}]` : currentType
  }

  const schema = allFilterable
    .map(({ serviceName, entity, fields, schema }) => {
      if (!schema) {
        return
      }

      const normalizedEntity = lowerCaseFirst(kebabCase(entity))
      const events = `@Listeners(values: ["${serviceName}.${normalizedEntity}.created", "${serviceName}.${normalizedEntity}.updated", "${serviceName}.${normalizedEntity}.deleted"])`

      const fieldDefinitions = fields
        .map((field) => {
          const type = getGqlType(entity, field) ?? "String"

          return `    ${field}: ${type}`
        })
        .join("\n")

      return `
      type ${entity} ${events} {
        id: ID!
      }
        
      extend type ${entity} {
${fieldDefinitions}
}`
    })
    .join("\n\n")

  return schema
}

/**
 * This util build an internal representation object from the provided schema.
 * It will resolve all modules, fields, link module representation to build
 * the appropriate representation for the index module.
 *
 * This representation will be used to re construct the expected output object from a search
 * but can also be used for anything since the relation tree is available through ref.
 *
 * @param schema
 */
export function buildSchemaObjectRepresentation(schema: string): {
  objectRepresentation: IndexTypes.SchemaObjectRepresentation
  entitiesMap: Record<string, any>
  executableSchema: GraphQLUtils.GraphQLSchema
} {
  const moduleJoinerConfigs = MedusaModule.getAllJoinerConfigs()

  const servicesEntityMap = getServicesEntityMap(moduleJoinerConfigs)
  const filterableEntities = buildSchemaFromFilterableLinks(
    moduleJoinerConfigs,
    servicesEntityMap
  )

  const augmentedSchema =
    CustomDirectives.Listeners.definition +
    "\n" +
    schema +
    "\n" +
    filterableEntities

  const executableSchema = makeSchemaExecutable(augmentedSchema)!
  const entitiesMap = executableSchema.getTypeMap()

  const objectRepresentation = {
    _serviceNameModuleConfigMap: {},
  } as IndexTypes.SchemaObjectRepresentation

  Object.entries(entitiesMap).forEach(([entityName, entityMapValue]) => {
    if (
      !entityMapValue.astNode ||
      entityMapValue.astNode.kind === GraphQLUtils.Kind.SCALAR_TYPE_DEFINITION
    ) {
      return
    }

    processEntity(entityName, {
      entitiesMap,
      servicesEntityMap,
      moduleJoinerConfigs,
      objectRepresentationRef: objectRepresentation,
    })
  })

  objectRepresentation._schemaPropertiesMap =
    buildAliasMap(objectRepresentation)

  return {
    objectRepresentation,
    entitiesMap,
    executableSchema,
  }
}
