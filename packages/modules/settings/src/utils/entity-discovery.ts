import {
  cleanGraphQLSchema,
  GraphQLObjectType,
  graphqlSchemaToFields,
  isListType,
  isNonNullType,
  kebabCase,
  makeExecutableSchema,
  mergeTypeDefs,
  pluralize,
  print,
  singularize,
} from "@medusajs/framework/utils"

/**
 * Joiner config interface (subset of what we need).
 */
export interface JoinerConfig {
  serviceName?: string
  schema?: string
  primaryKeys?: string[]
  linkableKeys?: Record<string, string>
  isLink?: boolean
}

/**
 * Convert PascalCase to kebab-case with pluralization.
 */
export function toKebabCasePlural(name: string): string {
  const kebab = kebabCase(name)

  return pluralize(kebab)
}

/**
 * Normalize entity name to PascalCase.
 */
function normalizeEntityName(name: string): string {
  // Handle kebab-case (e.g., "sales-channels" -> "SalesChannel")
  if (name.includes("-")) {
    return singularize(
      name
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
    )
  }

  // Handle snake_case (e.g., "sales_channel" -> "SalesChannel")
  if (name.includes("_")) {
    return singularize(
      name
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")
    )
  }

  // Already PascalCase or camelCase
  return singularize(name.charAt(0).toUpperCase() + name.slice(1))
}

/**
 * Discovered entity metadata.
 */
export interface DiscoveredEntity {
  name: string
  pluralName: string
  module: string
  graphqlType: string
  schema: string
  primaryKeys: string[]
  linkableKeys: Record<string, string>
}

/**
 * Schema type map from merged GraphQL schemas.
 */
export interface SchemaTypeMap {
  [key: string]: GraphQLObjectType | any
}

/**
 * Entity info as returned by the API.
 */
export interface EntityInfo {
  name: string
  pluralName: string
  module: string
  propertyCount: number
  hasOverrides: boolean
}

/**
 * Service for discovering entities from joiner configs.
 * Unlike the API version, this service requires explicit initialization
 * with joiner configs (typically in onApplicationStart hook).
 */
export class EntityDiscoveryService {
  private schemaTypeMap: SchemaTypeMap | null = null
  private discoveredEntities: DiscoveredEntity[] | null = null
  private joinerConfigs: JoinerConfig[] = []
  private initialized: boolean = false

  /**
   * Initialize the service with joiner configs.
   * Should be called from onApplicationStart hook.
   */
  initialize(joinerConfigs: JoinerConfig[]): void {
    this.joinerConfigs = joinerConfigs
    this.initialized = true
    // Clear cache when reinitializing
    this.schemaTypeMap = null
    this.discoveredEntities = null
  }

  /**
   * Check if the service has been initialized.
   */
  isInitialized(): boolean {
    return this.initialized
  }

  /**
   * Build and cache the merged schema type map.
   */
  getSchemaTypeMap(): SchemaTypeMap {
    if (!this.initialized) {
      return {}
    }

    if (this.schemaTypeMap) {
      return this.schemaTypeMap
    }

    const schemaFragments: string[] = []

    for (const config of this.joinerConfigs) {
      if (config.schema) {
        schemaFragments.push(config.schema)
      }
    }

    if (schemaFragments.length === 0) {
      return {}
    }

    const scalarDefinitions = `
      scalar DateTime
      scalar JSON
    `

    const allSchemas = [scalarDefinitions, ...schemaFragments]
    const mergedSchemaAST = mergeTypeDefs(allSchemas)
    const mergedSchemaString = print(mergedSchemaAST)
    const { schema: cleanedSchemaString } =
      cleanGraphQLSchema(mergedSchemaString)

    const schema = makeExecutableSchema({
      typeDefs: cleanedSchemaString,
      resolvers: {},
    })

    this.schemaTypeMap = schema.getTypeMap()
    return this.schemaTypeMap
  }

  /**
   * Discover all entities from joiner configs.
   * Filters out link configs and returns metadata about each entity.
   */
  discoverEntities(): DiscoveredEntity[] {
    if (!this.initialized) {
      return []
    }

    if (this.discoveredEntities) {
      return this.discoveredEntities
    }

    const entities: DiscoveredEntity[] = []
    const seenTypes = new Set<string>()

    for (const config of this.joinerConfigs) {
      // Skip link configs
      if (config.isLink) {
        continue
      }

      // Skip if no schema
      if (!config.schema) {
        continue
      }

      const serviceName = config.serviceName || ""

      // Extract type name from schema by finding "type <Name> {"
      const typeMatches = config.schema.matchAll(/type\s+(\w+)\s*\{/g)

      for (const match of typeMatches) {
        const typeName = match[1]

        // Skip if we've already seen this type
        if (seenTypes.has(typeName)) {
          continue
        }

        // Skip utility types
        if (
          typeName.endsWith("Link") ||
          typeName.startsWith("_") ||
          typeName === "Query" ||
          typeName === "Mutation"
        ) {
          continue
        }

        seenTypes.add(typeName)

        entities.push({
          name: typeName,
          pluralName: toKebabCasePlural(typeName),
          module: serviceName,
          graphqlType: typeName,
          schema: config.schema,
          primaryKeys: config.primaryKeys || ["id"],
          linkableKeys: config.linkableKeys || {},
        })
      }
    }

    this.discoveredEntities = entities
    return entities
  }

  /**
   * Get an entity by name.
   * Supports PascalCase, kebab-case, snake_case, and plural forms.
   */
  getEntity(name: string): DiscoveredEntity | null {
    const entities = this.discoverEntities()

    // Try direct match on name
    let entity = entities.find(
      (e) => e.name.toLowerCase() === name.toLowerCase()
    )
    if (entity) {
      return entity
    }

    // Try plural name match
    entity = entities.find(
      (e) => e.pluralName.toLowerCase() === name.toLowerCase()
    )
    if (entity) {
      return entity
    }

    // Try normalizing the input name
    const normalized = normalizeEntityName(name)
    entity = entities.find(
      (e) => e.name.toLowerCase() === normalized.toLowerCase()
    )
    if (entity) {
      return entity
    }

    return null
  }

  /**
   * Check if an entity exists by name.
   */
  hasEntity(name: string): boolean {
    return this.getEntity(name) !== null
  }

  /**
   * Get the GraphQL type for an entity.
   */
  getEntityType(entityName: string): GraphQLObjectType | null {
    const entity = this.getEntity(entityName)
    if (!entity) {
      return null
    }

    const schemaTypeMap = this.getSchemaTypeMap()
    return schemaTypeMap[entity.graphqlType] as GraphQLObjectType | null
  }

  /**
   * Get fields for an entity type.
   */
  getEntityFields(entityName: string): string[] {
    const entity = this.getEntity(entityName)
    if (!entity) {
      return []
    }

    const schemaTypeMap = this.getSchemaTypeMap()
    return graphqlSchemaToFields(schemaTypeMap, entity.graphqlType, [])
  }

  /**
   * Get entity info for the API response.
   */
  getEntityInfo(entity: DiscoveredEntity, hasOverrides: boolean): EntityInfo {
    const schemaTypeMap = this.getSchemaTypeMap()
    const entityType = schemaTypeMap[entity.graphqlType] as
      | GraphQLObjectType
      | undefined
    const fieldCount = entityType?.getFields
      ? Object.keys(entityType.getFields()).length
      : 0

    return {
      name: entity.name,
      pluralName: entity.pluralName,
      module: entity.module,
      propertyCount: fieldCount,
      hasOverrides,
    }
  }

  /**
   * Clear the cache (useful for testing).
   */
  clearCache(): void {
    this.schemaTypeMap = null
    this.discoveredEntities = null
  }
}

/**
 * Helper to get the underlying type from wrapped types (NonNull, List).
 */
export function getUnderlyingType(type: any): any {
  if (type.ofType) {
    return getUnderlyingType(type.ofType)
  }
  return type
}

/**
 * Helper to check if a field type is an array/list.
 */
export function isArrayField(type: any): boolean {
  if (isListType(type)) {
    return true
  }
  if (isNonNullType(type)) {
    return isArrayField(type.ofType)
  }
  return false
}

/**
 * Helper to check if a field is a single relationship (many-to-one, one-to-one).
 */
export function isSingleRelationship(type: any): boolean {
  if (isArrayField(type)) {
    return false
  }

  const underlyingType = getUnderlyingType(type)
  return underlyingType instanceof GraphQLObjectType
}

export { isListType, isNonNullType }
