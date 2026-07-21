import { RenderMode } from "./render-mode-mapper"

/**
 * Definition of a computed column.
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
   * Render mode/type for the column.
   */
  renderMode: RenderMode

  /**
   * Fields required to render this column.
   */
  requiredFields: string[]

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
}

/**
 * Built-in computed columns migrated from entity-mappings.ts.
 */
export const BUILTIN_COMPUTED_COLUMNS: ComputedColumnDefinition[] = [
  // Order computed columns
  {
    id: "customer_display",
    name: "Customer",
    renderMode: "customer_name",
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
  },
  {
    id: "shipping_address_display",
    name: "Shipping Address",
    renderMode: "address_summary",
    requiredFields: ["shipping_address.city", "shipping_address.country_code"],
    optionalFields: [
      "shipping_address.address_1",
      "shipping_address.province",
      "shipping_address.postal_code",
    ],
    entities: ["Order"],
    defaultVisible: false,
    description: "Shipping address summary",
    category: "relationship",
  },
  {
    id: "billing_address_display",
    name: "Billing Address",
    renderMode: "address_summary",
    requiredFields: ["billing_address.city", "billing_address.country_code"],
    optionalFields: [
      "billing_address.address_1",
      "billing_address.province",
      "billing_address.postal_code",
    ],
    entities: ["Order"],
    defaultVisible: false,
    description: "Billing address summary",
    category: "relationship",
  },
  {
    id: "country",
    name: "Country",
    renderMode: "country_code",
    requiredFields: ["shipping_address.country_code"],
    optionalFields: [],
    entities: ["Order"],
    defaultVisible: true,
    description: "Shipping country",
    category: "metadata",
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
    requiredFields: ["variants"],
    optionalFields: [],
    entities: ["Product"],
    defaultVisible: true,
    description: "Number of product variants",
    category: "metric",
  },
  {
    id: "categories_display",
    name: "Categories",
    renderMode: "badge_list",
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
    renderMode: "sales_channels_list",
    requiredFields: ["sales_channels.*"],
    optionalFields: [],
    entities: ["Product"],
    defaultVisible: true,
    description: "Sales channels the product is available in",
    category: "relationship",
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
