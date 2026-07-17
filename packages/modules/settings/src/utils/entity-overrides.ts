import { FieldFilterRules } from "./filter-rules"
import { ComputedColumnDefinition } from "./computed-columns"
import { RenderMode } from "./render-mode-mapper"
import { deduplicate } from "@medusajs/framework/utils"

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
  defaultFieldOrdering?: Record<string, number>

  /**
   * Override the render mode for specific field paths (field path -> render mode).
   * When set, this render mode replaces the inferred one; the inferred data type
   * and semantic type are preserved. Supports dotted paths for nested
   * relationship scalars (e.g. `collection.title`).
   */
  fieldRenderModes?: Record<string, RenderMode>

  /**
   * Per-column renderer configuration (field path -> metadata). Attached to the
   * column's top-level `metadata`. Useful to drive generic renderers without hardcoding
   * them (e.g. a `status` field's value->variant map, or the field path a renderer should
   * read). Supports dotted paths, matching `fieldRenderModes` / `defaultFieldOrdering`.
   */
  fieldMetadata?: Record<string, Record<string, any>>

  /**
   * Additional GraphQL types to include fields from.
   */
  additionalTypes?: string[]

  /**
   * Fields that should be displayed as columns but cannot be filtered on.
   * Use for fields that exist on the entity (e.g. computed enums like
   * `payment_status`) but are not accepted by the corresponding list API.
   * Dotted paths are supported (e.g. `customer.email`) to target
   * nested-relationship scalar fields, matching the convention used by
   * `defaultVisibleFields` and `defaultFieldOrdering`.
   */
  nonFilterableFields?: string[]

  /**
   * Fields that should be displayed as columns but cannot be sorted on.
   * Use for fields that exist on the entity (e.g. computed enums like
   * `payment_status`) but are not accepted by the corresponding list API.
   * Dotted paths are supported (e.g. `customer.email`) to target
   * nested-relationship scalar fields, matching the convention used by
   * `defaultVisibleFields` and `defaultFieldOrdering`.
   */
  nonSortableFields?: string[]

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
      "order_shipping_country_display",
      "sales_channel.name",
    ],
    defaultFieldOrdering: {
      display_id: 100,
      custom_display_id: 101,
      created_at: 200,
      customer_display: 300,
      "sales_channel.name": 400,
      payment_status: 500,
      fulfillment_status: 600,
      total: 700,
      order_shipping_country_display: 800,
    },
    nonFilterableFields: ["payment_status", "fulfillment_status"],
    fieldMetadata: {
      payment_status: { resolver: "order_payment_status" },
      fulfillment_status: { resolver: "order_fulfillment_status" },
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
    defaultFieldOrdering: {
      product_display: 100,
      "collection.title": 200,
      sales_channels_display: 300,
      variants_count: 400,
      status: 500,
    },
    fieldMetadata: {
      status: { resolver: "product_status" },
    },
  },
  Customer: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "email",
      "customer_name",
      "has_account",
      "created_at",
    ],
    defaultFieldOrdering: {
      email: 100,
      customer_name: 200,
      has_account: 300,
      created_at: 400,
    },
  },
  CustomerGroup: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "name",
      "customers_count",
      "created_at",
      "updated_at",
    ],
    defaultFieldOrdering: {
      name: 100,
      customers_count: 200,
      created_at: 300,
      updated_at: 400,
    },
  },
  PriceList: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["title", "status", "price_overrides"],
    defaultFieldOrdering: {
      title: 100,
      status: 200,
      price_overrides: 300,
    },
    fieldMetadata: {
      status: { resolver: "price_list_status" },
    },
  },
  ProductCollection: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["title", "handle", "products_count"],
    defaultFieldOrdering: {
      title: 100,
      handle: 200,
      products_count: 300,
    },
    fieldRenderModes: {
      handle: "handle",
    },
  },
  ProductOption: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["title", "values_count", "is_exclusive"],
    defaultFieldOrdering: {
      title: 100,
      values_count: 200,
      is_exclusive: 300,
    },
    fieldRenderModes: {
      is_exclusive: "product_option_exclusivity",
    },
  },
  ProductOptionValue: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["value"],
    defaultFieldOrdering: {
      value: 100,
    },
  },
  InventoryItem: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "title",
      "sku",
      "reserved_quantity",
      "stocked_quantity",
    ],
    defaultFieldOrdering: {
      title: 100,
      sku: 200,
      reserved_quantity: 300,
      stocked_quantity: 400,
    },
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
    defaultFieldOrdering: {
      email: 100,
      first_name: 200,
      last_name: 300,
      created_at: 400,
      updated_at: 500,
    },
  },
  Region: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "name",
      "region_country_display",
      "payment_providers_display",
    ],
    defaultFieldOrdering: {
      name: 100,
      region_country_display: 200,
      payment_providers_display: 300,
    },
  },
  Promotion: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["code", "method", "status_display"],
    defaultFieldOrdering: {
      code: 100,
      method: 200,
      status_display: 300,
    },
  },
  Campaign: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "name",
      "description",
      "campaign_identifier",
      "starts_at",
      "ends_at",
    ],
    defaultFieldOrdering: {
      name: 100,
      description: 200,
      campaign_identifier: 300,
      starts_at: 400,
      ends_at: 500,
    },
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
    defaultFieldOrdering: {
      name: 100,
      description: 200,
      is_disabled: 300,
      created_at: 400,
      updated_at: 500,
    },
    // is_disabled would infer as boolean; force the status renderer and route
    // it through the sales_channel_status resolver.
    fieldRenderModes: {
      is_disabled: "status",
    },
    fieldMetadata: {
      is_disabled: { resolver: "sales_channel_status" },
    },
  },
  ReturnReason: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["label", "value", "description"],
    defaultFieldOrdering: {
      label: 100,
      value: 200,
      description: 300,
    },
  },
  RefundReason: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["label", "code", "description"],
    defaultFieldOrdering: {
      label: 100,
      code: 200,
      description: 300,
    },
  },
  ProductType: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["value", "created_at", "updated_at"],
    defaultFieldOrdering: {
      value: 100,
      created_at: 200,
      updated_at: 300,
    },
  },
  ProductTag: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["value", "created_at", "updated_at"],
    defaultFieldOrdering: {
      value: 100,
      created_at: 200,
      updated_at: 300,
    },
  },
  ShippingProfile: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: ["name", "type"],
    defaultFieldOrdering: {
      name: 100,
      type: 200,
    },
  },
  ShippingOptionType: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "label",
      "code",
      "description",
      "created_at",
      "updated_at",
    ],
    defaultFieldOrdering: {
      label: 100,
      code: 200,
      description: 300,
      created_at: 400,
      updated_at: 500,
    },
  },
  ReservationItem: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "inventory_item.sku",
      "description",
      "created_at",
      "quantity",
    ],
    defaultFieldOrdering: {
      "inventory_item.sku": 100,
      description: 200,
      created_at: 300,
      quantity: 400,
    },
  },
  StockLocation: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "name",
      "location_address_display",
      "shipping_fulfillment",
      "pickup_fulfillment",
      "location_sales_channels",
    ],
    defaultFieldOrdering: {
      name: 100,
      location_address_display: 200,
      shipping_fulfillment: 300,
      pickup_fulfillment: 400,
      location_sales_channels: 500,
    },
  },
  ApiKey: {
    excludeSuffixes: ["_link"],
    excludePrefixes: ["raw_"],
    excludeFields: [],
    defaultVisibleFields: [
      "title",
      "redacted",
      "type",
      "revoked_at",
      "last_used_at",
      "created_at",
    ],
    defaultFieldOrdering: {
      title: 100,
      redacted: 200,
      type: 300,
      revoked_at: 400,
      last_used_at: 500,
      created_at: 600,
    },
    // Token badge, type label, and active/revoked status all use dedicated
    // renderers registered by the api key table.
    fieldRenderModes: {
      redacted: "api_key_token",
      type: "api_key_type",
      revoked_at: "status",
    },
    // revoked_at drives active/revoked via the api_key_status resolver.
    fieldMetadata: {
      revoked_at: { resolver: "api_key_status" },
    },
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
        excludeFields: deduplicate([
          ...(existing.excludeFields || []),
          ...(override.excludeFields || []),
        ]),
        excludeSuffixes: override.excludeSuffixes ?? existing.excludeSuffixes,
        excludePrefixes: override.excludePrefixes ?? existing.excludePrefixes,
        defaultVisibleFields:
          override.defaultVisibleFields ?? existing.defaultVisibleFields,
        defaultFieldOrdering: {
          ...(existing.defaultFieldOrdering || {}),
          ...(override.defaultFieldOrdering || {}),
        },
        fieldRenderModes: {
          ...(existing.fieldRenderModes || {}),
          ...(override.fieldRenderModes || {}),
        },
        additionalTypes: deduplicate([
          ...(existing.additionalTypes || []),
          ...(override.additionalTypes || []),
        ]),
        nonFilterableFields: deduplicate([
          ...(existing.nonFilterableFields || []),
          ...(override.nonFilterableFields || []),
        ]),
        nonSortableFields: deduplicate([
          ...(existing.nonSortableFields || []),
          ...(override.nonSortableFields || []),
        ]),
        fieldMetadata: {
          ...(existing.fieldMetadata || {}),
          ...(override.fieldMetadata || {}),
        },
        computedColumns: deduplicate([
          ...(existing.computedColumns || []),
          ...(override.computedColumns || []),
        ]),
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
  return resolvedOverride?.defaultFieldOrdering || {}
}

/**
 * Get the per-field render mode overrides for an entity.
 * @param entityName - The entity name (used if override is not provided)
 * @param override - Optional pre-resolved override to use instead of looking up by entity name
 */
export function getFieldRenderModes(
  entityName: string,
  override?: EntityOverride
): Record<string, RenderMode> {
  const resolvedOverride = override ?? getEntityOverride(entityName)
  return resolvedOverride?.fieldRenderModes || {}
}

/**
 * Get the per-column metadata overrides for an entity.
 * @param entityName - The entity name (used if override is not provided)
 * @param override - Optional pre-resolved override to use instead of looking up by entity name
 */
export function getFieldMetadata(
  entityName: string,
  override?: EntityOverride
): Record<string, Record<string, any>> {
  const resolvedOverride = override ?? getEntityOverride(entityName)
  return resolvedOverride?.fieldMetadata || {}
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
 * Get fields that should be displayed but not filterable for an entity.
 * @param entityName - The entity name (used if override is not provided)
 * @param override - Optional pre-resolved override to use instead of looking up by entity name
 */
export function getNonFilterableFields(
  entityName: string,
  override?: EntityOverride
): string[] {
  const resolvedOverride = override ?? getEntityOverride(entityName)
  return resolvedOverride?.nonFilterableFields || []
}

/**
 * Get fields that should be displayed but not sortable for an entity.
 * @param entityName - The entity name (used if override is not provided)
 * @param override - Optional pre-resolved override to use instead of looking up by entity name
 */
export function getNonSortableFields(
  entityName: string,
  override?: EntityOverride
): string[] {
  const resolvedOverride = override ?? getEntityOverride(entityName)
  return resolvedOverride?.nonSortableFields || []
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
