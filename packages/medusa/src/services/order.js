import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class OrderService extends BaseService {
  static Events = {
    GIFT_CARD_CREATED: "order.gift_card_created",
    PAYMENT_CAPTURED: "order.payment_captured",
    SHIPMENT_CREATED: "order.shipment_created",
    FULFILLMENT_CREATED: "order.fulfillment_created",
    RETURN_REQUESTED: "order.return_requested",
    ITEMS_RETURNED: "order.items_returned",
    RETURN_ACTION_REQUIRED: "order.return_action_required",
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
    shippingOptionService,
    shippingProfileService,
    discountService,
    fulfillmentProviderService,
    lineItemService,
    totalsService,
    regionService,
    documentService,
    eventBusService,
  }) {
    super()

    /** @private @constantant {OrderModel} */
    this.orderModel_ = orderModel

    /** @private @constantant {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService

    /** @private @constantant {ShippingProvileService} */
    this.shippingProfileService_ = shippingProfileService

    /** @private @constant {FulfillmentProviderService} */
    this.fulfillmentProviderService_ = fulfillmentProviderService

    /** @private @constant {LineItemService} */
    this.lineItemService_ = lineItemService

    /** @private @constant {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @constant {RegionService} */
    this.regionService_ = regionService

    /** @private @constant {DiscountService} */
    this.discountService_ = discountService

    /** @private @constant {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @constant {DocumentService} */
    this.documentService_ = documentService

    /** @private @constant {CounterService} */
    this.counterService_ = counterService

    /** @private @constant {ShippingOptionService} */
    this.shippingOptionService_ = shippingOptionService
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
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
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

        const total = await this.totalsService_.getTotal(cart)

        let paymentSession = {}
        let paymentData = {}
        const { payment_method, payment_sessions } = cart

        // Would be the case if a discount code is applied that covers the item
        // total
        if (total !== 0) {
          // Throw if payment method does not exist
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

          paymentData = await paymentProvider.retrievePayment(
            paymentSession.data
          )
        }

        const region = await this.regionService_.retrieve(cart.region_id)

        let payment = {}
        if (paymentSession.provider_id) {
          payment = {
            provider_id: paymentSession.provider_id,
            data: paymentData,
          }
        }

        const o = {
          display_id: await this.counterService_.getNext("orders"),
          payment_method: payment,
          discounts: cart.discounts,
          shipping_methods: cart.shipping_methods,
          items: cart.items,
          shipping_address: cart.shipping_address,
          billing_address: cart.shipping_address,
          region_id: cart.region_id,
          email: cart.email,
          customer_id: cart.customer_id,
          cart_id: cart._id,
          tax_rate: region.tax_rate,
          currency_code: region.currency_code,
          metadata: cart.metadata || {},
        }

        const orderDocument = await this.orderModel_
          .create([o], {
            session: dbSession,
          })
          .catch(err => console.log(err))

        // Emit and return
        this.eventBus_.emit(OrderService.Events.PLACED, orderDocument[0])
        return orderDocument[0]
      })
      .then(() => this.orderModel_.findOne({ cart_id: cart._id }))
  }

  /**
   * Adds a shipment to the order to indicate that an order has left the
   * warehouse. Will ask the fulfillment provider for any documents that may
   * have been created in regards to the shipment.
   * @param {string} orderId - the id of the order that has been shipped
   * @param {string} fulfillmentId - the fulfillment that has now been shipped
   * @param {Array<String>} trackingNumbers - array of tracking numebers
   *   associated with the shipment
   * @param {Dictionary<String, String>} metadata - optional metadata to add to
   *   the fulfillment
   * @return {order} the resulting order following the update.
   */
  async createShipment(orderId, fulfillmentId, trackingNumbers, metadata = {}) {
    const order = await this.retrieve(orderId)

    const shipment = order.fulfillments.find(f => f._id.equals(fulfillmentId))
    if (!shipment) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a fulfillment with the provided id`
      )
    }

    const updated = {
      ...shipment,
      tracking_numbers: trackingNumbers,
      shipped_at: Date.now(),
      metadata: {
        ...shipment.metadata,
        ...metadata,
      },
    }

    // Add the shipment to the order
    return this.orderModel_
      .updateOne(
        { _id: orderId, "fulfillments._id": fulfillmentId },
        {
          $set: { "fulfillments.$": updated },
        }
      )
      .then(result => {
        this.eventBus_.emit(OrderService.Events.SHIPMENT_CREATED, {
          order_id: orderId,
          shipment: result.fulfillments.find(f => f._id.equals(fulfillmentId)),
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

    const updateFields = { payment_status: "captured" }

    const { provider_id, data } = order.payment_method
    const paymentProvider = await this.paymentProviderService_.retrieveProvider(
      provider_id
    )

    await paymentProvider.capturePayment(data)

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
   * Checks that a given quantity of a line item can be fulfilled. Fails if the
   * fulfillable quantity is lower than the requested fulfillment quantity.
   * Fulfillable quantity is calculated by subtracting the already fulfilled
   * quantity from the quantity that was originally purchased.
   * @param {LineItem} item - the line item to check has sufficient fulfillable
   *   quantity.
   * @param {number} quantity - the quantity that is requested to be fulfilled.
   * @return {LineItem} a line item that has the requested fulfillment quantity
   *   set.
   */
  validateFulfillmentLineItem_(item, quantity) {
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

    const lineItems = await this.getFulfillmentItems_(
      order,
      itemsToFulfill,
      this.validateFulfillmentLineItem_
    )

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
          .createOrder(method.data, method.items, { ...order })
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
        return {
          ...i,
          fulfilled: i.quantity === ful.quantity,
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
   * Retrieves the order line items, given an array of items.
   * @param {Order} order - the order to get line items from
   * @param {{ item_id: string, quantity: number }} items - the items to get
   * @param {function} transformer - a function to apply to each of the items
   *    retrieved from the order, should return a line item. If the transformer
   *    returns an undefined value the line item will be filtered from the
   *    returned array.
   * @return {Promise<Array<LineItem>>} the line items generated by the transformer.
   */
  async getFulfillmentItems_(order, items, transformer) {
    const toReturn = await Promise.all(
      items.map(async ({ item_id, quantity }) => {
        const item = order.items.find(i => i._id.equals(item_id))
        return transformer(item, quantity)
      })
    )

    return toReturn.filter(i => !!i)
  }

  /**
   * Checks that a given quantity of a line item can be returned. Fails if the
   * item is undefined or if the returnable quantity of the item is lower, than
   * the quantity that is requested to be returned.
   * @param {LineItem?} item - the line item to check has sufficient returnable
   *   quantity.
   * @param {number} quantity - the quantity that is requested to be returned.
   * @return {LineItem} a line item where the quantity is set to the requested
   *   return quantity.
   */
  validateReturnLineItem_(item, quantity) {
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
  }

  /**
   * Checks that an order has the statuses necessary to complete a return.
   * fulfillment_status cannot be not_fulfilled or returned.
   * payment_status must be captured.
   * @param {Order} order - the order to check statuses on
   * @throws when statuses are not sufficient for returns.
   */
  validateReturnStatuses_(order) {
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
  }

  /**
   * Generates documents.
   * @param {Array<Document>} docs - documents to generate
   * @param {Function} transformer - a function to apply to the created document
   *   before returning.
   * @return {Promise<Array<_>>} returns the created documents
   */
  createDocuments_(docs, transformer) {
    return Promise.all(
      docs.map(async d => {
        const doc = await this.documentService_.create(d)
        return transformer(doc)
      })
    )
  }

  /**
   * Creates a return request for an order, with given items, and a shipping
   * method. If no refundAmount is provided the refund amount is calculated from
   * the return lines and the shipping cost.
   * @param {String} orderId - the id of the order to create a return for.
   * @param {Array<{item_id: String, quantity: Int}>} items - the line items to
   *   return
   * @param {ShippingMethod?} shippingMethod - the shipping method used for the
   *   return
   * @param {Number?} refundAmount - the amount to refund when the return is
   *   received.
   * @returns {Promise<Order>} the resulting order.
   */
  async requestReturn(orderId, items, shippingMethod, refundAmount) {
    const order = await this.retrieve(orderId)

    // Throws if the order doesn't have the necessary status for return
    this.validateReturnStatuses_(order)

    let toRefund = refundAmount
    if (typeof refundAmount !== "undefined") {
      const total = await this.totalsService_.getTotal(order)
      const refunded = await this.totalsService_.getRefundedTotal(order)
      const refundable = total - refunded
      if (refundAmount > refundable) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot refund more than the original payment"
        )
      }
    } else {
      toRefund = await this.totalsService_.getRefundTotal(order, returnLines)
    }

    const returnLines = await this.getFulfillmentItems_(
      order,
      items,
      this.validateReturnLineItem_
    )

    let fulfillmentData = {}
    let shipping_method = {}
    if (typeof shippingMethod !== "undefined") {
      shipping_method = await this.shippingOptionService_.retrieve(
        shippingMethod.id
      )
      const provider = await this.fulfillmentProviderService_.retrieveProvider(
        shipping_method.provider_id
      )
      fulfillmentData = await provider.createReturn(
        shipping_method.data,
        returnLines,
        order
      )

      if (typeof shippingMethod.price !== "undefined") {
        shipping_method.price = shippingMethod.price
      } else {
        shipping_method.price = await this.shippingOptionService_.getPrice(
          shipping_method,
          {
            ...order,
            items: returnLines,
          }
        )
      }

      toRefund = Math.max(0, toRefund - shipping_method.price)
    }

    const newReturn = {
      shipping_method,
      refund_amount: toRefund,
      items: returnLines.map(i => ({
        item_id: i._id,
        content: i.content,
        quantity: i.quantity,
        is_requested: true,
        metadata: i.metadata,
      })),
      shipping_data: fulfillmentData,
    }

    return this.orderModel_
      .updateOne(
        {
          _id: order._id,
        },
        {
          $push: {
            returns: newReturn,
          },
        }
      )
      .then(result => {
        this.eventBus_.emit(OrderService.Events.RETURN_REQUESTED, {
          order: result,
          return: newReturn,
        })
        return result
      })
  }

  /**
   * Registers a previously requested return as received. This will create a
   * refund to the customer. If the returned items don't match the requested
   * items the return status will be updated to requires_action. This behaviour
   * is useful in sitautions where a custom refund amount is requested, but the
   * retuned items are not matching the requested items. Setting the
   * allowMismatch argument to true, will process the return, ignoring any
   * mismatches.
   * @param {string} orderId - the order to return.
   * @param {string[]} lineItems - the line items to return
   * @return {Promise} the result of the update operation
   */
  async return(orderId, returnId, items, refundAmount, allowMismatch = false) {
    const order = await this.retrieve(orderId)
    const returnRequest = order.returns.find(r => r._id.equals(returnId))
    if (!returnRequest) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Return request with id ${returnId} was not found`
      )
    }

    if (returnRequest.status === "received") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Return with id ${returnId} has already been received`
      )
    }

    const returnLines = await this.getFulfillmentItems_(
      order,
      items,
      this.validateReturnLineItem_
    )

    const newLines = returnLines.map(l => {
      const existing = returnRequest.items.find(i => l._id.equals(i.item_id))
      if (existing) {
        return {
          ...existing,
          quantity: l.quantity,
          requested_quantity: existing.quantity,
          is_requested: l.quantity === existing.quantity,
          is_registered: true,
        }
      } else {
        return {
          item_id: l._id,
          content: l.content,
          quantity: l.quantity,
          is_requested: false,
          is_registered: true,
          metadata: l.metadata,
        }
      }
    })

    const isMatching = newLines.every(l => l.is_requested)
    if (!isMatching && !allowMismatch) {
      // Should update status
      const newReturns = order.returns.map(r => {
        if (r._id.equals(returnId)) {
          return {
            ...r,
            status: "requires_action",
            items: newLines,
          }
        } else {
          return r
        }
      })
      return this.orderModel_
        .updateOne(
          {
            _id: orderId,
          },
          {
            $set: {
              returns: newReturns,
            },
          }
        )
        .then(result => {
          this.eventBus_.emit(OrderService.Events.RETURN_ACTION_REQUIRED, {
            order: result,
            return: result.returns.find(r => r._id.equals(returnId)),
          })
          return result
        })
    }

    const toRefund = refundAmount || returnRequest.refund_amount
    const total = await this.totalsService_.getTotal(order)
    const refunded = await this.totalsService_.getRefundedTotal(order)

    if (toRefund > total - refunded) {
      const newReturns = order.returns.map(r => {
        if (r._id.equals(returnId)) {
          return {
            ...r,
            status: "requires_action",
            items: newLines,
          }
        } else {
          return r
        }
      })
      return this.orderModel_
        .updateOne(
          {
            _id: orderId,
          },
          {
            $set: {
              returns: newReturns,
            },
          }
        )
        .then(result => {
          this.eventBus_.emit(OrderService.Events.RETURN_ACTION_REQUIRED, {
            order: result,
            return: result.returns.find(r => r._id.equals(returnId)),
          })
          return result
        })
    }

    let isFullReturn = true
    const newItems = order.items.map(i => {
      const isReturn = returnLines.find(r => r._id.equals(i._id))
      if (isReturn) {
        const returnedQuantity = i.returned_quantity + isReturn.quantity
        let returned = i.quantity === returnedQuantity
        if (!returned) {
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

    const newReturns = order.returns.map(r => {
      if (r._id.equals(returnId)) {
        return {
          ...r,
          status: "received",
          items: newLines,
          refund_amount: toRefund,
        }
      } else {
        return r
      }
    })

    const update = {
      $set: {
        returns: newReturns,
        items: newItems,
        fulfillment_status: isFullReturn ? "returned" : "partially_returned",
      },
    }

    if (toRefund > 0) {
      const { provider_id, data } = order.payment_method
      const paymentProvider = this.paymentProviderService_.retrieveProvider(
        provider_id
      )
      await paymentProvider.refundPayment(data, toRefund)
      update.$push = {
        refunds: {
          amount: toRefund,
        },
      }
    }

    return this.orderModel_.updateOne({ _id: orderId }, update).then(result => {
      this.eventBus_.emit(OrderService.Events.ITEMS_RETURNED, {
        order: result,
        return: result.returns.find(r => r._id.equals(returnId)),
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
  async decorate(order, fields = [], expandFields = []) {
    if (fields.length === 0) {
      // Default to include all fields
      fields = [
        "_id",
        "display_id",
        "status",
        "fulfillment_status",
        "payment_status",
        "email",
        "cart_id",
        "billing_address",
        "shipping_address",
        "items",
        "currency_code",
        "tax_rate",
        "fulfillments",
        "returns",
        "refunds",
        "region_id",
        "discounts",
        "customer_id",
        "payment_method",
        "shipping_methods",
        "documents",
        "created",
        "metadata",
        "shipping_total",
        "discount_total",
        "tax_total",
        "subtotal",
        "total",
        "refunded_total",
        "refundable_amount",
      ]
    }
    const requiredFields = [
      "_id",
      "display_id",
      "fulfillment_status",
      "payment_status",
      "status",
      "currency_code",
      "region_id",
      "metadata",
    ]
    const o = _.pick(order, fields.concat(requiredFields))

    if (fields.includes("shipping_total")) {
      o.shipping_total = await this.totalsService_.getShippingTotal(order)
    }
    if (fields.includes("discount_total")) {
      o.discount_total = await this.totalsService_.getDiscountTotal(order)
    }
    if (fields.includes("tax_total")) {
      o.tax_total = await this.totalsService_.getTaxTotal(order)
    }
    if (fields.includes("subtotal")) {
      o.subtotal = await this.totalsService_.getSubtotal(order)
    }
    if (fields.includes("total")) {
      o.total = await this.totalsService_.getTotal(order)
    }
    if (fields.includes("refunded_total")) {
      o.refunded_total = await this.totalsService_.getRefundedTotal(order)
    }
    if (fields.includes("refundable_amount")) {
      o.refundable_amount = o.total - o.refunded_total
    }

    o.created = order._id.getTimestamp()

    if (expandFields.includes("region")) {
      o.region = await this.regionService_.retrieve(order.region_id)
    }

    if (fields.includes("items")) {
      o.items = order.items.map(i => {
        return {
          ...i,
          refundable: this.totalsService_.getLineItemRefund(o, {
            ...i,
            quantity: i.quantity - i.returned_quantity,
          }),
        }
      })
    }

    const data = await this.runDecorators_(o)
    return data
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
