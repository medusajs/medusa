import {
  LineItem,
  Product,
  ProductVariant,
  ProductVariantInventoryItem,
} from "../models"
import { PricedProduct, PricedVariant } from "../types/pricing"
import { ReservationItemDTO, ReserveQuantityContext } from "@medusajs/types"

import { TransactionBaseService } from "@medusajs/utils"

export interface IInventoryLocationStrategy extends TransactionBaseService {
  confirmInventory(
    variantId: string,
    quantity: number,
    context?: { salesChannelId?: string | null }
  ): Promise<Boolean>

  reserveQuantity(
    variantId: string,
    quantity: number,
    context?: ReserveQuantityContext
  ): Promise<void | ReservationItemDTO[]>

  adjustReservationsQuantityByLineItem(
    lineItemId: string,
    variantId: string,
    locationId: string,
    quantity: number
  ): Promise<void>

  validateInventoryAtLocation(
    items: Omit<LineItem, "beforeInsert">[],
    locationId: string
  ): Promise<void>

  deleteReservationsByLineItem(
    lineItemId: string,
    variantId: string,
    quantity: number
  ): Promise<void>

  adjustInventory(
    variantId: string,
    locationId: string,
    quantity: number
  ): Promise<void>

  setVariantAvailability(
    variants: ProductVariant[] | PricedVariant[],
    salesChannelId: string | string[] | undefined,
    variantInventoryMap?: Map<string, ProductVariantInventoryItem[]>
  ): Promise<ProductVariant[] | PricedVariant[]>

  setProductAvailability(
    products: (Product | PricedProduct)[],
    salesChannelId: string | string[] | undefined
  ): Promise<(Product | PricedProduct)[]>

  getVariantQuantityFromVariantInventoryItems(
    variantInventoryItems: ProductVariantInventoryItem[],
    channelId: string
  ): Promise<number>
}

export abstract class AbstractInventoryLocationStrategy
  extends TransactionBaseService
  implements IInventoryLocationStrategy
{
  /**
   * confirms if requested inventory is available
   * @param variantId id of the variant to confirm inventory for
   * @param quantity quantity of inventory to confirm is available
   * @param context optionally include a sales channel if applicable
   * @returns boolean indicating if inventory is available
   */
  abstract confirmInventory(
    variantId: string,
    quantity: number,
    context?: { salesChannelId?: string | null }
  ): Promise<Boolean>

  /**
   * Reserves a quantity of a variant
   * @param variantId variant id
   * @param quantity quantity to reserve
   * @param context optional parameters
   */
  abstract reserveQuantity(
    variantId: string,
    quantity: number,
    context?: ReserveQuantityContext
  ): Promise<void | ReservationItemDTO[]>

  /**
   * Adjusts the quantity of reservations for a line item by a given amount.
   * @param {string} lineItemId - The ID of the line item
   * @param {string} variantId - The ID of the variant
   * @param {string} locationId - The ID of the location to prefer adjusting quantities at
   * @param {number} quantity - The amount to adjust the quantity by
   */
  abstract adjustReservationsQuantityByLineItem(
    lineItemId: string,
    variantId: string,
    locationId: string,
    quantity: number
  ): Promise<void>

  /**
   * Validate stock at a location for fulfillment items
   * @param items Fulfillment Line items to validate quantities for
   * @param locationId Location to validate stock at
   * @returns nothing if successful, throws error if not
   */
  abstract validateInventoryAtLocation(
    items: Omit<LineItem, "beforeInsert">[],
    locationId: string
  ): Promise<void>

  /**
   * delete a reservation of variant quantity
   * @param lineItemId line item id
   * @param variantId variant id
   * @param quantity quantity to release
   */
  abstract deleteReservationsByLineItem(
    lineItemId: string,
    variantId: string,
    quantity: number
  ): Promise<void>

  /**
   * Adjusts inventory of a variant on a location
   * @param variantId variant id
   * @param locationId location id
   * @param quantity quantity to adjust
   */
  abstract adjustInventory(
    variantId: string,
    locationId: string,
    quantity: number
  ): Promise<void>

  abstract setVariantAvailability(
    variants: ProductVariant[] | PricedVariant[],
    salesChannelId: string | string[] | undefined,
    variantInventoryMap?: Map<string, ProductVariantInventoryItem[]>
  ): Promise<ProductVariant[] | PricedVariant[]>

  abstract setProductAvailability(
    products: (Product | PricedProduct)[],
    salesChannelId: string | string[] | undefined
  ): Promise<(Product | PricedProduct)[]>

  /**
   * Get the quantity of a variant from a list of variantInventoryItems
   * The inventory quantity of the variant should be equal to the inventory
   * item with the smallest stock, adjusted for quantity required to fulfill
   * the given variant.
   *
   * @param variantInventoryItems List of inventoryItems for a given variant, These must all be for the same variant
   * @param channelId Sales channel id to fetch availability for
   * @returns The available quantity of the variant from the inventoryItems
   */
  abstract getVariantQuantityFromVariantInventoryItems(
    variantInventoryItems: ProductVariantInventoryItem[],
    channelId: string
  ): Promise<number>
}

export function isInventoryLocationStrategy(obj: unknown): boolean {
  return (
    typeof (obj as AbstractInventoryLocationStrategy).confirmInventory ===
      "function" ||
    typeof (obj as AbstractInventoryLocationStrategy).reserveQuantity ===
      "function" ||
    typeof (obj as AbstractInventoryLocationStrategy)
      .adjustReservationsQuantityByLineItem === "function" ||
    typeof (obj as AbstractInventoryLocationStrategy)
      .validateInventoryAtLocation === "function" ||
    typeof (obj as AbstractInventoryLocationStrategy)
      .deleteReservationsByLineItem === "function" ||
    typeof (obj as AbstractInventoryLocationStrategy).adjustInventory ===
      "function" ||
    typeof (obj as AbstractInventoryLocationStrategy).setVariantAvailability ===
      "function" ||
    typeof (obj as AbstractInventoryLocationStrategy).setProductAvailability ===
      "function" ||
    typeof (obj as AbstractInventoryLocationStrategy)
      .getVariantQuantityFromVariantInventoryItems === "function" ||
    obj instanceof AbstractInventoryLocationStrategy
  )
}
