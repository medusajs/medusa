import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"

/**
 * Handles swaps
 * @implements BaseService
 */
class SwapService extends BaseService {
  static Events = {
    SHIPMENT_CREATED: "swap.shipment_created",
    PAYMENT_COMPLETED: "swap.payment_completed",
    PAYMENT_CAPTURED: "swap.payment_captured",
    PAYMENT_CAPTURE_FAILED: "swap.payment_capture_failed",
    PROCESS_REFUND_FAILED: "swap.process_refund_failed",
    REFUND_PROCESSED: "swap.refund_processed",
  }

  constructor({
    swapModel,
    eventBusService,
    cartService,
    totalsService,
    returnService,
    lineItemService,
    paymentProviderService,
    shippingOptionService,
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

    /** @private @const {ShippingOptionService} */
    this.shippingOptionService_ = shippingOptionService

    /** @private @const {EventBusService} */
    this.eventBus_ = eventBusService
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
   * Retrieves a swap based on its associated cart id
   * @param {string} cartId - the cart id that the swap's cart has
   * @return {Promise<Swap>} the swap
   */
  async retrieveByCartId(cartId) {
    const swap = await this.swapModel_.findOne({ cart_id: cartId })

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
    if (
      order.fulfillment_status === "not_fulfilled" ||
      order.payment_status !== "captured"
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Order cannot be swapped"
      )
    }

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
      order_payment: order.payment_method,
      region_id: order.region_id,
      currency_code: order.currency_code,
      return_items: validatedReturnItems,
      return_shipping: returnShipping,
      additional_items: newItems,
    })
  }

  async processDifference(swapId) {
    const swap = await this.retrieve(swapId)

    if (!swap.is_paid) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot process a swap that hasn't been confirmed by the customer"
      )
    }

    if (swap.amount_paid < 0) {
      const { provider_id, data } = swap.order_payment
      const paymentProvider = this.paymentProviderService_.retrieveProvider(
        provider_id
      )

      try {
        await paymentProvider.refundPayment(data, -1 * swap.amount_paid)
      } catch (err) {
        return this.swapModel_
          .updateOne(
            {
              _id: swapId,
            },
            {
              $set: { payment_status: "requires_action" },
            }
          )
          .then(result => {
            this.eventBus_.emit(
              SwapService.Events.PROCESS_REFUND_FAILED,
              result
            )
            return result
          })
      }

      return this.swapModel_
        .updateOne(
          {
            _id: swapId,
          },
          {
            $set: { payment_status: "difference_refunded" },
          }
        )
        .then(result => {
          this.eventBus_.emit(SwapService.Events.REFUND_PROCESSED, result)
          return result
        })
    } else if (swap.amount_paid === 0) {
      return this.swapModel_.updateOne(
        {
          _id: swapId,
        },
        {
          $set: { payment_status: "difference_refunded" },
        }
      )
    }

    return this.capturePayment(swapId)
  }

  async capturePayment(swapId) {
    const swap = await this.retrieve(swapId)

    if (swap.payment_status !== "awaiting") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Payment already captured"
      )
    }

    const updateFields = { payment_status: "captured" }

    const { provider_id, data } = swap.payment_method
    const paymentProvider = await this.paymentProviderService_.retrieveProvider(
      provider_id
    )

    try {
      await paymentProvider.capturePayment(data)
    } catch (error) {
      return this.swapModel_
        .updateOne(
          {
            _id: swapId,
          },
          {
            $set: { payment_status: "requires_action" },
          }
        )
        .then(result => {
          this.eventBus_.emit(SwapService.Events.PAYMENT_CAPTURE_FAILED, result)
          return result
        })
    }

    return this.swapModel_
      .updateOne(
        {
          _id: swapId,
        },
        {
          $set: updateFields,
        }
      )
      .then(result => {
        this.eventBus_.emit(SwapService.Events.PAYMENT_CAPTURED, result)
        return result
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

    // Add return lines to the cart to ensure that the total calculation is
    // correct.
    const returnLines = swap.return_items.map(r => {
      const lineItem = order.items.find(i => i._id.equals(r.item_id))

      return {
        ...lineItem,
        content: {
          ...lineItem.content,
          unit_price: -1 * lineItem.content.unit_price,
        },
        quantity: r.quantity,
        metadata: {
          ...lineItem.metadata,
          is_return_line: true,
        },
      }
    })

    // If the swap has a return shipping method the price has to be added to the
    // cart.
    if (swap.return_shipping) {
      returnLines.push({
        title: "Return shipping",
        quantity: 1,
        has_shipping: true,
        no_discount: true,
        content: {
          unit_price: swap.return_shipping.price,
          quantity: 1,
        },
        metadata: {
          is_return_line: true,
        },
      })
    }

    const cart = await this.cartService_.create({
      discounts: order.discounts,
      email: order.email,
      billing_address: order.billing_address,
      shipping_address: order.shipping_address,
      items: [...returnLines, ...swap.additional_items],
      region_id: order.region_id,
      customer_id: order.customer_id,
      is_swap: true,
      metadata: {
        swap_id: swap._id,
        parent_order_id: order._id,
      },
    })

    return this.swapModel_.updateOne(
      { _id: swapId },
      { $set: { cart_id: cart._id } }
    )
  }

  /**
   *
   */
  async registerCartCompletion(swapId, cartId) {
    const swap = await this.retrieve(swapId)
    const cart = await this.cartService_.retrieve(cartId)

    // If we already registered the cart completion we just return
    if (swap.is_paid) {
      return swap
    }

    if (!cart._id.equals(swap.cart_id)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cart does not belong to swap"
      )
    }

    const total = await this.totalsService_.getTotal(cart)

    let payment = {}

    if (total > 0) {
      let paymentSession = {}
      let paymentData = {}
      const { payment_method, payment_sessions } = cart

      if (!payment_method) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Cart does not contain a payment method"
        )
      }

      if (!payment_sessions || !payment_sessions.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "cart must have payment sessions"
        )
      }

      paymentSession = payment_sessions.find(
        ps => ps.provider_id === payment_method.provider_id
      )

      // Throw if payment method does not exist
      if (!paymentSession) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Cart does not have an authorized payment session"
        )
      }

      const paymentProvider = this.paymentProviderService_.retrieveProvider(
        paymentSession.provider_id
      )
      const paymentStatus = await paymentProvider.getStatus(paymentSession.data)

      // If payment status is not authorized, we throw
      if (paymentStatus !== "authorized" && paymentStatus !== "succeeded") {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Payment method is not authorized"
        )
      }

      paymentData = await paymentProvider.retrievePayment(paymentSession.data)

      if (paymentSession.provider_id) {
        payment = {
          provider_id: paymentSession.provider_id,
          data: paymentData,
        }
      }
    }

    return this.swapModel_
      .updateOne(
        { _id: swap._id },
        {
          shipping_address: cart.shipping_address,
          shipping_methods: cart.shipping_methods,
          is_paid: true,
          amount_paid: total,
          payment_method: payment,
        }
      )
      .then(result => {
        this.eventBus_.emit(SwapService.Events.PAYMENT_COMPLETED, {
          swap: result,
        })
        return result
      })
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
  async createFulfillment(order, swapId, metadata = {}) {
    const swap = await this.retrieve(swapId)

    const fulfillments = await this.fulfillmentService_.createFulfillment(
      {
        ...swap,
        currency_code: order.currency_code,
        tax_rate: order.tax_rate,
        region_id: order.region_id,
        display_id: order.display_id,
        billing_address: order.billing_address,
        items: swap.additional_items,
        shipping_methods: swap.shipping_methods,
        is_swap: true,
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
          fulfillment_status: "fulfilled",
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

    // Go through all the additional items in the swap
    const updatedItems = swap.additional_items.map(i => {
      let shipmentItem
      for (const fulfillment of updatedFulfillments) {
        const item = fulfillment.items.find(fi => i._id.equals(fi._id))
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

    const fulfillment_status = updatedItems.every(i => i.shipped)
      ? "shipped"
      : "partially_shipped"

    return this.swapModel_
      .updateOne(
        { _id: swapId },
        {
          $set: {
            fulfillment_status,
            additional_items: updatedItems,
            fulfillments: updatedFulfillments,
          },
        }
      )
      .then(result => {
        this.eventBus_.emit(SwapService.Events.SHIPMENT_CREATED, {
          swap_id: swapId,
          shipment: result.fulfillments.find(f => f._id.equals(fulfillmentId)),
        })
        return result
      })
  }

  /**
   * Dedicated method to set metadata for a swap.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} swapId - the swap to decorate.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise<Swap>} resolves to the updated result.
   */
  async setMetadata(swapId, key, value) {
    const validatedId = this.validateId_(swapId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.swapModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Dedicated method to delete metadata for a swap.
   * @param {string} swapId - the order to delete metadata from.
   * @param {string} key - key for metadata field
   * @return {Promise} resolves to the updated result.
   */
  async deleteMetadata(swapId, key) {
    const validatedId = this.validateId_(swapId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.swapModel_
      .updateOne({ _id: validatedId }, { $unset: { [keyPath]: "" } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default SwapService
