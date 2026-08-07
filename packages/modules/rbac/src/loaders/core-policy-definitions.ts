import { PolicyOperation, toPascalCase } from "@medusajs/framework/utils"

/**
 * The resources Medusa core governs with RBAC policies. Each resource is
 * expanded into one policy per default operation, and the resulting list is
 * synced to the database on every boot by the `core-policies` loader.
 */
export const CORE_POLICY_RESOURCES = [
  // Customer
  "customer",
  "customer_address",
  "customer_group",

  // Inventory
  "inventory_item",
  "inventory_level",
  "reservation_item",
  "stock_location",

  // Order
  "order",
  "order_item",
  "order_change",
  "order_address",
  "order_claim",
  "order_claim_item",
  "order_exchange",
  "order_credit_line",
  "return",
  "return_reason",

  // Payment
  "payment",
  "payment_collection",
  "payment_method",
  "payment_session",
  "refund",
  "capture",
  "refund_reason",

  // Pricing
  "price_list",
  "price_preference",
  "price",
  "currency",

  // Product
  "product",
  "product_variant",
  "product_option",
  "product_option_value",
  "product_tag",
  "product_type",
  "product_category",
  "product_collection",

  // Promotion
  "campaign",
  "promotion",

  // Region
  "region",

  // Sales channel
  "sales_channel",

  // Shipping
  "shipping_option",
  "shipping_option_type",
  "shipping_profile",
  "fulfillment",
  "fulfillment_provider",
  "fulfillment_set",
  "service_zone",

  // System
  "file",
  "notification",
  "workflow_execution",
  "store",
  "store_locale",

  // Tax
  "tax_provider",
  "tax_rate",
  "tax_region",

  // Translation
  "translation",
  "translation_setting",

  // User
  "user",
  "api_key",
  "invite",

  // RBAC
  "rbac_role",
  "rbac_policy",
  "rbac_role_assignment",
] as const

/**
 * The operations every core resource is expanded with.
 */
const CORE_POLICY_OPERATIONS = [
  PolicyOperation.read,
  PolicyOperation.create,
  PolicyOperation.update,
  PolicyOperation.delete,
] as const

export type CorePolicyDefinition = {
  key: string
  resource: string
  operation: string
  name: string
  description: string
}

/**
 * The fully expanded core policy list. Keys, names and descriptions are
 * derived deterministically so that re-running the sync against a database
 * seeded by an earlier Medusa version is a no-op.
 */
export const CORE_POLICY_DEFINITIONS: CorePolicyDefinition[] =
  CORE_POLICY_RESOURCES.flatMap((resource) => {
    const normalizedResource = toPascalCase(resource)

    return CORE_POLICY_OPERATIONS.map((operation) => {
      const normalizedOperation = toPascalCase(operation)

      return {
        key: `${resource}:${operation}`,
        resource,
        operation,
        name: `${normalizedOperation}${normalizedResource}`,
        description: `${normalizedOperation} ${normalizedResource.replace(
          /_/g,
          " "
        )}`,
      }
    })
  })
