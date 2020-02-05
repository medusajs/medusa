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
   * Used to validate customer email.
   * @param {string} email - email to validate
   * @return {string} the validated email
   */
  validateEmail_(email) {
    const schema = Validator.string()
      .email()
      .required()
    const { value, error } = schema.validate(email)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The email is not valid"
      )
    }

    return value
  }

  validateBillingAddress_(address) {
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
   * Creates a customer with email and billing address
   * (if provided) being validated.
   * @param {object} customer - the customer to create
   * @return {Promise} the result of create
   */
  create(customer) {
    const { email, billing_address } = customer
    this.validateEmail_(email)
    if (billing_address) {
      this.validateBillingAddress_(billing_address)
    }
    this.customerModel_.create(customer).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Sets the email of a customer
   * @param {string} customerId - the id of the customer to update
   * @param {string} email - the email to add to customer
   * @return {Promise} the result of the update operation
   */
  async updateEmail(customerId, email) {
    const customer = await this.retrieve(customerId)
    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer with ${customerId} was not found`
      )
    }

    this.validateEmail_(email)

    return this.customerModel_.updateOne(
      {
        _id: customerId,
      },
      {
        $set: { email },
      }
    )
  }

  /**
   * Sets the billing address of a customer
   * @param {*} customerId - the customer to update address on
   * @param {*} address - the new address to replace the current one
   * @return {Promise} the result of the update operation
   */
  async updateBillingAddress(customerId, address) {
    const customer = await this.retrieve(customerId)
    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer with ${customerId} was not found`
      )
    }

    this.validateBillingAddress_(address)

    return this.customerModel_.updateOne(
      {
        _id: customerId,
      },
      {
        $set: { billing_address: address },
      }
    )
  }

  /**
   * Updates a customer. Metadata updates and address updates should
   * use dedicated methods, e.g. `setMetadata`, etc. The function
   * will throw errors if metadata updates and address updates are attempted.
   * @param {string} variantId - the id of the variant. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(customerId, update) {
    const customer = await this.retrieve(customerId)
    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer with ${customerId} was not found`
      )
    }

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    if (update.billing_address) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use updateBillingAddress to update billing address"
      )
    }

    return this.customerModel_
      .updateOne({ _id: customerId }, { $set: update }, { runValidators: true })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Deletes a customer from a given customer id.
   * @param {string} customerId - the id of the customer to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(customerId) {
    const customer = await this.retrieve(customerId)
    // Delete is idempotent, but we return a promise to allow then-chaining
    if (!customer) {
      return Promise.resolve()
    }

    return this.customerModel_.deleteOne({ _id: customer._id }).catch(err => {
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
