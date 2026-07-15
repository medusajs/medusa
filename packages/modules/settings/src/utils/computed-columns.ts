import { RelationshipFilterConfig } from "./relationship-filters"
import { RenderMode } from "./render-mode-mapper"

/**
 * Filter configuration for an injected column.
 */
export interface ComputedColumnFilter {
  enabled: boolean
  operators?: string[]
  /**
   * Relationship dropdown filter. `filter_key` overrides the query-param key
   * the filter posts (e.g. `"location_id"`); options are fetched from
   * `endpoint`. Omit for a plain scalar/enum filter.
   */
  relationship?: RelationshipFilterConfig
  enumValues?: string[]
}

/**
 * Definition of a column injected for an entity, in addition to the columns
 * discovered from its schema. Can be a computed DISPLAY column (provide
 * `renderMode` + `requiredFields`), a FILTER-only column (set `context:
 * "filter"` + `filter`), or both.
 */
export interface ComputedColumnDefinition {
  /**
   * Unique identifier for the column (e.g., "customer_display").
   */
  id: string

  /**
   * Display name for the column.
   */
  name: string

  /**
   * Render mode/type for the column. Required for display columns; omit for
   * filter-only columns.
   */
  renderMode?: RenderMode

  /**
   * Fields required to render this column. Omit for filter-only columns.
   */
  requiredFields?: string[]

  /**
   * Optional fields that enhance the rendering.
   */
  optionalFields?: string[]

  /**
   * Entity names this column applies to.
   */
  entities: string[]

  /**
   * Whether this column should be visible by default.
   */
  defaultVisible?: boolean

  /**
   * Description of the column.
   */
  description?: string

  /**
   * Category for grouping columns (e.g., "relationship", "metadata", "computed").
   */
  category?: string

  /**
   * Metadata for the column.
   */
  metadata?: Record<string, any>

  /**
   * Column context: "display" (default), "filter" (filter-only, not rendered),
   * or "both".
   */
  context?: "display" | "filter" | "both"

  /**
   * Filter configuration. When provided with `enabled: true`, the column is
   * filterable (used for injecting filters the schema doesn't expose, e.g. a
   * field inside an array relationship).
   */
  filter?: ComputedColumnFilter

  /**
   * Column data type (default "string").
   */
  dataType?: string

  /**
   * Whether the column is sortable (default false).
   */
  sortable?: boolean
}

/**
 * Built-in computed columns migrated from entity-mappings.ts.
 */
export const BUILTIN_COMPUTED_COLUMNS: ComputedColumnDefinition[] = [
  // Order computed columns
  {
    id: "customer_display",
    name: "Customer",
    renderMode: "name",
    requiredFields: [
      "customer.first_name",
      "customer.last_name",
      "customer.email",
    ],
    optionalFields: ["customer.phone"],
    entities: ["Order"],
    defaultVisible: true,
    description: "Customer name and contact information",
    category: "relationship",
    metadata: {
      name_source: "customer",
      fallback_fields: ["customer.email", "customer.phone"],
      empty_label_key: "customers.guest",
      empty_label: "Guest",
    },
  },
  {
    id: "shipping_address_display",
    name: "Shipping Address",
    renderMode: "address",
    requiredFields: ["shipping_address.city", "shipping_address.country_code"],
    optionalFields: [
      "shipping_address.address_1",
      "shipping_address.province",
      "shipping_address.postal_code",
    ],
    metadata: {
      address_field: "shipping_address",
    },
    entities: ["Order"],
    defaultVisible: false,
    description: "Shipping address summary",
    category: "relationship",
  },
  {
    id: "billing_address_display",
    name: "Billing Address",
    renderMode: "address",
    requiredFields: ["billing_address.city", "billing_address.country_code"],
    optionalFields: [
      "billing_address.address_1",
      "billing_address.province",
      "billing_address.postal_code",
    ],
    metadata: {
      address_field: "billing_address",
    },
    entities: ["Order"],
    defaultVisible: false,
    description: "Billing address summary",
    category: "relationship",
  },
  {
    id: "order_shipping_country_display",
    name: "Country",
    renderMode: "country_code",
    requiredFields: ["shipping_address.country_code"],
    optionalFields: [],
    entities: ["Order"],
    defaultVisible: true,
    description: "Shipping country",
    category: "metadata",
    metadata: {
      country_code_field: "shipping_address.country_code",
    },
  },

  // Product computed columns
  {
    id: "product_display",
    name: "Product",
    renderMode: "product_info",
    requiredFields: ["title", "thumbnail"],
    optionalFields: ["handle"],
    entities: ["Product"],
    defaultVisible: true,
    description: "Product title and thumbnail",
    category: "computed",
  },
  {
    id: "variants_count",
    name: "Variants",
    renderMode: "count",
    requiredFields: ["variants.id"],
    optionalFields: [],
    entities: ["Product"],
    defaultVisible: true,
    description: "Number of product variants",
    category: "metric",
    metadata: {
      list_field: "variants",
    },
  },
  {
    id: "categories_display",
    name: "Categories",
    renderMode: "badges",
    requiredFields: ["categories.name"],
    optionalFields: [],
    entities: ["Product"],
    defaultVisible: false,
    description: "Product categories",
    category: "relationship",
    metadata: {
      display_field: "name",
      list_field: "categories",
    },
  },
  {
    id: "sales_channels_display",
    name: "Sales Channels",
    renderMode: "badges",
    requiredFields: ["sales_channels.name"],
    optionalFields: [],
    entities: ["Product"],
    defaultVisible: true,
    description: "Sales channels the product is available in",
    category: "relationship",
    metadata: {
      list_field: "sales_channels",
      display_field: "name",
    },
  },

  // Customer computed columns
  {
    id: "customer_name",
    name: "Name",
    renderMode: "name",
    requiredFields: ["first_name", "last_name"],
    optionalFields: [],
    entities: ["Customer"],
    defaultVisible: true,
    description: "Customer's full name",
    category: "computed",
  },

  // Customer group computed columns
  {
    id: "customers_count",
    name: "Customers",
    renderMode: "count",
    requiredFields: ["customers.id"],
    optionalFields: [],
    entities: ["CustomerGroup"],
    defaultVisible: true,
    description: "Number of customers in the group",
    category: "metric",
    metadata: {
      list_field: "customers",
    },
  },

  // Price list computed columns
  {
    id: "price_overrides",
    name: "Price overrides",
    renderMode: "price_overrides_count",
    requiredFields: [],
    optionalFields: [],
    entities: ["PriceList"],
    defaultVisible: true,
    description: "Number of price overrides in the price list",
    category: "metric",
  },

  // Product collection computed columns
  {
    id: "products_count",
    name: "Products",
    renderMode: "count",
    requiredFields: ["products.id"],
    optionalFields: [],
    entities: ["ProductCollection"],
    defaultVisible: true,
    description: "Number of products in the collection",
    category: "metric",
    metadata: {
      list_field: "products",
    },
  },

  // Product option computed columns
  {
    id: "values_count",
    name: "Values",
    renderMode: "count",
    requiredFields: ["values.id"],
    optionalFields: [],
    entities: ["ProductOption"],
    defaultVisible: true,
    description: "Number of values for the option",
    category: "metric",
    metadata: {
      list_field: "values",
    },
  },

  // Promotion computed columns
  {
    id: "method",
    name: "Method",
    renderMode: "promotion_method",
    requiredFields: ["is_automatic"],
    optionalFields: [],
    entities: ["Promotion"],
    defaultVisible: true,
    description: "Whether the promotion is automatic or code based",
    category: "computed",
  },
  {
    id: "status_display",
    name: "Status",
    renderMode: "promotion_status",
    requiredFields: [
      "status",
      "campaign.starts_at",
      "campaign.ends_at",
      "campaign.budget.limit",
      "campaign.budget.used",
    ],
    optionalFields: [],
    entities: ["Promotion"],
    defaultVisible: true,
    description: "Promotion status (derived from status and campaign)",
    category: "computed",
  },

  // Region computed columns
  {
    id: "region_country_display",
    name: "Countries",
    renderMode: "region_countries",
    requiredFields: ["countries.iso_2"],
    optionalFields: [],
    entities: ["Region"],
    defaultVisible: true,
    description: "Countries in the region",
    category: "relationship",
  },
  {
    id: "payment_providers_display",
    name: "Payment providers",
    renderMode: "region_payment_providers",
    requiredFields: ["payment_providers.id"],
    optionalFields: [],
    entities: ["Region"],
    defaultVisible: true,
    description: "Payment providers enabled for the region",
    category: "relationship",
  },

  // Stock location computed columns
  {
    id: "location_address_display",
    name: "Address",
    renderMode: "address",
    requiredFields: ["address.*"],
    optionalFields: [],
    metadata: {
      address_field: "address",
    },
    entities: ["StockLocation"],
    defaultVisible: true,
    description: "Formatted stock location address",
    category: "relationship",
  },
  {
    id: "location_country_display",
    name: "Country",
    renderMode: "country_code",
    requiredFields: ["address.country_code"],
    optionalFields: [],
    entities: ["StockLocation"],
    defaultVisible: true,
    description: "Stock location country",
    category: "metadata",
    metadata: {
      country_code_field: "address.country_code",
    },
  },
  {
    id: "shipping_fulfillment",
    name: "Shipping",
    renderMode: "stock_location_shipping",
    requiredFields: ["fulfillment_sets.type"],
    optionalFields: [],
    entities: ["StockLocation"],
    defaultVisible: true,
    description: "Whether shipping fulfillment is enabled",
    category: "metadata",
  },
  {
    id: "pickup_fulfillment",
    name: "Pickup",
    renderMode: "stock_location_pickup",
    requiredFields: ["fulfillment_sets.type"],
    optionalFields: [],
    entities: ["StockLocation"],
    defaultVisible: true,
    description: "Whether pickup fulfillment is enabled",
    category: "metadata",
  },
  {
    id: "location_sales_channels",
    name: "Connected sales channels",
    renderMode: "stock_location_sales_channels",
    requiredFields: ["sales_channels.name"],
    optionalFields: [],
    entities: ["StockLocation"],
    defaultVisible: true,
    description: "Sales channels served by the location",
    category: "relationship",
  },
  {
    // Filter-only injected column: inventory items reach a location through the
    // `location_levels` array relationship, which the generator can't turn into
    // a usable "location" filter.
    id: "inventory_location_filter",
    name: "Location",
    entities: ["InventoryItem"],
    context: "filter",
    defaultVisible: false,
    description: "Stock location",
    category: "relationship",
    filter: {
      enabled: true,
      operators: ["in"],
      relationship: {
        entity: "StockLocation",
        value_field: "id",
        display_field: "name",
        multiple: true,
        endpoint: "/admin/stock-locations",
        filter_key: "location_levels.location_id",
      },
    },
  },
  {
    id: "reservation_location_filter",
    name: "Location",
    entities: ["ReservationItem"],
    context: "filter",
    defaultVisible: false,
    description: "Stock location",
    category: "relationship",
    filter: {
      enabled: true,
      operators: ["in"],
      relationship: {
        entity: "StockLocation",
        value_field: "id",
        display_field: "name",
        multiple: true,
        endpoint: "/admin/stock-locations",
        filter_key: "location_id",
      },
    },
  },
]

/**
 * Registry for computed columns.
 * Allows registration of custom computed columns.
 */
export class ComputedColumnRegistry {
  private columns: Map<string, ComputedColumnDefinition> = new Map()

  constructor() {
    // Register built-in columns
    for (const column of BUILTIN_COMPUTED_COLUMNS) {
      this.register(column)
    }
  }

  /**
   * Register a computed column.
   */
  register(column: ComputedColumnDefinition): void {
    this.columns.set(column.id, column)
  }

  /**
   * Get a computed column by ID.
   */
  get(id: string): ComputedColumnDefinition | undefined {
    return this.columns.get(id)
  }

  /**
   * Get all computed columns for an entity.
   */
  getForEntity(entityName: string): ComputedColumnDefinition[] {
    const result: ComputedColumnDefinition[] = []
    for (const column of this.columns.values()) {
      if (column.entities.includes(entityName)) {
        result.push(column)
      }
    }
    return result
  }

  /**
   * Get all registered computed columns.
   */
  getAll(): ComputedColumnDefinition[] {
    return Array.from(this.columns.values())
  }

  /**
   * Check if a computed column exists.
   */
  has(id: string): boolean {
    return this.columns.has(id)
  }
}

// Singleton instance
let registryInstance: ComputedColumnRegistry | null = null

/**
 * Get the computed column registry singleton.
 */
export function getComputedColumnRegistry(): ComputedColumnRegistry {
  if (!registryInstance) {
    registryInstance = new ComputedColumnRegistry()
  }
  return registryInstance
}
