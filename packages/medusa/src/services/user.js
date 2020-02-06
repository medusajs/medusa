import mongoose from "mongoose"
import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate users.
 * @implements BaseService
 */
class UserService extends BaseService {
  constructor({ userModel, customerService, eventBusService }) {
    super()

    /** @private @const {UserModel} */
    this.userModel_ = userModel

    /** @private @const {CustomerService} */
    this.customerService_ = customerService

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  /**
   * Used to validate user ids. Throws an error if the cast fails
   * @param {string} rawId - the raw user id to validate.
   * @return {string} the validated id
   */
  validateId_(rawId) {
    const schema = Validator.objectId()
    const { value, error } = schema.validate(rawId)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The userId could not be casted to an ObjectId"
      )
    }

    return value
  }

  /**
   * Used to validate user username.
   * A user's username is an email.
   * @param {string} username - username to validate
   * @return {string} the validated username
   */
  validateUsername_(username) {
    const schema = Validator.string()
      .email()
      .required()
    const { value, error } = schema.validate(username)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The username is not valid"
      )
    }

    return value
  }

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.userModel_.find(selector)
  }

  /**
   * Gets a user by id.
   * @param {string} userId - the id of the user to get.
   * @return {Promise<Product>} the user document.
   */
  retrieve(userId) {
    const validatedId = this.validateId_(userId)
    return this.userModel_.findOne({ _id: validatedId }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Creates a user with username being validated.
   * @param {object} user - the user to create
   * @return {Promise} the result of create
   */
  create(user) {
    // TODO: Try to first retrieve customer / admin / owner etc. by email
    const { username } = user
    this.validateUsername_(username)
    this.userModel_.create(customer).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }
}
