import mongoose from "mongoose"
import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate customers.
 * @implements BaseService
 */
class CustomerService extends BaseService {
  constructor({ customerModel, eventBusService }) {
    super()

    /** @private @const {CustomerModel} */
    this.customerModel_ = customerModel

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  /**
   * Used to validate customer ids. Throws an error if the cast fails
   * @param {string} rawId - the raw customer id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The customerId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.customerModel_.find(selector)
  }

  /**
   * Gets a customer by id.
   * @param {string} customerId - the id of the customer to get.
   * @return {Promise<Customer>} the customer document.
   */
  retrieve(customerId) {
    const validatedId = this.validateId_(customerId)
    return this.customerModel_.findOne({ _id: validatedId }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Decorates a customer.
   * @param {Customer} customer - the cart to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Customer} return the decorated customer.
   */
  async decorate(customer, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(customer, fields.concat(requiredFields))
    return decorated
  }

  /**
   * Dedicated method to set metadata for a customer.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} customerId - the customer to apply metadata to.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  setMetadata(customerId, key, value) {
    const validatedId = this.validateId_(customerId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.customerModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default CustomerService
