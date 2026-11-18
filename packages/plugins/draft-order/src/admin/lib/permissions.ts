import type { Permission } from "@medusajs/dashboard/lib"

/**
 * RBAC permissions shared by a page's route `handle` and the actions that link
 * to it, so an action is only shown when its target page would open.
 */

/**
 * The draft order details page and the list behind the create modal
 */
export const VIEW_DRAFT_ORDER_PERMISSIONS: Permission[] = ["order:read"]

/**
 * The create modal: region and sales channel are required fields whose
 * pickers throw when they can't be loaded
 */
export const CREATE_DRAFT_ORDER_PERMISSIONS: Permission[] = [
  "order:read",
  "order:create",
  "region:read",
  "sales_channel:read",
]

/**
 * Editors that only read and update the draft order: email, addresses,
 * metadata, items and custom items
 */
export const EDIT_DRAFT_ORDER_PERMISSIONS: Permission[] = [
  "order:read",
  "order:update",
]

/**
 * The sales channel editor: the sales channel picker is its only field
 */
export const EDIT_DRAFT_ORDER_SALES_CHANNEL_PERMISSIONS: Permission[] = [
  "order:read",
  "order:update",
  "sales_channel:read",
]

/**
 * The transfer ownership editor: the customer picker is its only field
 */
export const TRANSFER_DRAFT_ORDER_PERMISSIONS: Permission[] = [
  "order:read",
  "order:update",
  "customer:read",
]

export const EDIT_DRAFT_ORDER_PROMOTIONS_PERMISSIONS: Permission[] = [
  "order:read",
  "order:update",
  "promotion:read",
  "order_change:read",
  "order_change:update",
]

/**
 * The shipping editor: a shipping method is added by picking a stock location
 * and then one of its shipping options
 */
export const EDIT_DRAFT_ORDER_SHIPPING_PERMISSIONS: Permission[] = [
  "order:read",
  "order:update",
  "shipping_option:read",
  "stock_location:read",
]
