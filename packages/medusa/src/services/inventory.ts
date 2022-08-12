import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"
import { TransactionBaseService } from "../interfaces"
import { EntityManager } from "typeorm"
import ProductVariantService from "./product-variant"
import { ProductVariant } from "../models"

type InventoryServiceProps = {
  manager: EntityManager
  productVariantService: ProductVariantService
}
class InventoryService extends TransactionBaseService {
  protected readonly productVariantService_: ProductVariantService

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor({ manager, productVariantService }: InventoryServiceProps) {
    super({ manager, productVariantService })

    this.manager_ = manager
    this.productVariantService_ = productVariantService
  }

  /**
   * Updates the inventory of a variant based on a given adjustment.
   * @param variantId - the id of the variant to update
   * @param adjustment - the number to adjust the inventory quantity by
   * @return resolves to the update result.
   */
  async adjustInventory(
    variantId: string,
    adjustment: number
  ): Promise<ProductVariant | undefined> {
    if (!variantId) {
      return
    }

    return await this.atomicPhase_(async (manager) => {
      const variant = await this.productVariantService_
        .withTransaction(manager)
        .retrieve(variantId)
      // if inventory is managed then update
      if (variant.manage_inventory) {
        return await this.productVariantService_
          .withTransaction(manager)
          .update(variant, {
            inventory_quantity: variant.inventory_quantity + adjustment,
          })
      } else {
        return variant
      }
    })
  }
  /**
   * Checks if the inventory of a variant can cover a given quantity. Will
   * return true if the variant doesn't have managed inventory or if the variant
   * allows backorders or if the inventory quantity is greater than `quantity`.
   * @param variantId - the id of the variant to check
   * @param quantity - the number of units to check availability for
   * @return true if the inventory covers the quantity
   */
  async confirmInventory(
    variantId: string | undefined | null,
    quantity: number
  ): Promise<boolean> {
    // if variantId is undefined then confirm inventory as it
    // is a custom item that is not managed
    if (typeof variantId === "undefined" || variantId === null) {
      return true
    }

    return await this.atomicPhase_(async (manager) => {
      const variant = await this.productVariantService_
        .withTransaction(manager)
        .retrieve(variantId)
      const { inventory_quantity, allow_backorder, manage_inventory } = variant
      const isCovered =
        !manage_inventory || allow_backorder || inventory_quantity >= quantity

      if (!isCovered) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Variant with id: ${variant.id} does not have the required inventory`,
          MedusaError.Codes.INSUFFICIENT_INVENTORY
        )
      }

      return isCovered
    })
  }
}

export default InventoryService
