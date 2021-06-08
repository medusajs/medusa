import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { Brackets } from "typeorm"

class OrderService extends BaseService {
  static Events = {
    GIFT_CARD_CREATED: "order.gift_card_created",
    PAYMENT_CAPTURED: "order.payment_captured",
    PAYMENT_CAPTURE_FAILED: "order.payment_capture_failed",
    SHIPMENT_CREATED: "order.shipment_created",
    FULFILLMENT_CREATED: "order.fulfillment_created",
    RETURN_REQUESTED: "order.return_requested",
    ITEMS_RETURNED: "order.items_returned",
    RETURN_ACTION_REQUIRED: "order.return_action_required",
    REFUND_CREATED: "order.refund_created",
    REFUND_FAILED: "order.refund_failed",
    SWAP_CREATED: "order.swap_created",
    PLACED: "order.placed",
    UPDATED: "order.updated",
    CANCELED: "order.canceled",
    COMPLETED: "order.completed",
  }

  constructor({
    manager,
    orderRepository,
    customerService,
    paymentProviderService,
    shippingOptionService,
    shippingProfileService,
    discountService,
    fulfillmentProviderService,
    fulfillmentService,
    lineItemService,
    totalsService,
    regionService,
    cartService,
    addressRepository,
    giftCardService,
    eventBusService,
  }) {
    super()

    /** @private @constant {EntityManager} */
    this.manager_ = manager

    /** @private @constant {OrderRepository} */
    this.orderRepository_ = orderRepository

    /** @private @constant {CustomerService} */
    this.customerService_ = customerService

    /** @private @constant {PaymentProviderService} */
    this.paymentProviderService_ = paymentProviderService

    /** @private @constant {ShippingProvileService} */
    this.shippingProfileService_ = shippingProfileService

    /** @private @constant {FulfillmentProviderService} */
    this.fulfillmentProviderService_ = fulfillmentProviderService

    /** @private @constant {LineItemService} */
    this.lineItemService_ = lineItemService

    /** @private @constant {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @constant {RegionService} */
    this.regionService_ = regionService

    /** @private @constant {FulfillmentService} */
    this.fulfillmentService_ = fulfillmentService

    /** @private @constant {DiscountService} */
    this.discountService_ = discountService

    /** @private @constant {DiscountService} */
    this.giftCardService_ = giftCardService

    /** @private @constant {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @constant {ShippingOptionService} */
    this.shippingOptionService_ = shippingOptionService

    /** @private @constant {CartService} */
    this.cartService_ = cartService

    /** @private @constant {AddressRepository} */
    this.addressRepository_ = addressRepository
  }

  withTransaction(manager) {
    if (!manager) {
      return this
    }

    const cloned = new OrderService({
      manager,
      orderRepository: this.orderRepository_,
      eventBusService: this.eventBus_,
      paymentProviderService: this.paymentProviderService_,
      regionService: this.regionService_,
      lineItemService: this.lineItemService_,
      shippingOptionService: this.shippingOptionService_,
      shippingProfileService: this.shippingProfileService_,
      fulfillmentProviderService: this.fulfillmentProviderService_,
      discountService: this.discountService_,
      totalsService: this.totalsService_,
      cartService: this.cartService_,
      giftCardService: this.giftCardService_,
    })

    cloned.transactionManager_ = manager

    return cloned
  }

  /**
   * Used to validate order ids. Throws an error if the cast fails
   * @param {string} rawId - the raw order id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    return rawId
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

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  async list(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)
    const query = this.buildQuery_(selector, config)

    const { select, relations, totalsToSelect } = this.transformQueryForTotals_(
      config
    )

    if (select && select.length) {
      query.select = select
    }

    if (relations && relations.length) {
      query.relations = relations
    }

    const raw = await orderRepo.find(query)

    return raw.map(r => this.decorateTotals_(r, totalsToSelect))
  }

  async listAndCount(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)

    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    if (q) {
      const where = query.where

      delete where.display_id
      delete where.email

      query.join = {
        alias: "order",
        innerJoin: {
          shipping_address: "order.shipping_address",
        },
      }

      query.where = qb => {
        qb.where(where)

        qb.andWhere(
          new Brackets(qb => {
            qb.where(`shipping_address.first_name ILIKE :q`, { q: `%${q}%` })
              .orWhere(`order.email ILIKE :q`, { q: `%${q}%` })
              .orWhere(`display_id::varchar(255) ILIKE :dId`, { dId: `${q}` })
          })
        )
      }
    }

    const { select, relations, totalsToSelect } = this.transformQueryForTotals_(
      config
    )

    if (select && select.length) {
      query.select = select
    }

    if (relations && relations.length) {
      query.relations = relations
    }

    const [raw, count] = await orderRepo.findAndCount(query)
    const orders = raw.map(r => this.decorateTotals_(r, totalsToSelect))

    return [orders, count]
  }

  transformQueryForTotals_(config) {
    let { select, relations } = config

    if (!select) {
      return {
        select,
        relations,
        totalsToSelect: [],
      }
    }

    const totalFields = [
      "subtotal",
      "tax_total",
      "shipping_total",
      "discount_total",
      "gift_card_total",
      "total",
      "paid_total",
      "refunded_total",
      "refundable_amount",
      "items.refundable",
      "swaps.additional_items.refundable",
    ]

    const totalsToSelect = select.filter(v => totalFields.includes(v))
    if (totalsToSelect.length > 0) {
      const relationSet = new Set(relations)
      relationSet.add("items")
      relationSet.add("swaps")
      relationSet.add("discounts")
      relationSet.add("gift_cards")
      relationSet.add("gift_card_transactions")
      relationSet.add("refunds")
      relationSet.add("shipping_methods")
      relationSet.add("region")
      relations = [...relationSet]

      select = select.filter(v => !totalFields.includes(v))
    }

    return {
      relations,
      select,
      totalsToSelect,
    }
  }

  /**
   * Gets an order by id.
   * @param {string} orderId - id of order to retrieve
   * @return {Promise<Order>} the order document
   */
  async retrieve(orderId, config = {}) {
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)
    const validatedId = this.validateId_(orderId)

    const { select, relations, totalsToSelect } = this.transformQueryForTotals_(
      config
    )

    const query = {
      where: { id: validatedId },
    }

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    if (select && select.length > 0) {
      query.select = select
    }

    const rels = query.relations
    delete query.relations
    const raw = await orderRepo.findOneWithRelations(rels, query)

    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with ${orderId} was not found`
      )
    }

    const order = this.decorateTotals_(raw, totalsToSelect)
    return order
  }

  /**
   * Gets an order by cart id.
   * @param {string} cartId - cart id to find order
   * @return {Promise<Order>} the order document
   */
  async retrieveByCartId(cartId, config = {}) {
    const orderRepo = this.manager_.getCustomRepository(this.orderRepository_)

    const { select, relations, totalsToSelect } = this.transformQueryForTotals_(
      config
    )

    const query = {
      where: { cart_id: cartId },
    }

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    if (select && select.length > 0) {
      query.select = select
    }

    const raw = await orderRepo.findOne(query)

    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with cart id: ${cartId} was not found`
      )
    }

    const order = this.decorateTotals_(raw, totalsToSelect)
    return order
  }

  /**
   * Checks the existence of an order by cart id.
   * @param {string} cartId - cart id to find order
   * @return {Promise<Order>} the order document
   */
  async existsByCartId(cartId) {
    const order = await this.retrieveByCartId(cartId).catch(_ => undefined)
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
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId)

      // Run all other registered events
      const completeOrderJob = await this.eventBus_.emit(
        OrderService.Events.COMPLETED,
        {
          id: orderId,
        }
      )

      await completeOrderJob.finished().catch(error => {
        throw error
      })

      order.status = "completed"

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      return orderRepo.save(order)
    })
  }

  /**
   * Creates an order from a cart
   * @param {string} cartId - id of the cart to create an order from
   * @return {Promise} resolves to the creation result.
   */
  async createFromCart(cartId) {
    return this.atomicPhase_(async manager => {
      const cart = await this.cartService_
        .withTransaction(manager)
        .retrieve(cartId, {
          select: ["subtotal", "total"],
          relations: [
            "region",
            "payment",
            "items",
            "discounts",
            "gift_cards",
            "shipping_methods",
          ],
        })

      if (cart.items.length === 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Cannot create order from empty cart"
        )
      }

      const exists = await this.existsByCartId(cart.id)
      if (exists) {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          "Order from cart already exists"
        )
      }

      const { payment, region, total } = cart
      // Would be the case if a discount code is applied that covers the item
      // total
      if (total !== 0) {
        // Throw if payment method does not exist
        if (!payment) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cart does not contain a payment method"
          )
        }

        const paymentStatus = await this.paymentProviderService_
          .withTransaction(manager)
          .getStatus(payment)

        // If payment status is not authorized, we throw
        if (paymentStatus !== "authorized" && paymentStatus !== "succeeded") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Payment method is not authorized"
          )
        }
      }

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      const o = await orderRepo.create({
        payment_status: "awaiting",
        discounts: cart.discounts,
        gift_cards: cart.gift_cards,
        payment_status: "awaiting",
        shipping_methods: cart.shipping_methods,
        shipping_address_id: cart.shipping_address_id,
        billing_address_id: cart.billing_address_id,
        region_id: cart.region_id,
        email: cart.email,
        customer_id: cart.customer_id,
        cart_id: cart.id,
        tax_rate: region.tax_rate,
        currency_code: region.currency_code,
        metadata: cart.metadata || {},
      })

      const result = await orderRepo.save(o)

      await this.paymentProviderService_
        .withTransaction(manager)
        .updatePayment(payment.id, {
          order_id: result.id,
        })

      let gcBalance = cart.subtotal
      for (const g of cart.gift_cards) {
        const newBalance = Math.max(0, g.balance - gcBalance)
        const usage = g.balance - newBalance
        await this.giftCardService_.withTransaction(manager).update(g.id, {
          balance: newBalance,
          disabled: newBalance === 0,
        })

        await this.giftCardService_.withTransaction(manager).createTransaction({
          gift_card_id: g.id,
          order_id: result.id,
          amount: usage,
        })

        gcBalance = gcBalance - usage
      }

      for (const method of cart.shipping_methods) {
        await this.shippingOptionService_
          .withTransaction(manager)
          .updateShippingMethod(method.id, { order_id: result.id })
      }

      for (const item of cart.items) {
        await this.lineItemService_
          .withTransaction(manager)
          .update(item.id, { order_id: result.id })
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.PLACED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Adds a shipment to the order to indicate that an order has left the
   * warehouse. Will ask the fulfillment provider for any documents that may
   * have been created in regards to the shipment.
   * @param {string} orderId - the id of the order that has been shipped
   * @param {string} fulfillmentId - the fulfillment that has now been shipped
   * @param {TrackingLink[]} trackingLinks - array of tracking numebers
   *   associated with the shipment
   * @param {Dictionary<String, String>} metadata - optional metadata to add to
   *   the fulfillment
   * @return {order} the resulting order following the update.
   */
  async createShipment(orderId, fulfillmentId, trackingLinks, metadata = {}) {
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId, { relations: ["items"] })
      const shipment = await this.fulfillmentService_.retrieve(fulfillmentId)

      if (!shipment || shipment.order_id !== orderId) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          "Could not find fulfillment"
        )
      }

      const shipmentRes = await this.fulfillmentService_
        .withTransaction(manager)
        .createShipment(fulfillmentId, trackingLinks, metadata)

      order.fulfillment_status = "shipped"
      for (const item of order.items) {
        const shipped = shipmentRes.items.find(si => si.item_id === item.id)
        if (shipped) {
          const shippedQty = (item.shipped_quantity || 0) + shipped.quantity
          if (shippedQty !== item.quantity) {
            order.fulfillment_status = "partially_shipped"
          }

          await this.lineItemService_.withTransaction(manager).update(item.id, {
            shipped_quantity: shippedQty,
          })
        } else {
          if (item.shipped_quantity !== item.quantity) {
            order.fulfillment_status = "partially_shipped"
          }
        }
      }

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      const result = await orderRepo.save(order)

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.SHIPMENT_CREATED, {
          id: orderId,
          fulfillment_id: shipmentRes.id,
        })

      return result
    })
  }

  /**
   * Creates an order
   * @param {object} order - the order to create
   * @return {Promise} resolves to the creation result.
   */
  async create(data) {
    return this.atomicPhase_(async manager => {
      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      const order = orderRepo.create(data)
      const result = await orderRepo.save(order)
      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.PLACED, {
          id: result.id,
        })
      return result
    })
  }

  /**
   * Updates the order's billing address.
   * @param {string} orderId - the id of the order to update
   * @param {object} address - the value to set the billing address to
   * @return {Promise} the result of the update operation
   */
  async updateBillingAddress_(order, address) {
    const addrRepo = this.manager_.getCustomRepository(this.addressRepository_)
    address.country_code = address.country_code.toLowerCase()

    const region = await this.regionService_.retrieve(order.region_id, {
      relations: ["countries"],
    })

    if (!region.countries.find(({ iso_2 }) => address.country_code === iso_2)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping country must be in the order region"
      )
    }

    address.country_code = address.country_code.toLowerCase()

    if (order.billing_address_id) {
      const addr = await addrRepo.findOne({
        where: { id: order.billing_address_id },
      })

      await addrRepo.save({ ...addr, ...address })
    } else {
      const created = await addrRepo.create({ ...address })
      await addrRepo.save(created)
    }
  }

  /**
   * Updates the order's shipping address.
   * @param {string} orderId - the id of the order to update
   * @param {object} address - the value to set the shipping address to
   * @return {Promise} the result of the update operation
   */
  async updateShippingAddress_(order, address) {
    const addrRepo = this.manager_.getCustomRepository(this.addressRepository_)
    address.country_code = address.country_code.toLowerCase()

    const region = await this.regionService_.retrieve(order.region_id, {
      relations: ["countries"],
    })

    if (!region.countries.find(({ iso_2 }) => address.country_code === iso_2)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping country must be in the order region"
      )
    }

    if (order.shipping_address_id) {
      const addr = await addrRepo.findOne({
        where: { id: order.shipping_address_id },
      })

      await addrRepo.save({ ...addr, ...address })
    } else {
      const created = await addrRepo.create({ ...address })
      await addrRepo.save(created)
    }
  }

  async addShippingMethod(orderId, optionId, data, config = {}) {
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId, {
        select: ["subtotal"],
        relations: [
          "shipping_methods",
          "shipping_methods.shipping_option",
          "items",
          "items.variant",
          "items.variant.product",
        ],
      })
      const { shipping_methods } = order

      const newMethod = await this.shippingOptionService_
        .withTransaction(manager)
        .createShippingMethod(optionId, data, { order, ...config })

      const methods = [newMethod]
      if (shipping_methods.length) {
        for (const sm of shipping_methods) {
          if (
            sm.shipping_option.profile_id ===
            newMethod.shipping_option.profile_id
          ) {
            await this.shippingOptionService_
              .withTransaction(manager)
              .deleteShippingMethod(sm)
          } else {
            methods.push(sm)
          }
        }
      }

      const result = await this.retrieve(orderId)
      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.UPDATED, { id: result.id })
      return result
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
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId)

      if (
        (update.payment || update.items) &&
        (order.fulfillment_status !== "not_fulfilled" ||
          order.payment_status !== "awaiting" ||
          order.status !== "pending")
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't update shipping, billing, items and payment method when order is processed"
        )
      }

      if (update.status || update.fulfillment_status || update.payment_status) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't update order statuses. This will happen automatically. Use metadata in order for additional statuses"
        )
      }

      const {
        metadata,
        items,
        billing_address,
        shipping_address,
        ...rest
      } = update

      if ("metadata" in update) {
        order.metadata = this.setMetadata_(order, update.metadata)
      }

      if ("shipping_address" in update) {
        await this.updateShippingAddress_(order, update.shipping_address)
      }

      if ("billing_address" in update) {
        await this.updateBillingAddress_(order, update.billing_address)
      }

      if ("items" in update) {
        for (const item of update.items) {
          await this.lineItemService_.withTransaction(manager).create({
            ...item,
            order_id: orderId,
          })
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        order[key] = value
      }

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      const result = await orderRepo.save(order)

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.UPDATED, {
          id: orderId,
        })
      return result
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
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId, {
        relations: ["fulfillments", "payments"],
      })

      if (order.payment_status !== "awaiting") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't cancel an order with a processed payment"
        )
      }

      await Promise.all(
        order.fulfillments.map(fulfillment =>
          this.fulfillmentService_
            .withTransaction(manager)
            .cancelFulfillment(fulfillment)
        )
      )

      for (const p of order.payments) {
        await this.paymentProviderService_
          .withTransaction(manager)
          .cancelPayment(p)
      }

      order.status = "canceled"
      order.fulfillment_status = "canceled"
      order.payment_status = "canceled"

      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      const result = await orderRepo.save(order)

      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.CANCELED, {
          id: order.id,
        })
      return result
    })
  }

  /**
   * Captures payment for an order.
   * @param {string} orderId - id of order to capture payment for.
   * @return {Promise} result of the update operation.
   */
  async capturePayment(orderId) {
    return this.atomicPhase_(async manager => {
      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      const order = await this.retrieve(orderId, { relations: ["payments"] })

      const payments = []
      for (const p of order.payments) {
        if (p.captured_at === null) {
          const result = await this.paymentProviderService_
            .withTransaction(manager)
            .capturePayment(p)
            .catch(err => {
              this.eventBus_
                .withTransaction(manager)
                .emit(OrderService.Events.PAYMENT_CAPTURE_FAILED, {
                  id: orderId,
                  payment_id: p.id,
                  error: err,
                })
            })

          if (result) {
            payments.push(result)
          } else {
            payments.push(p)
          }
        } else {
          payments.push(p)
        }
      }

      order.payments = payments
      order.payment_status = payments.every(p => p.captured_at !== null)
        ? "captured"
        : "requires_action"

      const result = await orderRepo.save(order)

      if (order.payment_status === "captured") {
        this.eventBus_
          .withTransaction(manager)
          .emit(OrderService.Events.PAYMENT_CAPTURED, {
            id: result.id,
          })
      }

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
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId, {
        select: [
          "subtotal",
          "shipping_total",
          "discount_total",
          "tax_total",
          "gift_card_total",
          "total",
        ],
        relations: [
          "discounts",
          "region",
          "fulfillments",
          "shipping_address",
          "billing_address",
          "shipping_methods",
          "shipping_methods.shipping_option",
          "items",
          "items.variant",
          "items.variant.product",
          "payments",
        ],
      })

      if (!order.shipping_methods?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot fulfill an order that lacks shipping methods"
        )
      }

      const fulfillments = await this.fulfillmentService_
        .withTransaction(manager)
        .createFulfillment(order, itemsToFulfill, {
          metadata,
          order_id: orderId,
        })
      let successfullyFulfilled = []
      for (const f of fulfillments) {
        successfullyFulfilled = [...successfullyFulfilled, ...f.items]
      }

      order.fulfillment_status = "fulfilled"

      // Update all line items to reflect fulfillment
      for (const item of order.items) {
        const fulfillmentItem = successfullyFulfilled.find(
          f => item.id === f.item_id
        )

        if (fulfillmentItem) {
          const fulfilledQuantity =
            (item.fulfilled_quantity || 0) + fulfillmentItem.quantity

          // Update the fulfilled quantity
          await this.lineItemService_.withTransaction(manager).update(item.id, {
            fulfilled_quantity: fulfilledQuantity,
          })

          if (item.quantity !== fulfilledQuantity) {
            order.fulfillment_status = "partially_fulfilled"
          }
        } else {
          if (item.quantity !== item.fulfilled_quantity) {
            order.fulfillment_status = "partially_fulfilled"
          }
        }
      }

      const orderRepo = manager.getCustomRepository(this.orderRepository_)

      order.fulfillments = [...order.fulfillments, ...fulfillments]
      const result = await orderRepo.save(order)

      for (const fulfillment of fulfillments) {
        await this.eventBus_
          .withTransaction(manager)
          .emit(OrderService.Events.FULFILLMENT_CREATED, {
            id: orderId,
            fulfillment_id: fulfillment.id,
          })
      }

      return result
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
        const item = order.items.find(i => i.id.equals(item_id))
        return transformer(item, quantity)
      })
    )

    return toReturn.filter(i => !!i)
  }

  /**
   * Archives an order. It only alloved, if the order has been fulfilled
   * and payment has been captured.
   * @param {string} orderId - the order to archive
   * @return {Promise} the result of the update operation
   */
  async archive(orderId) {
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId)

      if (order.status !== ("completed" || "refunded")) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't archive an unprocessed order"
        )
      }

      order.status = "archived"
      const orderRepo = manager.getCustomRepository(this.orderRepository_)
      const result = await orderRepo.save(order)
      return result
    })
  }

  /**
   * Refunds a given amount back to the customer.
   */
  async createRefund(orderId, refundAmount, reason, note) {
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId, {
        select: ["refundable_amount", "total", "refunded_total"],
        relations: ["payments"],
      })

      if (refundAmount > order.refundable_amount) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot refund more than the original order amount"
        )
      }

      const refund = await this.paymentProviderService_
        .withTransaction(manager)
        .refundPayment(order.payments, refundAmount, reason, note)

      const result = await this.retrieve(orderId)
      this.eventBus_.emit(OrderService.Events.REFUND_CREATED, {
        id: result.id,
        refund_id: refund.id,
      })
      return result
    })
  }

  decorateTotals_(order, totalsFields = []) {
    if (totalsFields.includes("shipping_total")) {
      order.shipping_total = this.totalsService_.getShippingTotal(order)
    }
    if (totalsFields.includes("gift_card_total")) {
      order.gift_card_total = this.totalsService_.getGiftCardTotal(order)
    }
    if (totalsFields.includes("discount_total")) {
      order.discount_total = this.totalsService_.getDiscountTotal(order)
    }
    if (totalsFields.includes("tax_total")) {
      order.tax_total = this.totalsService_.getTaxTotal(order)
    }
    if (totalsFields.includes("subtotal")) {
      order.subtotal = this.totalsService_.getSubtotal(order)
    }
    if (totalsFields.includes("total")) {
      order.total = this.totalsService_.getTotal(order)
    }
    if (totalsFields.includes("refunded_total")) {
      order.refunded_total = this.totalsService_.getRefundedTotal(order)
    }
    if (totalsFields.includes("paid_total")) {
      order.paid_total = this.totalsService_.getPaidTotal(order)
    }
    if (totalsFields.includes("refundable_amount")) {
      const paid_total = this.totalsService_.getPaidTotal(order)
      const refunded_total = this.totalsService_.getRefundedTotal(order)
      order.refundable_amount = paid_total - refunded_total
    }

    if (totalsFields.includes("items.refundable")) {
      order.items = order.items.map(i => ({
        ...i,
        refundable: this.totalsService_.getLineItemRefund(order, {
          ...i,
          quantity: i.quantity - (i.returned_quantity || 0),
        }),
      }))
    }

    if (
      totalsFields.includes("swaps.additional_items.refundable") &&
      order.swaps &&
      order.swaps.length
    ) {
      for (const s of order.swaps) {
        s.additional_items = s.additional_items.map(i => ({
          ...i,
          refundable: this.totalsService_.getLineItemRefund(order, {
            ...i,
            quantity: i.quantity - (i.returned_quantity || 0),
          }),
        }))
      }
    }

    return order
  }

  /**
   * Handles receiving a return. This will create a
   * refund to the customer. If the returned items don't match the requested
   * items the return status will be updated to requires_action. This behaviour
   * is useful in sitautions where a custom refund amount is requested, but the
   * retuned items are not matching the requested items. Setting the
   * allowMismatch argument to true, will process the return, ignoring any
   * mismatches.
   * @param {string} orderId - the order to return.
   * @param {object} receivedReturn - the received return
   * @return {Promise} the result of the update operation
   */
  async registerReturnReceived(orderId, receivedReturn, customRefundAmount) {
    return this.atomicPhase_(async manager => {
      const order = await this.retrieve(orderId, {
        select: ["total", "refunded_total", "refundable_amount"],
        relations: ["items", "returns", "payments"],
      })

      if (!receivedReturn || receivedReturn.order_id !== orderId) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Received return does not exist`
        )
      }

      let refundAmount = customRefundAmount || receivedReturn.refund_amount

      const orderRepo = manager.getCustomRepository(this.orderRepository_)

      if (refundAmount > order.refundable_amount) {
        order.fulfillment_status = "requires_action"
        const result = await orderRepo.save(order)
        this.eventBus_
          .withTransaction(manager)
          .emit(OrderService.Events.RETURN_ACTION_REQUIRED, {
            id: result.id,
            return_id: receivedReturn.id,
          })
        return result
      }

      let isFullReturn = true
      for (const i of order.items) {
        if (i.returned_quantity !== i.quantity) {
          isFullReturn = false
        }
      }

      if (receivedReturn.refund_amount > 0) {
        const refund = await this.paymentProviderService_
          .withTransaction(manager)
          .refundPayment(order.payments, receivedReturn.refund_amount, "return")

        order.refunds = [...(order.refunds || []), refund]
      }

      if (isFullReturn) {
        order.fulfillment_status = "returned"
      } else {
        order.fulfillment_status = "partially_returned"
      }

      const result = await orderRepo.save(order)
      await this.eventBus_
        .withTransaction(manager)
        .emit(OrderService.Events.ITEMS_RETURNED, {
          id: order.id,
          return_id: receivedReturn.id,
        })
      return result
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
