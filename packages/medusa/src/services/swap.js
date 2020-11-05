import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

/**
 * Handles swaps
 * @implements BaseService
 */
class SwapService extends BaseService {
  constructor({
    cartService,
    totalsService,
    returnService,
    lineItemService,
    paymentProviderService,
  }) {
    super()

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {LineItemService} */
    this.lineItemService_ = lineItemService

    /** @private @const {ReturnService} */
    this.returnService_ = returnService

    /** @private @const {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService

    /** @private @const {CartService} */
    this.cartService_ = cartService
  }

  async create(order, returnItems, additionalItems, returnShipping, shipping) {
    const newReturn = await this.returnService_.requestReturn(
      order,
      returnItems,
      returnShipping
    )
    const newItems = await Promise.all(
      additionalItems.map(({ variant_id, quantity }) => {
        return this.lineItemService_.generate(
          variant_id,
          order.region_id,
          quantity
        )
      })
    )

    const cart = await this.cartService_.create({
      email: order.email,
      billing_address: order.billing_address,
      shipping_address: order.shipping_address,
      items: newItems,
      region_id: order.region_id,
      customer_id: order.customer_id,
      is_swap: true,
      metadata: {
        parent_order_id: order._id,
      },
    })

    return {
      return: newReturn,
      additional_items: newItems,
      cart_id: cart._id,
    }
  }
}

export default SwapService
