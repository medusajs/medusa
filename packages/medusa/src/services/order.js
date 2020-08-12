import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class OrderService extends BaseService {
  static Events = {
    GIFT_CARD_CREATED: "order.gift_card_created",
    PAYMENT_CAPTURED: "order.payment_captured",
    SHIPMENT_CREATED: "order.shipment_created",
    ITEMS_RETURNED: "order.items_returned",
    REFUND_CREATED: "order.refund_created",
    PLACED: "order.placed",
    UPDATED: "order.updated",
    CANCELLED: "order.cancelled",
    COMPLETED: "order.completed",
  }

  constructor({
    orderModel,
    counterService,
    paymentProviderService,
    shippingProfileService,
    discountService,
    fulfillmentProviderService,
    lineItemService,
    totalsService,
    regionService,
    eventBusService,
  }) {
    super()

    /** @private @const {OrderModel} */
    this.orderModel_ = orderModel

    /** @private @const {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService

    /** @private @const {ShippingProvileService} */
    this.shippingProfileService_ = shippingProfileService

    /** @private @const {FulfillmentProviderService} */
    this.fulfillmentProviderService_ = fulfillmentProviderService

    /** @private @const {LineItemService} */
    this.lineItemService_ = lineItemService

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {DiscountService} */
    this.discountService_ = discountService

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    this.counterService_ = counterService
  }

  /**
   * Used to validate order ids. Throws an error if the cast fails
   * @param {string} rawId - the raw order id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId.toString())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The order id could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Used to validate order addresses. Can be used to both
   * validate shipping and billing address.
   * @param {Address} address - the address to validate
   * @return {Address} the validated address
   */
  validateAddress_(address) {
    const { value, error } = Validator.address().validate(address)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The address is not valid"
      )
    }

    return value
  }

  /**
   * Used to validate email.
   * @param {string} email - the email to vaildate
   * @return {string} the validate email
   */
  validateEmail_(email) {
    const schema = Validator.string().email()
    const { value, error } = schema.validate(email)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The email is not valid"
      )
    }

    return value
  }

  async partitionItems_(shipping_methods, items) {
    let updatedMethods = []
    // partition order items to their dedicated shipping method
    await Promise.all(
      shipping_methods.map(async method => {
        const { profile_id } = method
        const profile = await this.shippingProfileService_.retrieve(profile_id)
        // for each method find the items in the order, that are associated
        // with the profile on the current shipping method
        if (shipping_methods.length === 1) {
          method.items = items
        } else {
          method.items = items.filter(({ content }) => {
            if (Array.isArray(content)) {
              // we require bundles to have same shipping method, therefore:
              return profile.products.includes(content[0].product._id)
            } else {
              return profile.products.includes(content.product._id)
            }
          })
        }
        updatedMethods.push(method)
      })
    )
    return updatedMethods
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.orderModel_.find(selector)
  }

  /**
   * Gets an order by id.
   * @param {string} orderId - id of order to retrieve
   * @return {Promise<Order>} the order document
   */
  async retrieve(orderId) {
    const validatedId = this.validateId_(orderId)
    const order = await this.orderModel_
      .findOne({ _id: validatedId })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with ${orderId} was not found`
      )
    }
    return order
  }

  /**
   * Gets an order by cart id.
   * @param {string} cartId - cart id to find order
   * @return {Promise<Order>} the order document
   */
  async retrieveByCartId(cartId) {
    const order = await this.orderModel_
      .findOne({ cart_id: cartId })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with cart id ${cartId} was not found`
      )
    }
    return order
  }

  /**
   * Gets an order by metadata key value pair.
   * @param {string} key - key of metadata
   * @param {string} value - value of metadata
   * @return {Promise<Order>} the order document
   */
  async retrieveByMetadata(key, value) {
    const order = await this.orderModel_
      .findOne({ metadata: { [key]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with metadata ${key}: ${value} was not found`
      )
    }
    return order
  }

  /**
   * Checks the existence of an order by cart id.
   * @param {string} cartId - cart id to find order
   * @return {Promise<Order>} the order document
   */
  async existsByCartId(cartId) {
    const order = await this.orderModel_
      .findOne({ metadata: { cart_id: cartId } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!order) {
      return false
    }
    return true
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.orderModel_.find(selector)
  }

  /**
   * @param {string} orderId - id of the order to complete
   * @return {Promise} the result of the find operation
   */
  async completeOrder(orderId) {
    const order = await this.retrieve(orderId)

    // Capture the payment
    await this.capturePayment(orderId)

    // Run all other registered events
    const completeOrderJob = await this.eventBus_.emit(
      OrderService.Events.COMPLETED,
      result
    )

    await completeOrderJob.finished().catch(error => {
      throw error
    })

    return this.orderModel_
      .updateOne(
        { _id: order._id },
        {
          $set: { status: "completed" },
        }
      )
      .then(async result => {})
  }

  /**
   * Creates an order from a cart
   * @param {object} order - the order to create
   * @return {Promise} resolves to the creation result.
   */
  async createFromCart(cart) {
    // Create DB session for transaction
    const dbSession = await this.orderModel_.startSession()

    // Initialize DB transaction
    return dbSession
      .withTransaction(async () => {
        // Check if order from cart already exists
        // If so, this function throws
        const exists = await this.existsByCartId(cart._id)
        if (exists) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Order from cart already exists"
          )
        }

        // Throw if payment method does not exist
        if (!cart.payment_method) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cart does not contain a payment method"
          )
        }

        const { payment_method, payment_sessions } = cart

        if (!payment_sessions || !payment_sessions.length) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "cart must have payment sessions"
          )
        }

        let paymentSession = payment_sessions.find(
          ps => ps.provider_id === payment_method.provider_id
        )

        // Throw if payment method does not exist
        if (!paymentSession) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cart does not have an authorized payment session"
          )
        }

        const region = await this.regionService_.retrieve(cart.region_id)
        const paymentProvider = this.paymentProviderService_.retrieveProvider(
          paymentSession.provider_id
        )
        const paymentStatus = await paymentProvider.getStatus(
          paymentSession.data
        )

        // If payment status is not authorized, we throw
        if (paymentStatus !== "authorized" && paymentStatus !== "succeeded") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Payment method is not authorized"
          )
        }

        const paymentData = await paymentProvider.retrievePayment(
          paymentSession.data
        )

        // Generate gift cards if in cart
        const items = await Promise.all(
          cart.items.map(async i => {
            if (i.is_giftcard) {
              const giftcard = await this.discountService_
                .generateGiftCard(i.content.unit_price, region._id)
                .then(result => {
                  this.eventBus_.emit(OrderService.Events.GIFT_CARD_CREATED, {
                    currency_code: region.currency_code,
                    tax_rate: region.tax_rate,
                    giftcard: result,
                    email: cart.email,
                  })
                  return result
                })
              return {
                ...i,
                metadata: {
                  ...i.metadata,
                  giftcard: giftcard._id,
                },
              }
            }
            return i
          })
        )

        const o = {
          display_id: await this.counterService_.getNext("orders"),
          payment_method: {
            provider_id: paymentSession.provider_id,
            data: paymentData,
          },
          discounts: cart.discounts,
          shipping_methods: cart.shipping_methods,
          items,
          shipping_address: cart.shipping_address,
          billing_address: cart.shipping_address,
          region_id: cart.region_id,
          email: cart.email,
          customer_id: cart.customer_id,
          cart_id: cart._id,
          tax_rate: region.tax_rate,
          currency_code: region.currency_code,
          metadata: cart.metadata,
        }

        const orderDocument = await this.orderModel_.create([o], {
          session: dbSession,
        })

        // Emit and return
        this.eventBus_.emit(OrderService.Events.PLACED, orderDocument[0])
        return orderDocument[0]
      })
      .then(() => this.orderModel_.findOne({ cart_id: cart._id }))
  }

  /**
   * Adds a shipment to the order to indicate that an order has left the warehouse
   */
  async createShipment(orderId, fulfillmentId, trackingNumbers, metadata = {}) {
    const order = await this.retrieve(orderId)

    let shipment
    const updated = order.fulfillments.map(f => {
      if (f._id.equals(fulfillmentId)) {
        shipment = {
          ...f,
          tracking_numbers: trackingNumbers,
          metadata: {
            ...f.metadata,
            ...metadata,
          },
        }
      }
      return f
    })

    // Add the shipment to the order
    return this.orderModel_
      .updateOne(
        { _id: orderId },
        {
          $set: { fulfillments: updated },
        }
      )
      .then(result => {
        this.eventBus_.emit(OrderService.Events.SHIPMENT_CREATED, {
          order_id: orderId,
          shipment,
        })
        return result
      })
  }

  /**
   * Creates an order
   * @param {object} order - the order to create
   * @return {Promise} resolves to the creation result.
   */
  async create(order) {
    return this.orderModel_
      .create(order)
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.PLACED, result)
        return result
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Updates an order. Metadata updates should
   * use dedicated method, e.g. `setMetadata` etc. The function
   * will throw errors if metadata updates are attempted.
   * @param {string} orderId - the id of the order. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(orderId, update) {
    const order = await this.retrieve(orderId)

    if (
      (update.shipping_address ||
        update.billing_address ||
        update.payment_method ||
        update.items) &&
      (order.fulfillment_status !== "not_fulfilled" ||
        order.payment_status !== "awaiting" ||
        order.status !== "pending")
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't update shipping, billing, items and payment method when order is processed"
      )
    }

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    if (update.status || update.fulfillment_status || update.payment_status) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't update order statuses. This will happen automatically. Use metadata in order for additional statuses"
      )
    }

    const updateFields = { ...update }

    if (update.shipping_address) {
      updateFields.shipping_address = this.validateAddress_(
        update.shipping_address
      )
    }

    if (update.billing_address) {
      updateFields.billing_address = this.validateAddress_(
        update.billing_address
      )
    }

    if (update.items) {
      updateFields.items = update.items.map(item =>
        this.lineItemService_.validate(item)
      )
    }

    return this.orderModel_
      .updateOne(
        { _id: order._id },
        { $set: updateFields },
        { runValidators: true }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.UPDATED, result)
        return result
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Cancels an order.
   * Throws if fulfillment process has been initiated.
   * Throws if payment process has been initiated.
   * @param {string} orderId - id of order to cancel.
   * @return {Promise} result of the update operation.
   */
  async cancel(orderId) {
    const order = await this.retrieve(orderId)

    if (order.fulfillment_status !== "not_fulfilled") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't cancel a fulfilled order"
      )
    }

    if (order.payment_status !== "awaiting") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't cancel an order with payment processed"
      )
    }

    // TODO: cancel payment method

    return this.orderModel_
      .updateOne(
        {
          _id: orderId,
        },
        {
          $set: { status: "cancelled" },
        }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.CANCELLED, result)
        return result
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Captures payment for an order.
   * @param {string} orderId - id of order to capture payment for.
   * @return {Promise} result of the update operation.
   */
  async capturePayment(orderId) {
    const order = await this.retrieve(orderId)

    if (order.payment_status !== "awaiting") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Payment already captured"
      )
    }

    // prepare update object
    const updateFields = { payment_status: "captured" }
    const completed = order.fulfillment_status !== "not_fulfilled"
    if (completed) {
      updateFields.status = "completed"
    }

    const { provider_id, data } = order.payment_method
    const paymentProvider = await this.paymentProviderService_.retrieveProvider(
      provider_id
    )

    const captureData = await paymentProvider.capturePayment(data)

    // If Adyen is used as payment provider, we need to check the
    // validity of the capture request
    if (
      captureData.data.pspReference &&
      captureData.data.response !== "[capture-received]"
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Could not process capture"
      )
    }

    return this.orderModel_
      .updateOne(
        {
          _id: orderId,
        },
        {
          $set: updateFields,
        }
      )
      .then(result => {
        this.eventBus_.emit(OrderService.Events.PAYMENT_CAPTURED, result)
        return result
      })
  }

  /**
   * Creates fulfillments for an order.
   * In a situation where the order has more than one shipping method,
   * we need to partition the order items, such that they can be sent
   * to their respective fulfillment provider.
   * @param {string} orderId - id of order to cancel.
   * @return {Promise} result of the update operation.
   */
  async createFulfillment(orderId, itemsToFulfill, metadata = {}) {
    const order = await this.retrieve(orderId)

    const lineItems = itemsToFulfill
      .map(({ item_id, quantity }) => {
        const item = order.items.find(i => i._id.equals(item_id))

        if (!item) {
          // This will in most cases be called by a webhook so to ensure that
          // things go through smoothly in instances where extra items outside
          // of Medusa are added we allow unknown items
          return null
        }

        if (quantity > item.quantity - item.fulfilled_quantity) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Cannot fulfill more items than have been purchased"
          )
        }
        return {
          ...item,
          quantity,
        }
      })
      .filter(i => !!i)

    if (order.fulfillment_status !== "not_fulfilled") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Order is already fulfilled"
      )
    }

    const { shipping_methods } = order

    // prepare update object
    const updateFields = { fulfillment_status: "fulfilled" }
    const completed = order.payment_status !== "awaiting"
    if (completed) {
      updateFields.status = "completed"
    }

    // partition order items to their dedicated shipping method
    const fulfillments = await this.partitionItems_(shipping_methods, lineItems)

    let successfullyFulfilled = []
    const results = await Promise.all(
      fulfillments.map(async method => {
        const provider = this.fulfillmentProviderService_.retrieveProvider(
          method.provider_id
        )

        const data = await provider
          .createOrder(method.data, method.items)
          .then(res => {
            successfullyFulfilled = [...successfullyFulfilled, ...method.items]
            return res
          })

        return {
          provider_id: method.provider_id,
          items: method.items,
          data,
          metadata,
        }
      })
    )

    // Reflect the fulfillments in the items
    updateFields.items = order.items.map(i => {
      const ful = successfullyFulfilled.find(f => i._id.equals(f._id))
      if (ful) {
        if (i.quantity === ful.quantity) {
          i.fulfilled = true
        }

        return {
          ...i,
          fulfilled_quantity: ful.quantity,
        }
      }

      return i
    })

    return this.orderModel_
      .updateOne(
        {
          _id: orderId,
        },
        {
          $push: { fulfillments: { $each: results } },
          $set: updateFields,
        }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.UPDATED, result)
        return result
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Return either the entire or part of an order.
   * @param {string} orderId - the order to return.
   * @param {string[]} lineItems - the line items to return
   * @return {Promise} the result of the update operation
   */
  async return(orderId, lineItems, refundAmount) {
    const order = await this.retrieve(orderId)

    const total = await this.totalsService_.getTotal(order)
    const refunded = await this.totalsService_.getRefundedTotal(order)

    if (refundAmount > total - refunded) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot refund more than the original payment"
      )
    }

    // Find the lines to return
    const returnLines = lineItems.map(({ item_id, quantity }) => {
      const item = order.items.find(i => i._id.equals(item_id))
      if (!item) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Return contains invalid line item"
        )
      }

      const returnable = item.quantity - item.returned_quantity
      if (quantity > returnable) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot return more items than have been purchased"
        )
      }

      return {
        ...item,
        quantity,
      }
    })

    if (
      order.fulfillment_status === "not_fulfilled" ||
      order.fulfillment_status === "returned"
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't return an unfulfilled or already returned order"
      )
    }

    if (order.payment_status !== "captured") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't return an order with payment unprocessed"
      )
    }

    const { provider_id, data } = order.payment_method
    const paymentProvider = this.paymentProviderService_.retrieveProvider(
      provider_id
    )

    const amount =
      refundAmount || this.totalsService_.getRefundTotal(order, returnLines)
    await paymentProvider.refundPayment(data, amount)

    let isFullReturn = true
    const newItems = order.items.map(i => {
      const isReturn = returnLines.find(r => r._id.equals(i._id))
      if (isReturn) {
        const returnedQuantity = i.returned_quantity + isReturn.quantity
        let returned = false
        if (i.quantity === returnedQuantity) {
          returned = true
        } else {
          isFullReturn = false
        }
        return {
          ...i,
          returned_quantity: returnedQuantity,
          returned,
        }
      } else {
        if (!i.returned) {
          isFullReturn = false
        }
        return i
      }
    })

    return this.orderModel_
      .updateOne(
        {
          _id: orderId,
        },
        {
          $push: {
            refunds: {
              amount,
            },
            returns: {
              items: lineItems,
              refund_amount: amount,
            },
          },
          $set: {
            items: newItems,
            fulfillment_status: isFullReturn
              ? "returned"
              : "partially_returned",
          },
        }
      )
      .then(result => {
        this.eventBus_.emit(OrderService.Events.ITEMS_RETURNED, {
          order: result,
          return: {
            items: lineItems,
            refund_amount: amount,
          },
        })
        return result
      })
  }

  /**
   * Archives an order. It only alloved, if the order has been fulfilled
   * and payment has been captured.
   * @param {string} orderId - the order to archive
   * @return {Promise} the result of the update operation
   */
  async archive(orderId) {
    const order = await this.retrieve(orderId)

    if (order.status !== ("completed" || "refunded")) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't archive an unprocessed order"
      )
    }

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: { status: "archived" },
      }
    )
  }

  /**
   * Refunds a given amount back to the customer.
   */
  async createRefund(orderId, refundAmount, reason, note) {
    const order = await this.retrieve(orderId)
    const total = await this.totalsService_.getTotal(order)
    const refunded = await this.totalsService_.getRefundedTotal(order)

    if (refundAmount > total - refunded) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot refund more than original order amount"
      )
    }

    const { provider_id, data } = order.payment_method
    const paymentProvider = this.paymentProviderService_.retrieveProvider(
      provider_id
    )

    await paymentProvider.refundPayment(data, refundAmount)

    return this.orderModel_
      .updateOne(
        {
          _id: orderId,
        },
        {
          $push: {
            refunds: {
              amount: refundAmount,
              reason,
              note,
            },
          },
        }
      )
      .then(result => {
        this.eventBus_.emit(OrderService.Events.REFUND_CREATED, {
          order: result,
          refund: {
            amount: refundAmount,
            reason,
            note,
          },
        })
        return result
      })
  }

  /**
   * Decorates an order.
   * @param {Order} order - the order to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Order} return the decorated order.
   */
  async decorate(order, fields, expandFields = []) {
    const o = order
    o.shipping_total = await this.totalsService_.getShippingTotal(order)
    o.discount_total = await this.totalsService_.getDiscountTotal(order)
    o.tax_total = await this.totalsService_.getTaxTotal(order)
    o.subtotal = await this.totalsService_.getSubtotal(order)
    o.total = await this.totalsService_.getTotal(order)
    o.refunded_total = await this.totalsService_.getRefundedTotal(order)
    o.refundable_amount = o.total - o.refunded_total
    o.created = order._id.getTimestamp()
    if (expandFields.includes("region")) {
      o.region = await this.regionService_.retrieve(order.region_id)
    }

    o.items = o.items.map(i => {
      return {
        ...i,
        refundable: this.totalsService_.getLineItemRefund(o, {
          ...i,
          quantity: i.quantity - i.returned_quantity,
        }),
      }
    })

    return o
  }

  /**
   * Dedicated method to set metadata for an order.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} orderId - the order to decorate.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  async setMetadata(orderId, key, value) {
    const validatedId = this.validateId_(orderId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.orderModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Dedicated method to delete metadata for an order.
   * @param {string} orderId - the order to delete metadata from.
   * @param {string} key - key for metadata field
   * @return {Promise} resolves to the updated result.
   */
  async deleteMetadata(orderId, key) {
    const validatedId = this.validateId_(orderId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.orderModel_
      .updateOne({ _id: validatedId }, { $unset: { [keyPath]: "" } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default OrderService
