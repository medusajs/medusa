import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

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
    manager,
    swapRepository,
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

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {SwapModel} */
    this.swapRepository_ = swapRepository

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
   * Retrieves a swap with the given id.
   * @param {string} id - the id of the swap to retrieve
   * @return {Promise<Swap>} the swap
   */
  async retrieve(id, relations = []) {
    const swapRepo = this.manager_.getCustomRepository(this.swapRepository_)

    const validatedId = this.validateId_(id)

    const swap = await swapRepo.findOne({
      where: {
        id: validatedId,
      },
      relations,
    })

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
  async retrieveByCartId(cartId, relations = []) {
    const swapRepo = this.manager_.getCustomRepository(this.swapRepository_)

    const swap = await swapRepo.findOne({
      where: {
        cart_id: cartId,
      },
      relations,
    })

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
      const item = order.items.find(i => i.id === item_id)

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
    return this.atomicPhase_(async manager => {
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

      const returnOrder = await this.returnService_.create(
        {
          items: returnItems,
          shipping_method: returnShipping,
        },
        order
      )

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      const created = swapRepo.create({
        order_id: order.id,
        return_order: returnOrder,
        additional_items: newItems,
      })

      const result = await swapRepo.save(created)
      return result
    })
  }

  async processDifference(swapId) {
    return this.atomicPhase_(async manager => {
      const swap = await this.retrieve(swapId, [
        "payment",
        "order",
        "order.payments",
      ])

      if (!swap.confirmed_at) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot process a swap that hasn't been confirmed by the customer"
        )
      }

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      if (swap.difference_due < 0) {
        try {
          await this.paymentProviderService_
            .withTransaction(manager)
            .refundPayment(swap.order.payments, -1 * swap.difference_due)
        } catch (err) {
          swap.payment_status = "requires_action"
          const result = await swapRepo.save(swap)
          await this.eventBus_
            .withTransaction(manager)
            .emit(SwapService.Events.PROCESS_REFUND_FAILED, result)
          return result
        }

        swap.payment_status = "difference_refunded"

        const result = await swapRepo.save(swap)
        await this.eventBus_
          .withTransaction(manager)
          .emit(SwapService.Events.REFUND_PROCESSED, result)
        return result
      } else if (swap.difference_due === 0) {
        swap.payment_status = "difference_refunded"

        const result = await swapRepo.save(swap)
        await this.eventBus_
          .withTransaction(manager)
          .emit(SwapService.Events.REFUND_PROCESSED, result)
        return result
      }

      try {
        await this.paymentProviderService_
          .withTransaction(manager)
          .capturePayment(swap.payment)
      } catch (err) {
        swap.payment_status = "requires_action"
        const result = await swapRepo.save(swap)
        await this.eventBus_
          .withTransaction(manager)
          .emit(SwapService.Events.PAYMENT_CAPTURE_FAILED, result)
        return result
      }

      swap.payment_status = "captured"

      const result = await swapRepo.save(swap)
      await this.eventBus_
        .withTransaction(manager)
        .emit(SwapService.Events.PAYMENT_CAPTURED, result)
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
  async createCart(swapId) {
    return this.atomicPhase_(async manager => {
      const swap = await this.retrieve(swapId, [
        "order",
        "return_order",
        "return_order.items",
        "return_order.shipping_method",
      ])

      if (swap.cart_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A cart has already been created for the swap"
        )
      }

      const order = swap.order

      // Add return lines to the cart to ensure that the total calculation is
      // correct.
      const returnLines = await Promise.all(
        swap.return_order.items.map(r => {
          const lineItem = order.items.find(i => i.id === r.item_id)

          const toCreate = {
            variant_id: lineItem.variant_id,
            unit_price: -1 * lineItem.unit_price,
            quantity: r.quantity,
            metadata: {
              ...lineItem.metadata,
              is_return_line: true,
            },
          }

          return this.lineItemService_.withTransaction(manager).create(toCreate)
        })
      )

      // If the swap has a return shipping method the price has to be added to the
      // cart.
      if (swap.return && swap.return_order.shipping_method) {
        const shippingLine = await this.lineItemService_
          .withTransaction(manager)
          .create({
            title: "Return shipping",
            quantity: 1,
            has_shipping: true,
            allow_discount: false,
            unit_price: swap.return_order.shipping_method.price,
            metadata: {
              is_return_line: true,
            },
          })
        returnLines.push(shippingLine)
      }

      const cart = await this.cartService_.withTransaction(manager).create({
        discounts: order.discounts,
        email: order.email,
        billing_address: order.billing_address,
        shipping_address: order.shipping_address,
        items: [...returnLines, ...swap.additional_items],
        region_id: order.region_id,
        customer_id: order.customer_id,
        is_swap: true,
        metadata: {
          swap_id: swap.id,
          parent_order_id: order.id,
        },
      })

      swap.cart_id = cart.id

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      const result = await swapRepo.save(swap)
      return result
    })
  }

  /**
   *
   */
  async registerCartCompletion(swapId) {
    return this.atomicPhase_(async manager => {
      const swap = await this.retrieve(swapId, [
        "cart",
        "cart.items",
        "cart.discounts",
        "cart.payment",
      ])

      // If we already registered the cart completion we just return
      if (swap.confirmed_at) {
        return swap
      }

      const cart = swap.cart

      const total = await this.totalsService_.getTotal(cart)

      if (total > 0) {
        const { payment } = cart

        if (!payment) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Cart does not contain a payment"
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

        swap.payment = payment
      }

      swap.difference_due = total
      swap.shipping_address_id = cart.shipping_address_id
      swap.shipping_methods = cart.shipping_methods
      swap.confirmed_at = Date.now()

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      const result = await swapRepo.save(swap)

      this.eventBus_
        .withTransaction(manager)
        .emit(SwapService.Events.PAYMENT_COMPLETED, {
          swap: result,
        })

      return result
    })
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
  async receiveReturn(swapId, returnItems) {
    return this.atomicPhase_(async manager => {
      const swap = await this.retrieve(swapId)

      const returnId = swap.return_id
      if (!returnId) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Swap has no return request"
        )
      }

      const updatedRet = await this.returnService_
        .withTransaction(manager)
        .receiveReturn(swap.return_id, returnItems, undefined, false)

      if (updatedRet.status === "requires_action") {
        const swapRepo = manager.getCustomRepository(this.swapRepository_)
        swap.fulfillment_status = "requires_action"
        const result = await swapRepo.save(swap)
        return result
      }

      return this.retrieve(swapId)
    })
  }

  /**
   * Fulfills the addtional items associated with the swap. Will call the
   * fulfillment providers associated with the shipping methods.
   * @param {string} swapId - the id of the swap to fulfill,
   * @param {object} metadata - optional metadata to attach to the fulfillment.
   * @returns {Promise<Swap>} the updated swap with new status and fulfillments.
   */
  async createFulfillment(swapId, metadata = {}) {
    return this.atomicPhase_(async manager => {
      const swap = await this.retrieve(swapId, [
        "shipping_address",
        "additional_items",
        "shipping_methods",
        "order",
        "order.billing_address",
        "order.discounts",
      ])
      const order = swap.order

      swap.fulfillments = await this.fulfillmentService_
        .withTransaction(manager)
        .createFulfillment(
          {
            ...swap,
            email: order.email,
            discounts: order.discounts,
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
            item_id: i.id,
            quantity: i.quantity,
          })),
          metadata
        )

      swap.fulfillment_status = "fulfilled"

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      const result = await swapRepo.save(swap)
      return result
    })
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
    return this.atomicPhase_(async manager => {
      const swap = await this.retrieve(swapId, ["additional_items"])

      // Update the fulfillment to register
      const shipment = await this.fulfillmentService_
        .withTransaction(manager)
        .createShipment(fulfillmentId, trackingNumbers, metadata)

      swap.fulfillment_status = "shipped"

      // Go through all the additional items in the swap
      for (const i of swap.additional_items) {
        const shipped = shipment.items.find(si => si.item_id === i.id)
        if (shipped) {
          const shippedQty = (i.shipped_quantity || 0) + shipped.quantity
          await this.lineItemService_.withTransaction(manager).update(i.id, {
            shipped_quantity: shippedQty,
          })

          if (shippedQty !== i.quantity) {
            swap.fulfillment_status = "partially_shipped"
          }
        } else {
          if (i.shipped_quantity !== i.quantity) {
            swap.fulfillment_status = "partially_shipped"
          }
        }
      }

      const swapRepo = manager.getCustomRepository(this.swapRepository_)
      const result = await swapRepo.save(swap)
      await this.eventBus_
        .withTransaction(manager)
        .emit(SwapService.Events.SHIPMENT_CREATED, {
          swap_id: swapId,
          shipment,
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
