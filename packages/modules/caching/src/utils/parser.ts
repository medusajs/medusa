import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { isObject } from "@medusajs/framework/utils"
import {
  GraphQLObjectType,
  GraphQLSchema,
  isListType,
  isNonNullType,
  isObjectType,
} from "graphql"

export interface EntityReference {
  type: string
  id: string | number
  field?: string
  isInArray?: boolean
}

export interface InvalidationEvent {
  entityType: string
  entityId: string | number
  relatedEntities: EntityReference[]
  cacheKeys: string[]
}

export class CacheInvalidationParser {
  private typeMap: Map<string, GraphQLObjectType>
  private idPrefixToEntityName: Record<string, string>

  constructor(schema: GraphQLSchema, joinerConfigs: ModuleJoinerConfig[]) {
    this.typeMap = new Map()

    // Build type map for quick lookups
    const schemaTypeMap = schema.getTypeMap()
    Object.keys(schemaTypeMap).forEach((typeName) => {
      const type = schemaTypeMap[typeName]
      if (isObjectType(type) && !typeName.startsWith("__")) {
        this.typeMap.set(typeName, type)
      }
    })

    this.idPrefixToEntityName = joinerConfigs.reduce((acc, joinerConfig) => {
      if (joinerConfig.idPrefixToEntityName) {
        Object.entries(joinerConfig.idPrefixToEntityName).forEach(
          ([idPrefix, entityName]) => {
            acc[idPrefix] = entityName
          }
        )
      }
      return acc
    }, {} as Record<string, string>)
  }

  /**
   * Parse an object to identify entities and their relationships
   */
  parseObjectForEntities(
    obj: any,
    parentType?: string,
    isInArray: boolean = false
  ): EntityReference[] {
    const entities: EntityReference[] = []

    if (!obj || typeof obj !== "object") {
      return entities
    }

    // Check if this object matches any known GraphQL types
    const detectedType = this.detectEntityType(obj, parentType)
    if (detectedType && obj.id) {
      entities.push({
        type: detectedType,
        id: obj.id,
        isInArray,
      })
    }

    // Recursively parse nested objects and arrays
    Object.keys(obj).forEach((key) => {
      const value = obj[key]

      if (Array.isArray(value)) {
        value.forEach((item) => {
          entities.push(
            ...this.parseObjectForEntities(
              item,
              this.getRelationshipType(detectedType, key),
              true
            )
          )
        })
      } else if (isObject(value)) {
        entities.push(
          ...this.parseObjectForEntities(
            value,
            this.getRelationshipType(detectedType, key),
            false
          )
        )
      }
    })

    return entities
  }

  /**
   * Detect entity type based on object structure and GraphQL type map
   */
  private detectEntityType(obj: any, suggestedType?: string): string | null {
    if (obj.id) {
      const idParts = obj.id.split("_")
      if (idParts.length > 1 && this.idPrefixToEntityName[idParts[0]]) {
        return this.idPrefixToEntityName[idParts[0]]
      }
    }

    if (suggestedType && this.typeMap.has(suggestedType)) {
      const type = this.typeMap.get(suggestedType)!
      if (this.objectMatchesType(obj, type)) {
        return suggestedType
      }
    }

    // Try to match against all known types
    for (const [typeName, type] of this.typeMap) {
      if (this.objectMatchesType(obj, type)) {
        return typeName
      }
    }

    return null
  }

  /**
   * Check if object structure matches GraphQL type fields
   */
  private objectMatchesType(obj: any, type: GraphQLObjectType): boolean {
    const fields = type.getFields()
    const objKeys = Object.keys(obj)

    // Must have id field for entities
    if (!obj.id || !fields.id) {
      return false
    }

    // Check if at least 50% of non-null object fields match type fields
    const matchingFields = objKeys.filter((key) => fields[key]).length
    return matchingFields >= Math.max(1, objKeys.length * 0.5)
  }

  /**
   * Get the expected type for a relationship field
   */
  private getRelationshipType(
    parentType: string | null,
    fieldName: string
  ): string | undefined {
    if (!parentType || !this.typeMap.has(parentType)) {
      return undefined
    }

    const type = this.typeMap.get(parentType)!
    const field = type.getFields()[fieldName]

    if (!field) {
      return undefined
    }

    let fieldType = field.type

    // Unwrap NonNull and List wrappers
    if (isNonNullType(fieldType)) {
      fieldType = fieldType.ofType
    }
    if (isListType(fieldType)) {
      fieldType = fieldType.ofType
    }
    if (isNonNullType(fieldType)) {
      fieldType = fieldType.ofType
    }

    if (isObjectType(fieldType)) {
      return fieldType.name
    }

    return undefined
  }

  /**
   * Build invalidation events based on parsed entities
   */
  buildInvalidationEvents(
    entities: EntityReference[],
    operation: "created" | "updated" | "deleted" = "updated"
  ): InvalidationEvent[] {
    const events: InvalidationEvent[] = []
    const processedEntities = new Set<string>()

    entities.forEach((entity) => {
      const entityKey = `${entity.type}:${entity.id}`

      if (processedEntities.has(entityKey)) {
        return
      }
      processedEntities.add(entityKey)

      const relatedEntities = entities.filter(
        (e) => e.type !== entity.type || e.id !== entity.id
      )

      const affectedKeys = this.buildAffectedCacheKeys(entity, operation)

      events.push({
        entityType: entity.type,
        entityId: entity.id,
        relatedEntities,
        cacheKeys: affectedKeys,
      })
    })

    return events
  }

  /**
   * Build list of cache keys that should be invalidated
   */
  private buildAffectedCacheKeys(
    entity: EntityReference,
    operation: "created" | "updated" | "deleted" = "updated"
  ): string[] {
    const keys = new Set<string>()

    keys.add(`${entity.type}:${entity.id}`)

    // Add the list key when the entity was found in an array context or for
    // created/updated/deleted operations. Updates are included because a
    // mutation can change whether an entity matches a cached list's filters
    // (e.g. a product going from draft to published), and the cache layer has
    // no way of knowing which fields are filter-relevant.
    if (entity.isInArray || ["created", "updated", "deleted"].includes(operation)) {
      keys.add(`${entity.type}:list:*`)
    }

    return Array.from(keys)
  }
}
