import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  IStockLocationService,
  IInventoryService,
  TransactionBaseService,
} from "../interfaces"
import { ProductVariantInventoryItem } from "../models/product-variant-inventory-item"
import { ProductVariantService, SalesChannelLocationService } from "./"
import { InventoryItemDTO } from "../types/inventory"

type InjectedDependencies = {
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
    stockLocationService,
    salesChannelLocationService,
    productVariantService,
    inventoryService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

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
    const productVariant = await this.productVariantService.retrieve(
      variantId,
      {
        select: ["id", "allow_backorder", "manage_inventory"],
      }
    )

    // If the variant allows backorders or if inventory isn't managed we
    // don't need to check inventory
    if (productVariant.allow_backorder || !productVariant.manage_inventory) {
      return true
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

  async listInventoryItemsByVariant(
    variantId: string
  ): Promise<InventoryItemDTO[]> {
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
    await this.productVariantService.retrieve(variantId, {
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
}

export default ProductVariantInventoryService
