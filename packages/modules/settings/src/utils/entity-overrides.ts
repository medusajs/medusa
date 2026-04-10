import { FieldFilterRules } from "./filter-rules"
import { ComputedColumnDefinition } from "./computed-columns"

/**
 * Override configuration for an entity.
 * Allows customizing how columns are generated and displayed.
 */
export interface EntityOverride {
  /**
   * Specific field names to exclude.
   */
  excludeFields?: string[]

  /**
   * Field name suffixes to exclude.
   */
  excludeSuffixes?: string[]

  /**
   * Field name prefixes to exclude.
   */
  excludePrefixes?: string[]

  /**
   * Fields to show by default (in order).
   */
  defaultVisibleFields?: string[]

  /**
   * Custom ordering for fields (field name -> order number).
   * Lower numbers appear first.
   */
  fieldOrdering?: Record<string, number>

  /**
   * Additional GraphQL types to include fields from.
   */
  additionalTypes?: string[]

  /**
   * Computed columns specific to this entity.
   * Note: Computed columns can also be defined in the ComputedColumnRegistry.
   */
  computedColumns?: ComputedColumnDefinition[]
}

/**
 * Built-in entity overrides for core Medusa entities.
 * These provide backward compatibility and sensible defaults.
 */
export const BUILTIN_ENTITY_OVERRIDES: Record<string, EntityOverride> = {
  Order: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: ["order_change"],
    additionalTypes: ["OrderDetail"],
    defaultVisibleFields: [
      "display_id",
      "created_at",
      "payment_status",
      "fulfillment_status",
      "total",
      "customer_display",
      "country",
      "sales_channel.name",
    ],
    fieldOrdering: {
      display_id: 100,
      custom_display_id: 101,
      created_at: 200,
      customer_display: 300,
      "sales_channel.name": 400,
      fulfillment_status: 500,
      payment_status: 600,
      total: 700,
      country: 800,
    },
  },
  Product: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "product_display",
      "collection.title",
      "sales_channels_display",
      "variants_count",
      "status",
    ],
    fieldOrdering: {
      product_display: 100,
      "collection.title": 200,
      sales_channels_display: 300,
      variants_count: 400,
      status: 500,
    },
  },
  Customer: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "email",
      "first_name",
      "last_name",
      "created_at",
      "updated_at",
    ],
    fieldOrdering: {},
  },
  User: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "email",
      "first_name",
      "last_name",
      "created_at",
      "updated_at",
    ],
    fieldOrdering: {},
  },
  Region: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["name", "currency_code", "created_at", "updated_at"],
    fieldOrdering: {},
  },
  SalesChannel: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "name",
      "description",
      "is_disabled",
      "created_at",
      "updated_at",
    ],
    fieldOrdering: {},
  },
}

/**
 * Registry for entity overrides.
 * Allows registration of custom overrides for any entity.
 */
export class EntityOverrideRegistry {
  private overrides: Map<string, EntityOverride> = new Map()

  constructor() {
    // Register built-in overrides
    for (const [entityName, override] of Object.entries(
      BUILTIN_ENTITY_OVERRIDES
    )) {
      this.register(entityName, override)
    }
  }

  /**
   * Register an override for an entity.
   * If an override already exists, it will be merged (new values take precedence).
   */
  register(entityName: string, override: EntityOverride): void {
    const existing = this.overrides.get(entityName)
    if (existing) {
      // Merge overrides - new values take precedence
      this.overrides.set(entityName, {
        excludeFields: [
          ...(existing.excludeFields || []),
          ...(override.excludeFields || []),
        ],
        excludeSuffixes:
          override.excludeSuffixes ?? existing.excludeSuffixes,
        excludePrefixes:
          override.excludePrefixes ?? existing.excludePrefixes,
        defaultVisibleFields:
          override.defaultVisibleFields ?? existing.defaultVisibleFields,
        fieldOrdering: {
          ...(existing.fieldOrdering || {}),
          ...(override.fieldOrdering || {}),
        },
        additionalTypes: [
          ...(existing.additionalTypes || []),
          ...(override.additionalTypes || []),
        ],
        computedColumns: [
          ...(existing.computedColumns || []),
          ...(override.computedColumns || []),
        ],
      })
    } else {
      this.overrides.set(entityName, override)
    }
  }

  /**
   * Get the override for an entity.
   */
  get(entityName: string): EntityOverride | undefined {
    return this.overrides.get(entityName)
  }

  /**
   * Check if an entity has an override.
   */
  has(entityName: string): boolean {
    return this.overrides.has(entityName)
  }

  /**
   * Get all registered entity names.
   */
  getEntityNames(): string[] {
    return Array.from(this.overrides.keys())
  }

  /**
   * Get all overrides as a record.
   */
  getAll(): Record<string, EntityOverride> {
    const result: Record<string, EntityOverride> = {}
    for (const [name, override] of this.overrides.entries()) {
      result[name] = override
    }
    return result
  }
}

// Singleton instance
let registryInstance: EntityOverrideRegistry | null = null

/**
 * Get the entity override registry singleton.
 */
export function getEntityOverrideRegistry(): EntityOverrideRegistry {
  if (!registryInstance) {
    registryInstance = new EntityOverrideRegistry()
  }
  return registryInstance
}

/**
 * Reset the entity override registry (for testing purposes).
 */
export function resetEntityOverrideRegistry(): void {
  registryInstance = null
}

/**
 * Get the entity override for an entity name.
 * Returns undefined if no override exists.
 */
export function getEntityOverride(
  entityName: string
): EntityOverride | undefined {
  return getEntityOverrideRegistry().get(entityName)
}

/**
 * Check if an entity has custom overrides.
 */
export function hasEntityOverride(entityName: string): boolean {
  return getEntityOverrideRegistry().has(entityName)
}

/**
 * Get the field filter rules for an entity, merging with defaults.
 * @param entityName - The entity name (used if override is not provided)
 * @param override - Optional pre-resolved override to use instead of looking up by entity name
 */
export function getFieldFilterRules(
  entityName: string,
  override?: EntityOverride
): FieldFilterRules {
  const resolvedOverride = override ?? getEntityOverride(entityName)

  return {
    excludeSuffixes: resolvedOverride?.excludeSuffixes || ["_link"],
    excludePrefixes: resolvedOverride?.excludePrefixes || ["raw_"],
    excludeFields: resolvedOverride?.excludeFields || [],
  }
}

/**
 * Get the default visible fields for an entity.
 * @param entityName - The entity name (used if override is not provided)
 * @param override - Optional pre-resolved override to use instead of looking up by entity name
 */
export function getDefaultVisibleFields(
  entityName: string,
  override?: EntityOverride
): string[] {
  const resolvedOverride = override ?? getEntityOverride(entityName)
  return resolvedOverride?.defaultVisibleFields || []
}

/**
 * Get the field ordering for an entity.
 * @param entityName - The entity name (used if override is not provided)
 * @param override - Optional pre-resolved override to use instead of looking up by entity name
 */
export function getFieldOrdering(
  entityName: string,
  override?: EntityOverride
): Record<string, number> {
  const resolvedOverride = override ?? getEntityOverride(entityName)
  return resolvedOverride?.fieldOrdering || {}
}

/**
 * Get additional types to include for an entity.
 * @param entityName - The entity name (used if override is not provided)
 * @param override - Optional pre-resolved override to use instead of looking up by entity name
 */
export function getAdditionalTypes(
  entityName: string,
  override?: EntityOverride
): string[] {
  const resolvedOverride = override ?? getEntityOverride(entityName)
  return resolvedOverride?.additionalTypes || []
}

/**
 * Map from plural/route names to entity names for backward compatibility.
 */
export const ROUTE_TO_ENTITY_MAP: Record<string, string> = {
  orders: "Order",
  products: "Product",
  customers: "Customer",
  users: "User",
  regions: "Region",
  "sales-channels": "SalesChannel",
}

/**
 * Get the entity name from a route/plural name.
 */
export function entityNameFromRoute(routeName: string): string | undefined {
  return ROUTE_TO_ENTITY_MAP[routeName]
}

/**
 * @deprecated Use `getEntityOverrideRegistry()` instead.
 * Backward compatibility export - returns a snapshot of current overrides.
 */
export const ENTITY_OVERRIDES: Record<string, EntityOverride> =
  BUILTIN_ENTITY_OVERRIDES
