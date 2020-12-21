import mongoose from "mongoose"
import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

import { currencies } from "../utils/currencies"

/**
 * Provides layer to manipulate store settings.
 * @implements BaseService
 */
class StoreService extends BaseService {
  constructor({
    manager,
    storeRepository,
    currencyRepository,
    eventBusService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {StoreRepository} */
    this.storeRepository_ = storeRepository

    /** @private @const {CurrencyRepository} */
    this.currencyRepository_ = currencyRepository

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
    const { value, error } = schema.validate(rawId.toString())
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
    return this.atomicPhase_(async manager => {
      const storeRepository = manager.getCustomRepository(this.storeRepository_)

      let store = await this.retrieve()

      if (!store) {
        const s = storeRepository.create()
        store = await storeRepository.save(s)
      }

      return store
    })
  }

  /**
   * Retrieve the store settings. There is always a maximum of one store.
   * @return {Promise<Store>} the customer document.
   */
  retrieve(relations = ["default_currency", "currencies"]) {
    const storeRepository = this.manager_.getCustomRepository(
      this.storeRepository_
    )
    return storeRepository.findOne({ relations })
  }

  getDefaultCurrency_(code) {
    const currencyObject = currencies[code.toUpperCase()]

    return {
      code: currencyObject.code.toLowerCase(),
      symbol: currencyObject.symbol,
      symbol_native: currencyObject.symbol_native,
      name: currencyObject.name,
    }
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
    return this.atomicPhase_(async manager => {
      const storeRepository = manager.getCustomRepository(this.storeRepository_)
      const currencyRepository = manager.getCustomRepository(
        this.currencyRepository_
      )

      const store = await this.retrieve()

      const {
        metadata,
        default_currency,
        default_currency_code,
        currencies: storeCurrencies,
        ...rest
      } = update

      if (metadata) {
        store.metadata = this.setMetadata_(store, metadata)
      }

      if (default_currency_code) {
        const curr = await currencyRepository.findOne({
          code: default_currency_code.toLowerCase(),
        })

        if (!curr) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Currency ${default_currency_code} not found`
          )
        }

        store.default_currency = curr
        store.default_currency_code = curr.code
      }

      if (storeCurrencies) {
        store.currencies = storeCurrencies.map(curr => {
          if (!currencies[curr.toUpperCase()]) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Invalid currency ${curr.code}`
            )
          }

          return this.getDefaultCurrency_(curr)
        })
      }

      console.log(store)

      for (const [key, value] of Object.entries(rest)) {
        store[key] = value
      }

      const result = storeRepository.save(store)
      return result
    })
  }

  /**
   * Add a currency to the store
   * @param {string} code - 3 character ISO currency code
   * @return {Promise} result after update
   */
  async addCurrency(code) {
    code = code.toLowerCase()
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
    code = code.toLowerCase()
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
