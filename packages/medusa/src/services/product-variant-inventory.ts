import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { IInventoryService, TransactionBaseService } from "../interfaces"
import { ProductVariantInventoryItem } from "../models/product-variant-inventory-item"
import { ProductVariantService } from "./"
import { InventoryItemDTO } from "../types/inventory"

type InjectedDependencies = {
  productVariantService: ProductVariantService
  inventoryService: IInventoryService
}

class ProductVariantInventoryService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly productVariantService: ProductVariantService
  protected readonly inventoryService: IInventoryService

  constructor({
    productVariantService,
    inventoryService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.productVariantService = productVariantService
    this.inventoryService = inventoryService
  }

  async listInventoryItemsByVariant(
    variantId: string
  ): Promise<InventoryItemDTO[]> {
    const manager = this.transactionManager_ || this.manager_

    const variantInventoryRepo = manager.getRepository(
      ProductVariantInventoryItem
    )

    const variantInventory = await variantInventoryRepo.find({
      where: { variant_id: variantId },
    })

    const [items] = await this.inventoryService.listInventoryItems({
      id: variantInventory.map((v) => v.inventory_item_id),
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
