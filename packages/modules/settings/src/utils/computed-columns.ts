import { RelationshipFilterConfig } from "./relationship-filters"
import {
  ColumnCategory,
  ColumnDataType,
  FilterOperator,
  RenderMode,
} from "./render-mode-mapper"

/**
 * Filter configuration for an injected column.
 */
export interface ComputedColumnFilter {
  enabled: boolean
  /**
   * Useful for customizations where you want to control the operators that are available for the filter.
   */
  operators?: FilterOperator[]
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
  category?: ColumnCategory

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
  dataType?: ColumnDataType

  /**
   * Whether the column is sortable (default false).
   */
  sortable?: boolean
}

/**
 * Built-in computed columns, keyed by the entity they belong to.
 */
export const BUILTIN_COMPUTED_COLUMNS: Record<
  string,
  ComputedColumnDefinition[]
> = {
  Order: [
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
      requiredFields: [
        "shipping_address.city",
        "shipping_address.country_code",
      ],
      optionalFields: [
        "shipping_address.address_1",
        "shipping_address.province",
        "shipping_address.postal_code",
      ],
      metadata: {
        address_field: "shipping_address",
      },
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
      defaultVisible: true,
      description: "Shipping country",
      category: "metadata",
      metadata: {
        country_code_field: "shipping_address.country_code",
      },
    },
  ],

  Product: [
    {
      id: "product_display",
      name: "Product",
      renderMode: "product_info",
      requiredFields: ["title", "thumbnail"],
      optionalFields: ["handle"],
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
      defaultVisible: true,
      description: "Sales channels the product is available in",
      category: "relationship",
      metadata: {
        list_field: "sales_channels",
        display_field: "name",
      },
    },
  ],

  Customer: [
    {
      id: "customer_name",
      name: "Name",
      renderMode: "name",
      requiredFields: ["first_name", "last_name"],
      optionalFields: [],
      defaultVisible: true,
      description: "Customer's full name",
      category: "computed",
    },
  ],

  CustomerGroup: [
    {
      id: "customers_count",
      name: "Customers",
      renderMode: "count",
      requiredFields: ["customers.id"],
      optionalFields: [],
      defaultVisible: true,
      description: "Number of customers in the group",
      category: "metric",
      metadata: {
        list_field: "customers",
      },
    },
  ],

  PriceList: [
    {
      id: "price_overrides",
      name: "Price overrides",
      renderMode: "price_overrides_count",
      requiredFields: [],
      optionalFields: [],
      defaultVisible: true,
      description: "Number of price overrides in the price list",
      category: "metric",
    },
  ],

  ProductCollection: [
    {
      id: "products_count",
      name: "Products",
      renderMode: "count",
      requiredFields: ["products.id"],
      optionalFields: [],
      defaultVisible: true,
      description: "Number of products in the collection",
      category: "metric",
      metadata: {
        list_field: "products",
      },
    },
  ],

  ProductOption: [
    {
      id: "values_count",
      name: "Values",
      renderMode: "count",
      requiredFields: ["values.id"],
      optionalFields: [],
      defaultVisible: true,
      description: "Number of values for the option",
      category: "metric",
      metadata: {
        list_field: "values",
      },
    },
  ],

  Promotion: [
    {
      id: "method",
      name: "Method",
      renderMode: "promotion_method",
      requiredFields: ["is_automatic"],
      optionalFields: [],
      defaultVisible: true,
      description: "Whether the promotion is automatic or code based",
      category: "computed",
    },
    {
      id: "status_display",
      name: "Status",
      renderMode: "status",
      requiredFields: [
        "status",
        "campaign.starts_at",
        "campaign.ends_at",
        "campaign.budget.limit",
        "campaign.budget.used",
      ],
      optionalFields: [],
      defaultVisible: true,
      description: "Promotion status (derived from status and campaign)",
      metadata: { resolver: "promotion_status" },
      category: "computed",
    },
  ],

  Region: [
    {
      id: "region_country_display",
      name: "Countries",
      renderMode: "region_countries",
      requiredFields: ["countries.iso_2"],
      optionalFields: [],
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
      defaultVisible: true,
      description: "Payment providers enabled for the region",
      category: "relationship",
    },
  ],

  StockLocation: [
    {
      id: "location_address_display",
      name: "Address",
      renderMode: "address",
      requiredFields: ["address.*"],
      optionalFields: [],
      metadata: {
        address_field: "address",
      },
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
      defaultVisible: true,
      description: "Sales channels served by the location",
      category: "relationship",
    },
  ],

  InventoryItem: [
    {
      // Filter-only injected column: inventory items reach a location through
      // the `location_levels` array relationship, which the generator can't
      // turn into a usable "location" filter.
      id: "inventory_location_filter",
      name: "Location",
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
  ],

  ReservationItem: [
    {
      id: "reservation_location_filter",
      name: "Location",
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
  ],
}

/**
 * Registry for computed columns.
 * Allows registration of custom computed columns.
 */
export class ComputedColumnRegistry {
  private columns: Map<string, ComputedColumnDefinition[]> = new Map()

  constructor() {
    // Register built-in columns
    for (const [entity, columns] of Object.entries(BUILTIN_COMPUTED_COLUMNS)) {
      this.register(entity, columns)
    }
  }

  /**
   * Register computed columns for an entity. Columns are appended to any
   * already registered for the entity; a column sharing an existing `id`
   * replaces it, keeping registration idempotent.
   */
  register(entity: string, columns: ComputedColumnDefinition[]): void {
    const byId = new Map(this.get(entity).map((column) => [column.id, column]))
    for (const column of columns) {
      byId.set(column.id, column)
    }
    this.columns.set(entity, Array.from(byId.values()))
  }

  /**
   * Get all computed columns for an entity.
   */
  get(entityName: string): ComputedColumnDefinition[] {
    return this.columns.get(entityName) ?? []
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
