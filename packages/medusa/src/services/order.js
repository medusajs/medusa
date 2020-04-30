import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class OrderService extends BaseService {
  constructor({
    orderModel,
    paymentProviderService,
    shippingProfileService,
    fulfillmentProviderService,
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
    const { value, error } = schema.validate(rawId)
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
    const validatedId = this.validateId_(orderId)

    const order = await this.retrieve(orderId)

    // List of BAD update operations
    // Shipping: fulfilled, partially_fulfilled, returned
    // Billing: fulfilled, partially_fulfilled, returned, captured, refunded
    // Status: not_fulfilled
    // Payment method: captured, completed, archived, cancelled, refunded, fulfilled, partially_fulfilled, returned
    // Items: captured, completed, archived, refunded, cancelled

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    return this.orderModel_
      .updateOne(
        { _id: validatedId },
        { $set: update },
        { runValidators: true }
      )
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Updates an order's billing address.
   * @param {string} orderId - the id of the order to update
   * @param {object} address - the value to set the billing address to
   * @return {Promise} the result of the update operation
   */
  async updateBillingAddress(orderId, address) {
    const order = await this.retrieve(orderId)
    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "The order was not found"
      )
    }

    const validatedAddress = this.validateAddress_(address)

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: { billing_address: validatedAddress },
      }
    )
  }

  /**
   * Updates the order's shipping address.
   * @param {string} orderId - the id of the order to update
   * @param {object} address - the value to set the shipping address to
   * @return {Promise} the result of the update operation
   */
  async updateShippingAddress(orderId, address) {
    const order = await this.retrieve(orderId)
    if (!order) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "The order was not found"
      )
    }

    const validatedAddress = this.validateAddress_(address)

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: { shipping_address: validatedAddress },
      }
    )
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

    const providerId = order.payment_method.provider_id
    const paymentProvider = await this.paymentProviderService_.retrieveProvider(
      providerId
    )

    await paymentProvider.capturePayment(order)

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: { payment_status: "captured" },
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

    const { shipping_methods } = order

    // if only one shipping method is attached to the order, we simply create
    // the order for the single provider given in the method
    if (shipping_methods.length === 1) {
      const fulfillmentProviderId = shipping_methods[0].provider_id
      const fulfillmentProvider = this.fulfillmentProviderService_.retrieveProvider(
        fulfillmentProviderId
      )

      order.shipping_methods[0].items = order.items

      await fulfillmentProvider.createOrder(order.items)

      return this.orderModel_.updateOne(
        {
          _id: orderId,
        },
        {
          $set: { fulfillment_status: "fulfilled" },
        }
      )
    }

    // partition order items to their dedicated shipping method
    await Promise.all(
      shipping_methods.map(async method => {
        const { profile_id } = method
        const profile = await this.shippingProfileService_.retrieve(profile_id)
        // for each method find the items in the order, that are associated
        // with the profile on the current shipping method
        method.items = order.items.filter(({ content }) => {
          if (Array.isArray(content)) {
            // we require bundles to have same shipping method, therefore:
            return profile.products.includes(content[0].product._id)
          } else {
            return profile.products.includes(content.product._id)
          }
        })
      })
    )

    await Promise.all(
      shipping_methods.map(method => {
        const provider = this.fulfillmentProviderService_.retrieveProvider(
          method.provider_id
        )
        provider.createOrder(method.items)
      })
    )

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: { fulfillment_status: "fulfilled" },
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

    const { provider_id } = order.payment_method
    const paymentProvider = this.paymentProviderService_.retrieveProvider(
      provider_id
    )

    order.items.forEach(item => {
      if (lineItems.includes(item._id)) {
        item.returned = true
      }
    })

    return this.orderModel_.updateOne(
      {
        _id: orderId,
      },
      {
        $set: { fulfillment_status: "fulfilled" },
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
