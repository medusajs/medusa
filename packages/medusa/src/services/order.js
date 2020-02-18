import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class OrderService extends BaseService {
  constructor({ orderModel, eventBusService }) {
    super()

    /** @private @const {OrderModel} */
    this.orderModel_ = orderModel

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
   * Creates an order
   * @param {object} order - the order to create
   * @return {Promise} resolves to the creation result.
   */
  create(order) {
    // const { email, billing_address, shipping_address } =
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
  update(orderId, update) {
    const validatedId = this.validateId_(orderId)

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
