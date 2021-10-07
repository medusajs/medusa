import { BaseService } from "medusa-interfaces"
import { parsePrice } from "../utils/parse-price"

class ShopifyLineItemsService extends BaseService {
  constructor({ manager, lineItemService, productVariantService }, options) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {LineItemService} */
    this.lineItemService_ = lineItemService
    /** @private @const {ProductVariantService} */
    this.productVariantService_ = productVariantService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyLineItemsService({
      manager: transactionManager,
      options: this.options,
      lineItemService: this.lineItemService_,
      productVariantService: this.productVariantService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async update(item, orderItems) {
    return this.atomicPhase_(async (manager) => {
      const id = await this.getId_(item, orderItems)

      await this.lineItemService_
        .withTransaction(manager)
        .update(id, { quantity: item.quantity })
    })
  }

  async delete(item, orderItems) {
    return this.atomicPhase_(async (manager) => {
      const id = await this.getId_(item, orderItems)

      await this.lineItemService_.withTransaction(manager).delete(id)
    })
  }

  async create(orderId, item) {
    return this.atomicPhase_(async (manager) => {
      let normalized = this.normalizeLineItem(item)

      await this.lineItemService_
        .withTransaction(manager)
        .create({ order_id: orderId, ...normalized })
    })
  }

  async getId_(item, orderItems) {
    const { id } = await this.productVariantService_.retrieveBySKU(item.sku)
    const { id: result } = orderItems.find((i) => i.variant_id === id)

    return result
  }

  async normalizeLineItem(lineItem) {
    const productVariant = await this.productVariantService_.retrieveBySKU(
      lineItem.sku
    )

    return {
      title: lineItem.title,
      is_giftcard: lineItem.gift_card,
      unit_price: parsePrice(lineItem.price),
      quantity: lineItem.quantity,
      fulfilled_quantity: lineItem.quantity - lineItem.fulfillable_quantity,
      variant_id: productVariant.id,
      metadata: {
        sh_id: lineItem.id,
        sh_origin_location: lineItem.origin_location.id,
      },
    }
  }
}

export default ShopifyLineItemsService
