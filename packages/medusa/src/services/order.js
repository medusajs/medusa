import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import mongoose from "mongoose"
import { BaseService } from "medusa-interfaces"

class OrderService extends BaseService {
  static Events = {
    GIFT_CARD_CREATED: "order.gift_card_created",
    PAYMENT_CAPTURED: "order.payment_captured",
    PAYMENT_CAPTURE_FAILED: "order.payment_capture_failed",
    PAYMENT_REFUNDED: "order.payment_refunded",
    PAYMENT_REFUND_FAILED: "order.payment_refund_failed",
    SHIPMENT_CREATED: "order.shipment_created",
    FULFILLMENT_CREATED: "order.fulfillment_created",
    ITEMS_RETURNED: "order.items_returned",
    REFUND_CREATED: "order.refund_created",
    PLACED: "order.placed",
    UPDATED: "order.updated",
    CANCELED: "order.canceled",
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
  list(selector, offset, limit) {
    return this.orderModel_
      .find(selector, {}, offset, limit)
      .sort({ created: -1 })
  }

  /**
   * Return the total number of documents in database
   * @return {Promise} the result of the count operation
   */
  count() {
    return this.orderModel_.count()
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
        return undefined
      })

    if (!order) {
      return false
    }
    return true
  }

  /**
   * @param {string} orderId - id of the order to complete
   * @return {Promise} the result of the find operation
   */
  async completeOrder(orderId) {
    const order = await this.retrieve(orderId)

    // Run all other registered events
    const completeOrderJob = await this.eventBus_.emit(
      OrderService.Events.COMPLETED,
      order
    )

    await completeOrderJob.finished().catch(error => {
      throw error
    })

    return this.orderModel_.updateOne(
      { _id: order._id },
      {
        $set: { status: "completed" },
      }
    )
  }

  /**
   * Creates an order from a cart
   * @param {object} order - the order to create
   * @return {Promise} resolves to the creation result.
   */
  async createFromCart(cart) {
    // Create DB session for transaction
    const dbSession = await mongoose.startSession()

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

        const { payment_method } = cart

        const region = await this.regionService_.retrieve(cart.region_id)
        const paymentProvider = this.paymentProviderService_.retrieveProvider(
          payment_method.provider_id
        )
        const paymentStatus = await paymentProvider.getStatus(
          payment_method.data
        )

        // If payment status is not authorized, we throw
        if (paymentStatus !== "authorized" && paymentStatus !== "succeeded") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Payment method is not authorized"
          )
        }

        const paymentData = await paymentProvider.retrievePayment(
          payment_method.data
        )

        // Generate gift cards if in cart
        const items = await Promise.all(
          cart.items.map(async i => {
            if (i.is_giftcard) {
              const giftcard = await this.discountService_
                .generateGiftCard(i.content.unit_price, region._id)
                .then(result => {
                  this.eventBus_.emit(OrderService.Events.GIFT_CARD_CREATED, {
                    line_item: i,
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
          display_id: await this.counterService_.getNext("orders", dbSession),
          payment_method: {
            provider_id: payment_method.provider_id,
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
        // For each item in the shipment, we set their status to shipped
        f.items.map(item => {
          const itemIdx = order.items.findIndex(el => el._id.equals(item._id))
          // Update item in order.items and in fullfillment.items to
          // ensure consistency
          if (item !== -1) {
            item.shipped_quantity = item.quantity
            order.items[itemIdx].shipped_quantity += item.quantity
          }
        })
        shipment = {
          ...f,
          tracking_numbers: trackingNumbers,
          shipped_at: Date.now(),
          metadata: {
            ...f.metadata,
            ...metadata,
          },
        }
        return shipment
      }
      return f
    })

    // Add the shipment to the order
    return this.orderModel_
      .updateOne(
        { _id: orderId },
        {
          $set: { fulfillments: updated, items: order.items },
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
      (update.shipping_address || update.billing_address || update.items) &&
      (order.fulfillment_status !== "not_fulfilled" ||
        order.payment_status !== "awaiting" ||
        order.status !== "pending")
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't update shipping, billing and items when order is processed"
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

    if (order.payment_status !== "awaiting") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Can't cancel an order with a processed payment"
      )
    }

    const fulfillments = await Promise.all(
      order.fulfillments.map(async fulfillment => {
        const { provider_id, data } = fulfillment
        const provider = await this.fulfillmentProviderService_.retrieveProvider(
          provider_id
        )
        const newData = await provider.cancelFulfillment(data)
        return {
          ...fulfillment,
          is_canceled: true,
          data: newData,
        }
      })
    )

    const { provider_id, data } = order.payment_method
    const paymentProvider = await this.paymentProviderService_.retrieveProvider(
      provider_id
    )

    // Cancel payment with payment provider
    const payData = await paymentProvider.cancelPayment(data)

    return this.orderModel_
      .updateOne(
        {
          _id: orderId,
        },
        {
          $set: {
            status: "canceled",
            fulfillment_status: "canceled",
            payment_status: "canceled",
            fulfillments,
            payment_method: {
              ...order.payment_method,
              data: payData,
            },
          },
        }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.CANCELED, result)
        return result
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Registers a failed payment.
   * @param {string} orderId - id of order to capture payment for.
   * @param {string} details - detailed reason for the failed payment
   * @return {Promise} result of the update operation.
   */
  async registerPaymentFailed(orderId, details) {
    const order = await this.retrieve(orderId)

    await this.setMetadata(order._id, "payment_failed", details)

    return this.orderModel_
      .updateOne(
        {
          _id: order._id,
        },
        {
          payment_status: "failed",
          status: "failed",
        }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.PAYMENT_CAPTURE_FAILED, result)
        return result
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Registers a fully shipped order.
   * @param {string} orderId - id of order to capture payment for.
   * @param {string} details - detailed reason for the failed payment
   * @return {Promise} result of the update operation.
   */
  async registerShipmentStatus(orderId, status) {
    const order = await this.retrieve(orderId)

    if (status !== "partially_shipped" && status !== "shipped") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Status must be partially_shipped or shipped"
      )
    }

    return this.orderModel_
      .updateOne(
        {
          _id: order._id,
        },
        {
          fulfillment_status: status,
        }
      )
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Registers a payment capture.
   * @param {string} orderId - id of order to capture payment for.
   * @return {Promise} result of the update operation.
   */
  async registerPaymentCapture(orderId) {
    const order = await this.retrieve(orderId)

    return this.orderModel_
      .updateOne(
        {
          _id: order._id,
        },
        {
          payment_status: "captured",
        }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.PAYMENT_CAPTURED, result)
        return result
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Registers a payment refund.
   * @param {string} orderId - id of order to capture payment for.
   * @param {string} items - items that have been refunded
   * @return {Promise} result of the update operation.
   */
  async registerRefund(orderId) {
    const order = await this.retrieve(orderId)
    const refundedTotal = await this.totalsService_.getRefundedTotal(order)
    const total = await this.totalsService_.getTotal(order)

    return this.orderModel_
      .updateOne(
        {
          _id: order._id,
        },
        {
          payment_status:
            total === refundedTotal ? "refunded" : "partially_refunded",
        }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.PAYMENT_REFUNDED, result)
        return result
      })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Registers a payment refund fail.
   * @param {string} orderId - id of order to capture payment for.
   * @return {Promise} result of the update operation.
   */
  async registerRefundFailed(orderId) {
    const order = await this.retrieve(orderId)

    return this.orderModel_
      .updateOne(
        {
          _id: order._id,
        },
        {
          payment_status: "failed",
        }
      )
      .then(result => {
        // Notify subscribers
        this.eventBus_.emit(OrderService.Events.PAYMENT_REFUND_FAILED, result)
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

    const { provider_id, data } = order.payment_method
    const paymentProvider = await this.paymentProviderService_.retrieveProvider(
      provider_id
    )

    const paymentStatus = await paymentProvider.capturePayment(data)

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: { payment_status: paymentStatus },
      }
    )
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
        const itemIdx = order.items.findIndex(i => i._id.equals(item_id))

        if (itemIdx === -1) {
          // This will in most cases be called by a webhook so to ensure that
          // things go through smoothly in instances where extra items outside
          // of Medusa are added we allow unknown items
          return null
        }

        const item = order.items[itemIdx]

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

    const { shipping_methods } = order

    const updateFields = {}

    // partition order items to their dedicated shipping method
    const fulfillments = await this.partitionItems_(shipping_methods, lineItems)

    let successfullyFulfilled = []
    const results = await Promise.all(
      fulfillments.map(async method => {
        const provider = this.fulfillmentProviderService_.retrieveProvider(
          method.provider_id
        )

        const data = provider
          .createOrder(method.data, method.items, order)
          .then(res => {
            successfullyFulfilled = [...successfullyFulfilled, ...method.items]
            return res
          })

        method.items = method.items.map(el => {
          return {
            ...el,
            fulfilled_quantity: el.quantity,
            fulfilled: true,
          }
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
          fulfilled_quantity: i.fulfilled_quantity + ful.quantity,
        }
      }

      return i
    })

    updateFields.fulfillment_status = "fulfilled"

    for (const el of updateFields.items) {
      if (el.quantity !== el.fulfilled_quantity) {
        updateFields.fulfillment_status = "partially_fulfilled"
        break
      }
    }

    return this.orderModel_
      .updateOne(
        {
          _id: orderId,
        },
        {
          $addToSet: { fulfillments: { $each: results } },
          $set: updateFields,
        }
      )
      .then(result => {
        for (const fulfillment of results) {
          this.eventBus_.emit(OrderService.Events.FULFILLMENT_CREATED, {
            order_id: orderId,
            fulfillment,
          })
        }
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
    const paymentStatus = await paymentProvider.refundPayment(data, amount)

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
            payment_status: paymentStatus,
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

    const paymentStatus = await paymentProvider.refundPayment(
      data,
      refundAmount
    )

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
          $set: {
            payment_status: paymentStatus,
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

    const final = await this.runDecorators_(o)
    return final
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
