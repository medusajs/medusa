import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class OrderService extends BaseService {
  constructor({
    orderModel,
    paymentProviderService,
    shippingProfileService,
    fulfillmentProviderService,
    lineItemService,
    totalsService,
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

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
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
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.orderModel_.find(selector)
  }

  /**
   * Creates an order
   * @param {object} order - the order to create
   * @return {Promise} resolves to the creation result.
   */
  async create(order) {
    return this.orderModel_.create(order).catch(err => {
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

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: { status: "cancelled" },
      }
    )
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

    await paymentProvider.capturePayment(data)

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: updateFields,
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
  async createFulfillment(orderId) {
    const order = await this.retrieve(orderId)

    if (order.fulfillment_status !== "not_fulfilled") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Order is already fulfilled"
      )
    }

    const { shipping_methods, items } = order

    // prepare update object
    const updateFields = { fulfillment_status: "fulfilled" }
    const completed = order.payment_status !== "awaiting"
    if (completed) {
      updateFields.status = "completed"
    }

    // partition order items to their dedicated shipping method
    order.shipping_methods = await this.partitionItems_(shipping_methods, items)

    await Promise.all(
      order.shipping_methods.map(method => {
        const provider = this.fulfillmentProviderService_.retrieveProvider(
          method.provider_id
        )
        provider.createOrder(method.data, method.items)
      })
    )

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: updateFields,
      }
    )
  }

  /**
   * Return either the entire or part of an order.
   * @param {string} orderId - the order to return.
   * @param {string[]} lineItems - the line items to return
   * @return {Promise} the result of the update operation
   */
  async return(orderId, lineItems) {
    const order = await this.retrieve(orderId)

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

    const amount = this.totalsService_.getRefundTotal(order, lineItems)
    await paymentProvider.refundPayment(data, amount)

    lineItems.map(item => {
      const returnedItem = order.items.find(({ _id }) => _id === item._id)
      if (returnedItem) {
        returnedItem.returned_quantity = item.quantity
      }
    })

    const fullReturn = order.items.every(
      item => item.quantity === item.returned_quantity
    )

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: {
          items: order.items,
          fulfillment_status: fullReturn ? "returned" : "partially_fulfilled",
        },
      }
    )
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
   * Decorates an order.
   * @param {Order} order - the order to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Order} return the decorated order.
   */
  async decorate(order, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(order, fields.concat(requiredFields))
    return decorated
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
  setMetadata(orderId, key, value) {
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
}

export default OrderService
