import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager, In } from "typeorm"
import {
  IStockLocationService,
  IInventoryService,
  TransactionBaseService,
} from "../interfaces"
import { ProductVariantInventoryItem } from "../models/product-variant-inventory-item"
import { ProductVariantService, SalesChannelLocationService } from "./"
import { InventoryItemDTO, ReserveQuantityContext } from "../types/inventory"
import { ProductVariant } from "../models"

type InjectedDependencies = {
  manager: EntityManager
  salesChannelLocationService: SalesChannelLocationService
  productVariantService: ProductVariantService
  stockLocationService: IStockLocationService
  inventoryService: IInventoryService
}

class ProductVariantInventoryService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly salesChannelLocationService_: SalesChannelLocationService
  protected readonly productVariantService_: ProductVariantService
  protected readonly stockLocationService_: IStockLocationService
  protected readonly inventoryService_: IInventoryService

  constructor({
    manager,
    stockLocationService,
    salesChannelLocationService,
    productVariantService,
    inventoryService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.salesChannelLocationService_ = salesChannelLocationService
    this.stockLocationService_ = stockLocationService
    this.productVariantService_ = productVariantService
    this.inventoryService_ = inventoryService
  }

  /**
   * confirms if requested inventory is available
   * @param variantId id of the variant to confirm inventory for
   * @param quantity quantity of inventory to confirm is available
   * @param context optionally include a sales channel if applicable
   * @returns boolean indicating if inventory is available
   */
  async confirmInventory(
    variantId: string,
    quantity: number,
    context: { salesChannelId?: string | null } = {}
  ): Promise<Boolean> {
    if (!variantId) {
      return true
    }

    const manager = this.transactionManager_ || this.manager_
    const productVariant = await this.productVariantService_
      .withTransaction(manager)
      .retrieve(variantId, {
        select: [
          "id",
          "allow_backorder",
          "manage_inventory",
          "inventory_quantity",
        ],
      })

    // If the variant allows backorders or if inventory isn't managed we
    // don't need to check inventory
    if (productVariant.allow_backorder || !productVariant.manage_inventory) {
      return true
    }

    if (!this.inventoryService_) {
      return productVariant.inventory_quantity >= quantity
    }

    const variantInventory = await this.listByVariant(variantId)

    // If there are no inventory items attached to the variant we default
    // to true
    if (variantInventory.length === 0) {
      return true
    }

    let locations: string[] = []
    if (context.salesChannelId) {
      locations = await this.salesChannelLocationService_.listLocations(
        context.salesChannelId
      )
    } else {
      const stockLocations = await this.stockLocationService_.list(
        {},
        { select: ["id"] }
      )
      locations = stockLocations.map((l) => l.id)
    }

    const hasInventory = await Promise.all(
      variantInventory.map(async (inventoryPart) => {
        const itemQuantity = inventoryPart.quantity * quantity
        return await this.inventoryService_.confirmInventory(
          inventoryPart.inventory_item_id,
          locations,
          itemQuantity
        )
      })
    )

    return hasInventory.every(Boolean)
  }

  /**
   * list registered inventory items
   * @param itemIds list inventory item ids
   * @returns list of inventory items
   */
  async listByItem(itemIds: string[]): Promise<ProductVariantInventoryItem[]> {
    const manager = this.transactionManager_ || this.manager_

    const variantInventoryRepo = manager.getRepository(
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
  private async listByVariant(
    variantId: string
  ): Promise<ProductVariantInventoryItem[]> {
    const manager = this.transactionManager_ || this.manager_

    const variantInventoryRepo = manager.getRepository(
      ProductVariantInventoryItem
    )

    const variantInventory = await variantInventoryRepo.find({
      where: { variant_id: variantId },
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
   * @param quantity quantity of variant to attach
   * @returns the variant inventory item
   */
  async attachInventoryItem(
    variantId: string,
    inventoryItemId: string,
    quantity?: number
  ): Promise<ProductVariantInventoryItem> {
    const manager = this.transactionManager_ || this.manager_

    // Verify that variant exists
    await this.productVariantService_
      .withTransaction(manager)
      .retrieve(variantId, {
        select: ["id"],
      })

    // Verify that item exists
    await this.inventoryService_.retrieveInventoryItem(inventoryItemId, {
      select: ["id"],
    })

    const variantInventoryRepo = manager.getRepository(
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
    if (typeof quantity !== "undefined") {
      if (quantity < 1) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Quantity must be greater than 0"
        )
      } else {
        quantityToStore = quantity
      }
    }

    const variantInventory = variantInventoryRepo.create({
      variant_id: variantId,
      inventory_item_id: inventoryItemId,
      quantity: quantityToStore,
    })

    return await variantInventoryRepo.save(variantInventory)
  }

  /**
   * Remove a variant from an inventory item
   * @param variantId variant id
   * @param inventoryItemId inventory item id
   */
  async detachInventoryItem(
    variantId: string,
    inventoryItemId: string
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_

    const variantInventoryRepo = manager.getRepository(
      ProductVariantInventoryItem
    )

    const existing = await variantInventoryRepo.findOne({
      where: {
        variant_id: variantId,
        inventory_item_id: inventoryItemId,
      },
    })

    if (existing) {
      await variantInventoryRepo.remove(existing)
    }
  }

  /**
   * Reserves a quantity of a variant
   * @param variantId variant id
   * @param quantity quantity to reserve
   * @param context optional parameters
   */
  async reserveQuantity(
    variantId: string,
    quantity: number,
    context: ReserveQuantityContext = {}
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_

    if (!this.inventoryService_) {
      const variantServiceTx =
        this.productVariantService_.withTransaction(manager)
      const variant = await variantServiceTx.retrieve(variantId, {
        select: ["id", "inventory_quantity"],
      })
      await variantServiceTx.update(variant.id, {
        inventory_quantity: variant.inventory_quantity - quantity,
      })
      return
    }

    const toReserve = {
      type: "order",
      line_item_id: context.lineItemId,
    }

    const variantInventory = await this.listByVariant(variantId)

    if (variantInventory.length === 0) {
      return
    }

    let locationId = context.locationId
    if (!isDefined(locationId) && context.salesChannelId) {
      const locations = await this.salesChannelLocationService_
        .withTransaction(manager)
        .listLocations(context.salesChannelId)

      if (!locations.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Must provide location_id or sales_channel_id to a Sales Channel that has associated Stock Locations"
        )
      }

      locationId = locations[0]
    }

    await Promise.all(
      variantInventory.map(async (inventoryPart) => {
        const itemQuantity = inventoryPart.quantity * quantity
        return await this.inventoryService_.createReservationItem({
          ...toReserve,
          location_id: locationId as string,
          item_id: inventoryPart.inventory_item_id,
          quantity: itemQuantity,
        })
      })
    )
  }

  /**
   * Remove reservation of variant quantity
   * @param lineItemId line item id
   * @param variantId variant id
   * @param quantity quantity to release
   */
  async releaseReservationsByLineItem(
    lineItemId: string,
    variantId: string,
    quantity: number
  ): Promise<void> {
    if (!this.inventoryService_) {
      const variant = await this.productVariantService_.retrieve(variantId, {
        select: ["id", "inventory_quantity", "manage_inventory"],
      })

      if (!variant.manage_inventory) {
        return
      }

      await this.productVariantService_.update(variantId, {
        inventory_quantity: variant.inventory_quantity + quantity,
      })
    } else {
      await this.inventoryService_.deleteReservationItemsByLineItem(lineItemId)
    }
  }

  /**
   * Adjusts inventory of a variant on a location
   * @param variantId variant id
   * @param locationId location id
   * @param quantity quantity to adjust
   */
  async adjustInventory(
    variantId: string,
    locationId: string,
    quantity: number
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_
    if (!this.inventoryService_) {
      const variant = await this.productVariantService_
        .withTransaction(manager)
        .retrieve(variantId, {
          select: ["id", "inventory_quantity", "manage_inventory"],
        })

      if (!variant.manage_inventory) {
        return
      }

      await this.productVariantService_
        .withTransaction(manager)
        .update(variantId, {
          inventory_quantity: variant.inventory_quantity + quantity,
        })
    } else {
      const variantInventory = await this.listByVariant(variantId)

      if (variantInventory.length === 0) {
        return
      }

      await Promise.all(
        variantInventory.map(async (inventoryPart) => {
          const itemQuantity = inventoryPart.quantity * quantity
          return await this.inventoryService_.adjustInventory(
            inventoryPart.inventory_item_id,
            locationId,
            itemQuantity
          )
        })
      )
    }
  }
}

export default ProductVariantInventoryService
