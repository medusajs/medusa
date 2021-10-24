import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

import { currencies } from "../utils/currencies"

/**
 * Provides layer to manipulate store settings.
 * @extends BaseService
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

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new StoreService({
      manager: transactionManager,
      storeRepository: this.storeRepository_,
      currencyRepository: this.currencyRepository_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Creates a store if it doesn't already exist.
   * @return {Promise<Store>} the store.
   */
  async create() {
    return this.atomicPhase_(async (manager) => {
      const storeRepository = manager.getCustomRepository(this.storeRepository_)

      let store = await this.retrieve()

      if (!store) {
        const s = await storeRepository.create()
        store = await storeRepository.save(s)
      }

      return store
    })
  }

  /**
   * Retrieve the store settings. There is always a maximum of one store.
   * @param {string[]} relations - relations to fetch with store
   * @return {Promise<Store>} the store
   */
  async retrieve(relations = []) {
    const storeRepo = this.manager_.getCustomRepository(this.storeRepository_)

    const store = await storeRepo.findOne({ relations })

    return store
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
   * Updates a store
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(update) {
    return this.atomicPhase_(async (manager) => {
      const storeRepository = manager.getCustomRepository(this.storeRepository_)
      const currencyRepository = manager.getCustomRepository(
        this.currencyRepository_
      )

      const store = await this.retrieve()

      const {
        metadata,
        default_currency_code,
        currencies: storeCurrencies,
        ...rest
      } = update

      if (metadata) {
        store.metadata = this.setMetadata_(store.id, metadata)
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
        store.currencies = await Promise.all(
          storeCurrencies.map(async (curr) => {
            const currency = await currencyRepository.findOne({
              where: { code: curr.toLowerCase() },
            })

            if (!currency) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Invalid currency ${curr}`
              )
            }

            return currency
          })
        )
      }

      for (const [key, value] of Object.entries(rest)) {
        store[key] = value
      }

      const result = await storeRepository.save(store)
      return result
    })
  }

  /**
   * Add a currency to the store
   * @param {string} code - 3 character ISO currency code
   * @return {Promise} result after update
   */
  async addCurrency(code) {
    return this.atomicPhase_(async (manager) => {
      const storeRepo = manager.getCustomRepository(this.storeRepository_)
      const currencyRepository = manager.getCustomRepository(
        this.currencyRepository_
      )
      const store = await this.retrieve(["currencies"])

      const curr = await currencyRepository.findOne({
        where: { code: code.toLowerCase() },
      })

      if (!curr) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Currency ${code} not found`
        )
      }

      if (
        store.currencies.map((c) => c.code).includes(curr.code.toLowerCase())
      ) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `Currency already added`
        )
      }

      store.currencies = [...store.currencies, curr]
      const updated = await storeRepo.save(store)
      return updated
    })
  }

  /**
   * Removes a currency from the store
   * @param {string} code - 3 character ISO currency code
   * @return {Promise} result after update
   */
  async removeCurrency(code) {
    return this.atomicPhase_(async (manager) => {
      const storeRepo = manager.getCustomRepository(this.storeRepository_)
      const store = await this.retrieve(["currencies"])

      const exists = store.currencies.find((c) => c.code === code.toLowerCase())
      // If currency does not exist, return early
      if (!exists) {
        return store
      }

      store.currencies = store.currencies.filter((c) => c.code !== code)
      const updated = await storeRepo.save(store)
      return updated
    })
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
}

export default StoreService
