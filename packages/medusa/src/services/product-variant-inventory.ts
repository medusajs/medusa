import { EntityManager, In } from "typeorm"
import {
  ICacheService,
  IEventBusService,
  IInventoryService,
  IStockLocationService,
  InventoryItemDTO,
  ReservationItemDTO,
  ReserveQuantityContext,
} from "@medusajs/types"
import { LineItem, Product, ProductVariant } from "../models"
import { MedusaError, TransactionBaseService, isDefined } from "@medusajs/utils"
import { PricedProduct, PricedVariant } from "../types/pricing"

import { ProductVariantInventoryItem } from "../models/product-variant-inventory-item"
import ProductVariantService from "./product-variant"
import SalesChannelInventoryService from "./sales-channel-inventory"
import SalesChannelLocationService from "./sales-channel-location"

type InjectedDependencies = {
  manager: EntityManager
  productVariantService: ProductVariantService
  inventoryService: IInventoryService
  eventBusService: IEventBusService
}

class ProductVariantInventoryService extends TransactionBaseService {
  protected readonly productVariantService_: ProductVariantService
  protected readonly inventoryService_: IInventoryService

  constructor({
    productVariantService,
    inventoryService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.productVariantService_ = productVariantService
    this.inventoryService_ = inventoryService
  }

  /**
   * Retrieves a product variant inventory item by its inventory item ID and variant ID.
   *
   * @param inventoryItemId - The ID of the inventory item to retrieve.
   * @param variantId - The ID of the variant to retrieve.
   * @returns A promise that resolves with the product variant inventory item.
   */
  async retrieve(
    inventoryItemId: string,
    variantId: string
  ): Promise<ProductVariantInventoryItem> {
    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const variantInventory = await variantInventoryRepo.findOne({
      where: { inventory_item_id: inventoryItemId, variant_id: variantId },
    })

    if (!variantInventory) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Inventory item with id ${inventoryItemId} not found`
      )
    }

    return variantInventory
  }

  /**
   * list registered inventory items
   * @param itemIds list inventory item ids
   * @returns list of inventory items
   */
  async listByItem(itemIds: string[]): Promise<ProductVariantInventoryItem[]> {
    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const variantInventory = await variantInventoryRepo.find({
      where: { inventory_item_id: In(itemIds) },
    })

    return variantInventory
  }

  /**
   * List inventory items for a specific variant
   * @param variantId variant id
   * @returns variant inventory items for the variant id
   */
  public async listByVariant(
    variantId: string | string[]
  ): Promise<ProductVariantInventoryItem[]> {
    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const ids = Array.isArray(variantId) ? variantId : [variantId]

    const variantInventory = await variantInventoryRepo.find({
      where: { variant_id: In(ids) },
    })

    return variantInventory
  }

  /**
   * lists variant by inventory item id
   * @param itemId item id
   * @returns a list of product variants that are associated with the item id
   */
  async listVariantsByItem(itemId: string): Promise<ProductVariant[]> {
    if (!this.inventoryService_) {
      return []
    }

    const variantInventory = await this.listByItem([itemId])
    const items = await this.productVariantService_.list({
      id: variantInventory.map((i) => i.variant_id),
    })

    return items
  }

  /**
   * lists inventory items for a given variant
   * @param variantId variant id
   * @returns lidt of inventory items for the variant
   */
  async listInventoryItemsByVariant(
    variantId: string
  ): Promise<InventoryItemDTO[]> {
    if (!this.inventoryService_) {
      return []
    }

    const variantInventory = await this.listByVariant(variantId)
    const [items] = await this.inventoryService_.listInventoryItems({
      id: variantInventory.map((i) => i.inventory_item_id),
    })

    return items
  }

  /**
   * Attach a variant to an inventory item
   * @param variantId variant id
   * @param inventoryItemId inventory item id
   * @param requiredQuantity quantity of variant to attach
   * @returns the variant inventory item
   */
  async attachInventoryItem(
    variantId: string,
    inventoryItemId: string,
    requiredQuantity?: number
  ): Promise<ProductVariantInventoryItem> {
    // Verify that variant exists
    await this.productVariantService_
      .withTransaction(this.activeManager_)
      .retrieve(variantId, {
        select: ["id"],
      })

    // Verify that item exists
    await this.inventoryService_.retrieveInventoryItem(
      inventoryItemId,
      {
        select: ["id"],
      },
      { transactionManager: this.activeManager_ }
    )

    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const existing = await variantInventoryRepo.findOne({
      where: {
        variant_id: variantId,
        inventory_item_id: inventoryItemId,
      },
    })

    if (existing) {
      return existing
    }

    let quantityToStore = 1
    if (typeof requiredQuantity !== "undefined") {
      if (requiredQuantity < 1) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Quantity must be greater than 0"
        )
      } else {
        quantityToStore = requiredQuantity
      }
    }

    const variantInventory = variantInventoryRepo.create({
      variant_id: variantId,
      inventory_item_id: inventoryItemId,
      required_quantity: quantityToStore,
    })

    return await variantInventoryRepo.save(variantInventory)
  }

  /**
   * Remove a variant from an inventory item
   * @param variantId variant id or undefined if all the variants will be affected
   * @param inventoryItemId inventory item id
   */
  async detachInventoryItem(
    inventoryItemId: string,
    variantId?: string
  ): Promise<void> {
    const variantInventoryRepo = this.activeManager_.getRepository(
      ProductVariantInventoryItem
    )

    const where: any = {
      inventory_item_id: inventoryItemId,
    }
    if (variantId) {
      where.variant_id = variantId
    }

    const varInvItems = await variantInventoryRepo.find({
      where,
    })

    if (varInvItems.length) {
      await variantInventoryRepo.remove(varInvItems)
    }
  }
}

export default ProductVariantInventoryService
