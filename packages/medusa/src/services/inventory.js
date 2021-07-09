import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"
const fs = require("fs")

class InventoryService extends BaseService {
  constructor({ manager, productVariantService }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ProductVariantRepository_} */
    this.productVariantService_ = productVariantService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new InventoryService({
      manager: transactionManager,
      productVariantService: this.productVariantService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Updates the inventory of a variant based on a given adjustment.
   * @params {string} variantId - the id of the variant to update
   * @params {number} adjustment - the number to adjust the inventory quantity by
   * @return {Promise} resolves to the update result.
   */
  async adjustInventory(variantId, adjustment) {
    return this.atomicPhase_(async (manager) => {
      const variant = await this.productVariantService_.retrieve(variantId)
      return await this.productVariantService_
        .withTransaction(manager)
        .update(variant, {
          inventory_quantity: variant.inventory_quantity + adjustment,
        })
    })
  }
  /**
   * Checks if the inventory of a variant can cover a given quantity. Will
   * return true if the variant doesn't have managed inventory or if the variant
   * allows backorders or if the inventory quantity is greater than `quantity`.
   * @params {string} variantId - the id of the variant to check
   * @params {number} quantity - the number of units to check availability for
   * @return {boolean} true if the inventory covers the quantity
   */
  async confirmInventory(variantId, quantity) {
    const variant = await this.productVariantService_.retrieve(variantId)

    const { inventory_quantity, allow_backorder, manage_inventory } = variant
    const isCovered =
      !manage_inventory || allow_backorder || inventory_quantity >= quantity

    if (!isCovered) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Variant with id: ${variant.id} does not have the required inventory`
      )
    }

    return isCovered
  }
}

export default InventoryService
