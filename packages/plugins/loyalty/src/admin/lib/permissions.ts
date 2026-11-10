import type { Permission } from "@medusajs/dashboard/lib"

/**
 * RBAC permissions shared by a page's route `handle` and the actions that link
 * to it, so an action is only shown when its target page would open.
 */

/**
 * The gift card product denominations editor: it reads the product's variants
 * and options to build the form, then adds option values
 */
export const EDIT_GIFT_CARD_DENOMINATIONS_PERMISSIONS: Permission[] = [
  "product:read",
  "product_variant:read",
  "product_option:read",
  "product:update",
  "product_option:create",
  "product_option:update",
  "product_option:delete",
]

/**
 * The gift card product prices editor: it reads the variants' prices and the
 * store's currencies, then saves
 */
export const EDIT_GIFT_CARD_PRICES_PERMISSIONS: Permission[] = [
  "product:read",
  "product_variant:read",
  "price:read",
  "store:read",
  "product:update",
  "product_variant:create",
  "product_variant:update",
  "product_variant:delete",
]

export const DELETE_GIFT_CARD_DENOMINATION_PERMISSIONS: Permission[] = [
  "product:update",
  "product_variant:delete",
]
