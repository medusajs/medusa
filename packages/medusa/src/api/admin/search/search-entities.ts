import { ApiKeyType } from "@medusajs/framework/utils"

/**
 * One entity the admin global search can query when the Search Module is off.
 * `name` is what `/admin/search?entity=` accepts and what `results[].entity`
 * returns — kept aligned with the admin SearchArea keys so the dashboard can
 * map groups without a second translation layer.
 */
export type AdminSearchEntityConfig = {
  name: string
  /** `query.graph` / remote-query entry point. */
  graphEntity: string
  fields: string[]
  /** Always applied (e.g. exclude draft orders, api-key type). */
  filters?: Record<string, unknown>
  /** Normalize `q` before it is passed as a free-text filter. */
  transformQuery?: (q: string) => string
}

/**
 * Mirrors the entities (and field sets) the admin dashboard used to request
 * from each list endpoint in parallel.
 */
export const ADMIN_SEARCH_ENTITIES: AdminSearchEntityConfig[] = [
  {
    name: "order",
    graphEntity: "order",
    fields: ["id", "display_id", "email"],
    filters: { is_draft_order: false },
    // Display shows `#${display_id}`; users often type the leading `#`.
    transformQuery: (q) => q.replace(/^#/, ""),
  },
  {
    name: "product",
    graphEntity: "product",
    fields: ["id", "title", "thumbnail"],
  },
  {
    name: "productVariant",
    graphEntity: "variant",
    fields: ["id", "title", "sku", "product_id"],
  },
  {
    name: "category",
    graphEntity: "product_category",
    fields: ["id", "name"],
  },
  {
    name: "collection",
    graphEntity: "product_collection",
    fields: ["id", "title"],
  },
  {
    name: "customer",
    graphEntity: "customer",
    fields: ["id", "email", "first_name", "last_name"],
  },
  {
    name: "customerGroup",
    graphEntity: "customer_group",
    fields: ["id", "name"],
  },
  {
    name: "inventory",
    graphEntity: "inventory_item",
    fields: ["id", "title", "sku"],
  },
  {
    name: "promotion",
    graphEntity: "promotion",
    fields: ["id", "code", "status"],
  },
  {
    name: "campaign",
    graphEntity: "campaign",
    fields: ["id", "name"],
  },
  {
    name: "priceList",
    graphEntity: "price_list",
    fields: ["id", "title"],
  },
  {
    name: "user",
    graphEntity: "user",
    fields: ["id", "email", "first_name", "last_name"],
  },
  {
    name: "region",
    graphEntity: "region",
    fields: ["id", "name"],
  },
  {
    name: "taxRegion",
    graphEntity: "tax_region",
    fields: ["id", "country_code", "province_code"],
  },
  {
    name: "returnReason",
    graphEntity: "return_reason",
    fields: ["id", "label", "value"],
  },
  {
    name: "salesChannel",
    graphEntity: "sales_channel",
    fields: ["id", "name"],
  },
  {
    name: "productType",
    graphEntity: "product_type",
    fields: ["id", "value"],
  },
  {
    name: "productTag",
    graphEntity: "product_tag",
    fields: ["id", "value"],
  },
  {
    name: "location",
    graphEntity: "stock_location",
    fields: ["id", "name"],
  },
  {
    name: "shippingProfile",
    graphEntity: "shipping_profile",
    fields: ["id", "name"],
  },
  {
    name: "publishableApiKey",
    graphEntity: "api_key",
    fields: ["id", "title", "redacted"],
    filters: { type: ApiKeyType.PUBLISHABLE },
  },
  {
    name: "secretApiKey",
    graphEntity: "api_key",
    fields: ["id", "title", "redacted"],
    filters: { type: ApiKeyType.SECRET },
  },
]

export const ADMIN_SEARCH_ENTITY_MAP = new Map(
  ADMIN_SEARCH_ENTITIES.map((entity) => [entity.name, entity])
)

export const DEFAULT_ADMIN_SEARCH_ENTITY_NAMES = ADMIN_SEARCH_ENTITIES.map(
  (entity) => entity.name
)
