import { MedusaError } from "medusa-core-utils"
import { EntityManager, In } from "typeorm"
import {
  IStockLocationService,
  IInventoryService,
  TransactionBaseService,
} from "../interfaces"
import { ProductVariantInventoryItem } from "../models/product-variant-inventory-item"
import { ProductVariantService, SalesChannelLocationService } from "./"
import { InventoryItemDTO } from "../types/inventory"
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

  protected readonly salesChannelLocationService: SalesChannelLocationService
  protected readonly productVariantService: ProductVariantService
  protected readonly stockLocationService: IStockLocationService
  protected readonly inventoryService: IInventoryService

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
    this.salesChannelLocationService = salesChannelLocationService
    this.stockLocationService = stockLocationService
    this.productVariantService = productVariantService
    this.inventoryService = inventoryService
  }

  async confirmInventory(
    variantId: string,
    quantity: number,
    options: { sales_channel_id?: string | null } = {}
  ): Promise<Boolean> {
    if (!variantId) {
      return true
    }

    const manager = this.transactionManager_ || this.manager_
    const productVariant = await this.productVariantService
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

    if (!this.inventoryService) {
      return productVariant.inventory_quantity >= quantity
    }

    const variantInventory = await this.listByVariant(variantId)

    // If there are no inventory items attached to the variant we default
    // to true
    if (variantInventory.length === 0) {
      return true
    }

    let locations: string[] = []
    if (options.sales_channel_id) {
      locations = await this.salesChannelLocationService.listLocations(
        options.sales_channel_id
      )
    } else {
      const stockLocations = await this.stockLocationService.list(
        {},
        { select: ["id"] }
      )
      locations = stockLocations.map((l) => l.id)
    }

    const hasInventory = await Promise.all(
      variantInventory.map(async (inventoryPart) => {
        const itemQuantity = inventoryPart.quantity * quantity
        return await this.inventoryService.confirmInventory(
          inventoryPart.inventory_item_id,
          locations,
          itemQuantity
        )
      })
    )

    return hasInventory.every(Boolean)
  }

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

  async listVariantsByItem(itemId: string): Promise<ProductVariant[]> {
    if (!this.inventoryService) {
      return []
    }

    const variantInventory = await this.listByItem([itemId])
    const items = await this.productVariantService.list({
      id: variantInventory.map((i) => i.variant_id),
    })

    return items
  }

  async listInventoryItemsByVariant(
    variantId: string
  ): Promise<InventoryItemDTO[]> {
    if (!this.inventoryService) {
      return []
    }

    const variantInventory = await this.listByVariant(variantId)
    const [items] = await this.inventoryService.listInventoryItems({
      id: variantInventory.map((i) => i.inventory_item_id),
    })

    return items
  }

  async attachInventoryItem(
    variantId: string,
    inventoryItemId: string,
    quantity?: number
  ): Promise<ProductVariantInventoryItem> {
    const manager = this.transactionManager_ || this.manager_

    // Verify that variant exists
    await this.productVariantService
      .withTransaction(manager)
      .retrieve(variantId, {
        select: ["id"],
      })

    // Verify that item exists
    await this.inventoryService.retrieveInventoryItem(inventoryItemId, {
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

  async reserveQuantity(
    variantId: string,
    quantity: number,
    options: {
      location_id?: string
      line_item_id?: string
      sales_channel_id?: string | null
    } = {}
  ): Promise<void> {
    const manager = this.transactionManager_ || this.manager_

    if (!this.inventoryService) {
      const variantServiceTx =
        this.productVariantService.withTransaction(manager)
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
      line_item_id: options.line_item_id,
    }

    const variantInventory = await this.listByVariant(variantId)

    if (variantInventory.length === 0) {
      return
    }

    let locationId = options.location_id
    if (typeof locationId === "undefined" && options.sales_channel_id) {
      const locations = await this.salesChannelLocationService
        .withTransaction(manager)
        .listLocations(options.sales_channel_id)

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
        return await this.inventoryService.createReservationItem({
          ...toReserve,
          location_id: locationId as string,
          item_id: inventoryPart.inventory_item_id,
          quantity: itemQuantity,
        })
      })
    )
  }

  async releaseReservationsByLineItem(
    lineItemId: string,
    variantId: string,
    quantity: number
  ) {
    if (!this.inventoryService) {
      const variant = await this.productVariantService.retrieve(variantId, {
        select: ["id", "inventory_quantity", "manage_inventory"],
      })

      if (!variant.manage_inventory) {
        return
      }

      await this.productVariantService.update(variantId, {
        inventory_quantity: variant.inventory_quantity + quantity,
      })
    } else {
      await this.inventoryService.deleteReservationItemsByLineItem(lineItemId)
    }
  }

  async adjustInventory(
    variantId: string,
    locationId: string,
    quantity: number
  ) {
    const manager = this.transactionManager_ || this.manager_
    if (!this.inventoryService) {
      const variant = await this.productVariantService
        .withTransaction(manager)
        .retrieve(variantId, {
          select: ["id", "inventory_quantity", "manage_inventory"],
        })

      if (!variant.manage_inventory) {
        return
      }

      await this.productVariantService
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
          return await this.inventoryService.adjustInventory(
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
