/**
 * The permission groups shown in the role screens, in display order. Every
 * core policy resource belongs to exactly one group. Resources that are not
 * listed here (added by plugins or custom modules) land in the Custom group.
 */
export const PERMISSION_GROUPS: { id: string; resources: string[] }[] = [
  {
    id: "orders",
    resources: [
      "order",
      "order_item",
      "order_change",
      "order_address",
      "order_claim",
      "order_claim_item",
      "order_exchange",
      "order_credit_line",
      "return",
    ],
  },
  {
    id: "payments",
    resources: [
      "payment",
      "payment_collection",
      "payment_method",
      "payment_session",
      "refund",
      "capture",
    ],
  },
  {
    id: "products",
    resources: [
      "product",
      "product_variant",
      "product_option",
      "product_option_value",
      "product_tag",
      "product_type",
      "product_category",
      "product_collection",
      "property_label",
    ],
  },
  {
    id: "inventory",
    resources: [
      "inventory_item",
      "inventory_level",
      "reservation_item",
      "stock_location",
    ],
  },
  {
    id: "customers",
    resources: ["customer", "customer_address", "customer_group"],
  },
  {
    id: "pricing",
    resources: [
      "price_list",
      "price_preference",
      "price",
      "campaign",
      "promotion",
    ],
  },
  {
    id: "shipping",
    resources: [
      "shipping_option",
      "shipping_option_type",
      "shipping_profile",
      "fulfillment",
      "fulfillment_provider",
      "fulfillment_set",
      "service_zone",
    ],
  },
  {
    id: "store",
    resources: [
      "store",
      "store_locale",
      "region",
      "sales_channel",
      "currency",
      "tax_provider",
      "tax_rate",
      "tax_region",
      "return_reason",
      "refund_reason",
      "translation",
      "translation_setting",
    ],
  },
  {
    id: "team",
    resources: [
      "user",
      "invite",
      "api_key",
      "rbac_role",
      "rbac_policy",
      "rbac_role_assignment",
    ],
  },
  {
    id: "system",
    resources: ["file", "notification", "workflow_execution"],
  },
]

export const CUSTOM_GROUP_ID = "custom"

/**
 * The operations every group shows as columns, in this order.
 */
export const MATRIX_OPERATIONS = ["read", "create", "update", "delete"] as const

/**
 * The badge colour of each group level, shared by the role summary and the
 * role detail section.
 */
export const LEVEL_COLORS: Record<
  "none" | "view" | "full" | "mixed",
  "grey" | "blue" | "green" | "orange"
> = {
  none: "grey",
  view: "blue",
  full: "green",
  mixed: "orange",
}

/**
 * The ID of the built-in super admin role. Mirrors `RBAC_SUPER_ADMIN_ROLE_ID`
 * in `@medusajs/utils`; the backend refuses to delete this role.
 */
export const SUPER_ADMIN_ROLE_ID = "role_super_admin"
