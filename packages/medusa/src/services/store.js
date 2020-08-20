import mongoose from "mongoose"
import bcrypt from "bcrypt"
import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

import { currencies } from "../utils/currencies"

/**
 * Provides layer to manipulate store settings.
 * @implements BaseService
 */
class StoreService extends BaseService {
  constructor({ storeModel, eventBusService }) {
    super()

    /** @private @const {storeModel} */
    this.storeModel_ = storeModel

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
   * Creates a store if it doesn't already exist.
   * @return {Promise<Store>} the store.
   */
  async create() {
    const store = await this.retrieve()
    if (!store) {
      return this.storeModel_.create({})
    }

    return store
  }

  /**
   * Retrieve the store settings. There is always a maximum of one store.
   * @return {Promise<Store>} the customer document.
   */
  retrieve() {
    return this.storeModel_.findOne().catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
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
  async update(update) {
    const store = await this.retrieve()

    if (update.metadata) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Use setMetadata to update metadata fields"
      )
    }

    if (update.currencies) {
      update.currencies = update.currencies.map(c => c.toUpperCase())
      update.currencies.forEach(c => {
        if (!currencies[c]) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Invalid currency ${c}`
          )
        }
      })
    }

    return this.storeModel_
      .updateOne({ _id: store._id }, { $set: update }, { runValidators: true })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  /**
   * Add a currency to the store
   * @param {string} code - 3 character ISO currency code
   * @return {Promise} result after update
   */
  async addCurrency(code) {
    code = code.toUpperCase()
    const store = await this.retrieve()

    if (!currencies[code]) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid currency ${code}`
      )
    }

    if (store.currencies.includes(code)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Currency already added`
      )
    }

    return this.storeModel_.updateOne(
      {
        _id: store._id,
      },
      { $push: { currencies: code } }
    )
  }

  /**
   * Removes a currency from the store
   * @param {string} code - 3 character ISO currency code
   * @return {Promise} result after update
   */
  async removeCurrency(code) {
    const store = await this.retrieve()
    code = code.toUpperCase()
    return this.storeModel_.updateOne(
      {
        _id: store._id,
      },
      { $pull: { currencies: code } }
    )
  }

  /**
   * Decorates a store object.
   * @param {Store} store - the store to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Store} return the decorated Store.
   */
  async decorate(store, fields, expandFields = []) {
    return store
  }

  /**
   * Dedicated method to set metadata for a store.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param {string} customerId - the customer to apply metadata to.
   * @param {string} key - key for metadata field
   * @param {string} value - value for metadata field.
   * @return {Promise} resolves to the updated result.
   */
  async setMetadata(key, value) {
    const store = await this.retrieve()
    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.storeModel_
      .updateOne({ _id: store._id }, { $set: { [keyPath]: value } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default StoreService
