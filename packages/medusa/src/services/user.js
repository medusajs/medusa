import mongoose from "mongoose"
import _ from "lodash"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

/**
 * Provides layer to manipulate users.
 * @implements BaseService
 */
class UserService extends BaseService {
  constructor({ userModel, eventBusService }) {
    super()

    /** @private @const {UserModel} */
    this.userModel_ = userModel

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
   * Used to validate user email.
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

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  list(selector) {
    return this.userModel_.find(selector)
  }

  /**
   * Gets a user by id.
   * Throws in case of DB Error and if user was not found.
   * @param {string} userId - the id of the user to get.
   * @return {Promise<User>} the user document.
   */
  async retrieve(userId) {
    const validatedId = this.validateId_(userId)
    const user = await this.userModel_
      .findOne({ _id: validatedId })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })

    if (!user) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with ${userId} was not found`
      )
    }
    return user
  }
  /**
   * Creates a user with username being validated.
   * Fails if email is not a valid format.
   * @param {object} user - the user to create
   * @return {Promise} the result of create
   */
  create(user) {
    const validatedEmail = this.validateEmail_(user.email)
    user.email = validatedEmail
    return this.userModel_.create(user).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Deletes a user from a given user id.
   * @param {string} userId - the id of the user to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(userId) {
    let user
    try {
      user = await this.retrieve(userId)
    } catch (error) {
      // delete is idempotent, but we return a promise to allow then-chaining
      return Promise.resolve()
    }

    return this.userModel_.deleteOne({ _id: user._id }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  /**
   * Sets a password for a user
   * Fails if no user exists with userId and if the hashing of the new
   * password does not work.
   * @param {string} userId - the userId to set password for
   * @param {string} password - the old password to set
   * @returns {Promise} the result of the update operation
   */
  async setPassword(userId, password) {
    const user = await this.retrieve(userId)

    const hashedPassword = await bcrypt.hash(password, 10)
    if (!hashedPassword) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `An error occured while hashing password`
      )
    }

    return this.userModel_.updateOne(
      { _id: user._id },
      { $set: { password_hash: hashedPassword } }
    )
  }

  /**
   * Generate a JSON Web token, that will be sent to a user, that wishes to
   * reset password.
   * The token will be signed with the users current password hash as a secret
   * a long side a payload with userId and the expiry time for the token, which
   * is always 15 minutes.
   * @param {User} user - the user to reset password for
   * @returns {string} the generated JSON web token
   */
  async generateResetPasswordToken(userId) {
    const user = await this.retrieve(userId)
    const secret = user.passwordHash
    const expiry = Math.floor(Date.now() / 1000) + 60 * 15
    const payload = { userId: user._id, exp: expiry }
    const token = jwt.sign(payload, secret)
    return token
  }

  /**
   * Decorates a user.
   * @param {User} user - the cart to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {User} return the decorated user.
   */
  async decorate(user, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(user, fields.concat(requiredFields))
    return decorated
  }

  /**
   * Dedicated method to set metadata for a user.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} userId - the user to apply metadata to.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  setMetadata(userId, key, value) {
    const validatedId = this.validateId_(userId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.userModel_
      .updateOne({ _id: validatedId }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default UserService
