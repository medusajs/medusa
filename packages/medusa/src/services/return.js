import _ from "lodash"
import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

/**
 * Handles Returns
 * @implements BaseService
 */
class ReturnService extends BaseService {
  constructor({
    manager,
    totalsService,
    returnRepository,
    shippingOptionService,
    fulfillmentProviderService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {TotalsService} */
    this.totalsService_ = totalsService

    /** @private @const {ReturnRepository} */
    this.returnRepository_ = returnRepository

    /** @private @const {ShippingOptionService} */
    this.shippingOptionService_ = shippingOptionService

    /** @private @const {FulfillmentProviderService} */
    this.fulfillmentProviderService_ = fulfillmentProviderService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ReturnService({
      manager: transactionManager,
      totalsService: this.totalsService_,
      returnRepository: this.returnRepository_,
      shippingOptionService: this.shippingOptionService_,
      fulfillmentProviderService: this.fulfillmentProviderService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
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
        const item = order.items.find(i => i.id === item_id)
        return transformer(item, quantity)
      })
    )

    return toReturn.filter(i => !!i)
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
   * Retrieves a return by its id.
   * @param {string} id - the id of the return to retrieve
   * @return {Return} the return
   */
  async retrieve(id, relations = []) {
    const returnRepository = this.manager_.getCustomRepository(
      this.returnRepository_
    )

    const validatedId = this.validateId_(id)

    const returnObj = await returnRepository.findOne({
      where: {
        id: validatedId,
      },
      relations,
    })

    if (!returnObj) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Return with id: ${id} was not found`
      )
    }
    return returnObj
  }

  /**
   * Creates a return request for an order, with given items, and a shipping
   * method. If no refundAmount is provided the refund amount is calculated from
   * the return lines and the shipping cost.
   * @param {String} orderId - the id of the order to create a return for.
   * @param {Array<{item_id: String, quantity: Int}>} returnItems - the line items to
   *   return
   * @param {ShippingMethod?} shippingMethod - the shipping method used for the
   *   return
   * @param {Number?} refundAmount - the amount to refund when the return is
   *   received.
   * @returns {Promise<Return>} the resulting order.
   */
  async requestReturn(order, returnItems, shippingMethod, refundAmount) {
    return this.atomicPhase_(async manager => {
      const returnRepository = manager.getCustomRepository(
        this.returnRepository_
      )

      // Throws if the order doesn't have the necessary status for return
      this.validateReturnStatuses_(order)

      const returnLines = await this.getFulfillmentItems_(
        order,
        returnItems,
        this.validateReturnLineItem_
      )

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

      let returnFulfillmentData = {}
      let returnShippingMethod = {}

      if (typeof shippingMethod !== "undefined") {
        returnShippingMethod = shippingMethod

        returnFulfillmentData = await this.fulfillmentProviderService_.createReturn(
          returnShippingMethod,
          returnLines,
          order
        )

        if (typeof shippingMethod.price !== "undefined") {
          returnShippingMethod.amount = shippingMethod.price
        } else {
          returnShippingMethod.amount = await this.shippingOptionService_
            .withTransaction(manager)
            .getPrice(returnShippingMethod, {
              ...order,
              items: returnLines,
            })
        }

        toRefund = Math.max(
          0,
          toRefund - returnShippingMethod.amount * (1 + order.tax_rate)
        )
      }

      const returnObject = {
        status: "requested",
        items: [],
        order_id: order.id,
        shipping_method: returnShippingMethod,
        shipping_data: returnFulfillmentData,
        refund_amount: toRefund,
      }

      const created = await returnRepository.create(returnObject)

      const items = returnLines.map(i => ({
        return_id: created.id,
        item_id: i.id,
        requested_quantity: i.quantity,
        metadata: i.metadata,
      }))

      created.items = items

      const result = await returnRepository.save(created)
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
  async receiveReturn(
    returnId,
    receivedItems,
    refundAmount,
    allowMismatch = false
  ) {
    return this.atomicPhase_(async manager => {
      const returnRepository = manager.getCustomRepository(
        this.returnRepository_
      )

      const returnObj = await this.retrieve(returnId, [
        "items",
        "order",
        "order.items",
      ])

      if (returnObj.status === "received") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Return with id ${returnId} has already been received`
        )
      }

      const returnLines = await this.getFulfillmentItems_(
        returnObj.order,
        receivedItems,
        this.validateReturnLineItem_
      )

      const newLines = returnLines.map(l => {
        const existing = returnObj.items.find(i => l.id === i.item_id)
        if (existing) {
          return {
            ...existing,
            quantity: l.quantity,
            requested_quantity: existing.quantity,
            received_quantity: l.quantity,
            is_requested: l.quantity === existing.quantity,
          }
        } else {
          return {
            return_id: returnObj.id,
            item_id: l.id,
            quantity: l.quantity,
            is_requested: false,
            received_quantity: l.quantity,
            metadata: l.metadata || {},
          }
        }
      })

      let returnStatus = "received"

      const isMatching = newLines.every(l => l.is_requested)
      if (!isMatching && !allowMismatch) {
        // Should update status
        returnStatus = "requires_action"
      }

      const toRefund = refundAmount || returnObj.refund_amount
      const total = await this.totalsService_.getTotal(returnObj.order)
      const refunded = await this.totalsService_.getRefundedTotal(
        returnObj.order
      )

      if (toRefund > total - refunded) {
        returnStatus = "requires_action"
      }

      const updateObj = {
        ...returnObj,
        status: returnStatus,
        items: newLines,
        refund_amount: toRefund,
        received_at: Date.now(),
      }

      const result = await returnRepository.save(updateObj)
      return result
    })
  }
}

export default ReturnService
