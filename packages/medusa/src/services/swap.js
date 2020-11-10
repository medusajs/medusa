import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"

/**
 * Handles swaps
 * @implements BaseService
 */
class SwapService extends BaseService {
  constructor({
    swapModel,
    cartService,
    totalsService,
    returnService,
    lineItemService,
    paymentProviderService,
    fulfillmentService,
  }) {
    super()

    /** @private @const {SwapModel} */
    this.swapModel_ = swapModel

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

    /** @private @const {FulfillmentService} */
    this.fulfillmentService_ = fulfillmentService
  }

  /**
   * Used to validate user ids. Throws an error if the cast fails
   * @param {string} rawId - the raw user id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The swapId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Retrieves a swap with the given id.
   * @param {string} id - the id of the swap to retrieve
   * @return {Promise<Swap>} the swap
   */
  async retrieve(id) {
    const validatedId = this.validateId_(id)
    const swap = await this.swapModel_.findOne({ _id: validatedId })

    if (!swap) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Swap was not found")
    }

    return swap
  }

  /**
   * @typedef OrderLike
   * @property {Array<LineItem>} items - the items on the order
   */

  /**
   * @typedef ReturnItem
   * @property {string} item_id - the id of the item in the order to return from.
   * @property {number} quantity - the amount of the item to return.
   */

  /**
   * Goes through a list of return items to ensure that they exist on the
   * original order. If the item exists it is verified that the quantity to
   * return is not higher than the original quantity ordered.
   * @param {OrderLike} order - the order to return from
   * @param {Array<ReturnItem>} returnItems - the items to return
   * @return {Array<ReturnItems>} the validated returnItems
   */
  validateReturnItems_(order, returnItems) {
    return returnItems.map(({ item_id, quantity }) => {
      const item = order.items.find(i => i._id.equals(item_id))

      // The item must exist in the order
      if (!item) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Item does not exist on order"
        )
      }

      // Item's cannot be returned multiple times
      if (item.quantity < item.returned_quantity + quantity) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot return more items than have been ordered"
        )
      }

      return { item_id, quantity }
    })
  }

  /**
   * @typedef PreliminaryLineItem
   * @property {string} variant_id - the id of the variant to create an item from
   * @property {number} quantity - the amount of the variant to add to the line item
   */

  /**
   * Creates a swap from an order, with given return items, additional items
   * and an optional return shipping method.
   * @param {Order} order - the order to base the swap off.
   * @param {Array<ReturnItem>} returnItems - the items to return in the swap.
   * @param {Array<PreliminaryLineItem>} additionalItems - the items to send to
   *  the customer.
   * @param {ReturnShipping?} returnShipping - an optional shipping method for
   *  returning the returnItems.
   * @returns {Promise<Swap>} the newly created swap.
   */
  async create(order, returnItems, additionalItems, returnShipping) {
    const newItems = await Promise.all(
      additionalItems.map(({ variant_id, quantity }) => {
        return this.lineItemService_.generate(
          variant_id,
          order.region_id,
          quantity
        )
      })
    )

    const validatedReturnItems = this.validateReturnItems_(order, returnItems)

    return this.swapModel_.create({
      order_id: order._id,
      return_items: validatedReturnItems,
      return_shipping: returnShipping,
      additional_items: newItems,
    })
  }

  /**
   * Creates a cart from the given swap and order. The cart can be used to pay
   * for differences associated with the swap. The swap represented by the
   * swapId must belong to the order. Fails if there is already a cart on the
   * swap.
   * @param {Order} order - the order to create the cart from
   * @param {string} swapId - the id of the swap to create the cart from
   * @returns {Promise<Swap>} the swap with its cart_id prop set to the id of
   *   the new cart.
   */
  async createCart(order, swapId) {
    const swap = await this.retrieve(swapId)

    if (!order._id.equals(swap.order_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The swap does not belong to the order"
      )
    }

    if (swap.cart_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "A cart has already been created for the swap"
      )
    }

    const cart = await this.cartService_.create({
      email: order.email,
      billing_address: order.billing_address,
      shipping_address: order.shipping_address,
      items: swap.additional_items,
      region_id: order.region_id,
      customer_id: order.customer_id,
      is_swap: true,
      metadata: {
        parent_order_id: order._id,
      },
    })

    return this.swapModel_.updateOne(
      { _id: swapId },
      { $set: { cart_id: cart._id } }
    )
  }

  /**
   * Requests a return based off an order and a swap.
   * @param {Order} order - the order to create the return from.
   * @param {string} swapId - the id to create the return from
   * @returns {Promise<Swap>} the swap
   */
  async requestReturn(order, swapId) {
    const swap = await this.retrieve(swapId)

    const newReturn = await this.returnService_.requestReturn(
      order,
      swap.return_items,
      swap.return_shipping
    )

    return this.swapModel_.updateOne(
      { _id: swapId },
      { $set: { return: newReturn } }
    )
  }

  /**
   * Registers the return associated with a swap as received. If the return
   * is received with mismatching return items the swap's status will be updated
   * to requires_action.
   * @param {Order} order - the order to receive the return based off
   * @param {string} swapId - the id of the swap to receive.
   * @param {Array<ReturnItem>} - the items that have been returned
   * @returns {Promise<Swap>} the resulting swap, with an updated return and
   *   status.
   */
  async receiveReturn(order, swapId, returnItems) {
    const swap = await this.retrieve(swapId)

    const returnRequest = swap.return
    if (!returnRequest || !returnRequest._id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Swap has no return request"
      )
    }

    if (!order._id.equals(swap.order_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The swap does not belong to the order"
      )
    }

    const updatedReturn = await this.returnService_.receiveReturn(
      order,
      returnRequest,
      returnItems,
      returnRequest.refund_amount,
      false
    )

    let status = "received"
    if (updatedReturn.status === "requires_action") {
      status = "requires_action"
    }

    return this.swapModel_.updateOne(
      {
        _id: swapId,
      },
      {
        $set: {
          status,
          return: updatedReturn,
        },
      }
    )
  }

  /**
   * Fulfills the addtional items associated with the swap. Will call the
   * fulfillment providers associated with the shipping methods.
   * @param {string} swapId - the id of the swap to fulfill,
   * @param {object} metadata - optional metadata to attach to the fulfillment.
   * @returns {Promise<Swap>} the updated swap with new status and fulfillments.
   */
  async createFulfillment(swapId, metadata = {}) {
    const swap = await this.retrieve(swapId)

    const fulfillments = await this.fulfillmentService_.createFulfillment(
      {
        items: swap.additional_items,
        shipping_methods: swap.shipping_methods,
      },
      swap.additional_items.map(i => ({
        item_id: i._id,
        quantity: i.quantity,
      })),
      metadata
    )

    return this.swapModel_.updateOne(
      {
        _id: swapId,
      },
      {
        $set: {
          status: "fulfilled",
          fulfillments,
        },
      }
    )
  }

  /**
   * Marks a fulfillment as shipped and attaches tracking numbers.
   * @param {string} swapId - the id of the swap that has been shipped.
   * @param {string} fulfillmentId - the id of the specific fulfillment that
   *   has been shipped
   * @param {Array<string>} trackingNumbers - the tracking numbers associated
   *   with the shipment
   * @param {object} metadata - optional metadata to attach to the shipment.
   * @returns {Promise<Swap>} the updated swap with new fulfillments and status.
   */
  async createShipment(swapId, fulfillmentId, trackingNumbers, metadata = {}) {
    const swap = await this.retrieve(swapId)

    // Update the fulfillment to register
    const updatedFulfillments = await Promise.all(
      swap.fulfillments.map(f => {
        if (f._id.equals(fulfillmentId)) {
          return this.fulfillmentService_.createShipment(
            {
              items: swap.additional_items,
              shipping_methods: swap.shipping_methods,
            },
            f,
            trackingNumbers,
            metadata
          )
        }
        return f
      })
    )

    const updatedItems = swap.additional_items.map(i => {
      let shipmentItem
      for (const fulfillment of updatedFulfillments) {
        const item = fulfillment.items.find(fi => i._id.equals(fi.item_id))
        if (!!item) {
          shipmentItem = item
          break
        }
      }

      if (shipmentItem) {
        const shippedQuantity = i.shipped_quantity + shipmentItem.quantity
        return {
          ...i,
          shipped: i.quantity === shippedQuantity,
          shipped_quantity: shippedQuantity,
        }
      }

      return i
    })

    const status = updatedItems.every(i => i.shipped)
      ? "shipped"
      : "partially_shipped"

    return this.swapModel_.updateOne(
      { _id: swapId },
      {
        $set: {
          status,
          additional_items: updatedItems,
          fulfillments: updatedFulfillments,
        },
      }
    )
  }
}

export default SwapService
