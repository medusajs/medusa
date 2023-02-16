import { MedusaError } from "medusa-core-utils"
import { EntityManager, IsNull, Not } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { Currency, Store } from "../models"
import { CurrencyRepository } from "../repositories/currency"
import { StoreRepository } from "../repositories/store"
import { FindConfig } from "../types/common"
import { UpdateStoreInput } from "../types/store"
import { buildQuery, setMetadata } from "../utils"
import { currencies } from "../utils/currencies"
import EventBusService from "./event-bus"

type InjectedDependencies = {
  manager: EntityManager
  storeRepository: typeof StoreRepository
  currencyRepository: typeof CurrencyRepository
  eventBusService: EventBusService
}

/**
 * Provides layer to manipulate store settings.
 */
class StoreService extends TransactionBaseService {
  protected readonly storeRepository_: typeof StoreRepository
  protected readonly currencyRepository_: typeof CurrencyRepository
  protected readonly eventBus_: EventBusService

  constructor({
    storeRepository,
    currencyRepository,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.storeRepository_ = storeRepository
    this.currencyRepository_ = currencyRepository
    this.eventBus_ = eventBusService
  }

  /**
   * Creates a store if it doesn't already exist.
   * @return The store.
   */
  async create(): Promise<Store> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const storeRepository = transactionManager.withRepository(
          this.storeRepository_
        )
        const currencyRepository = transactionManager.withRepository(
          this.currencyRepository_
        )

        let store = await this.retrieve().catch(() => void 0)
        if (store) {
          return store
        }

        const newStore = storeRepository.create()
        // Add default currency (USD) to store currencies
        const usd = await currencyRepository.findOne({
          where: {
            code: "usd",
          },
        })

        if (usd) {
          newStore.currencies = [usd]
        }

        store = await storeRepository.save(newStore)
        return store
      }
    )
  }

  /**
   * Retrieve the store settings. There is always a maximum of one store.
   * @param config The config object from which the query will be built
   * @return the store
   */
  async retrieve(config: FindConfig<Store> = {}): Promise<Store> {
    const storeRepo = this.activeManager_.withRepository(this.storeRepository_)
    const query = buildQuery(
      {
        id: Not(IsNull()),
      },
      config
    )
    const store = await storeRepo.findOne(query)

    if (!store) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store does not exist")
    }

    return store
  }

  protected getDefaultCurrency_(code: string): Partial<Currency> {
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
   * @param data - an object with the update values.
   * @return resolves to the update result.
   */
  async update(data: UpdateStoreInput): Promise<Store> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const storeRepository = transactionManager.withRepository(
          this.storeRepository_
        )
        const currencyRepository = transactionManager.withRepository(
          this.currencyRepository_
        )

        const {
          metadata,
          default_currency_code,
          currencies: storeCurrencies,
          ...rest
        } = data

        const store = await this.retrieve({ relations: ["currencies"] })

        if (metadata) {
          store.metadata = setMetadata(store, metadata)
        }

        if (storeCurrencies) {
          const defaultCurr =
            default_currency_code ?? store.default_currency_code
          const hasDefCurrency = storeCurrencies.find(
            (c) => c.toLowerCase() === defaultCurr.toLowerCase()
          )

          // throw if we are trying to remove a currency from store currently used as default
          if (!hasDefCurrency) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `You are not allowed to remove default currency from store currencies without replacing it as well`
            )
          }

          store.currencies = await Promise.all(
            storeCurrencies.map(async (curr) => {
              const currency = await currencyRepository.findOne({
                where: { code: curr.toLowerCase() },
              })

              if (!currency) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  `Currency with code ${curr} does not exist`
                )
              }

              return currency
            })
          )
        }

        if (default_currency_code) {
          const hasDefCurrency = store.currencies.find(
            (c) => c.code.toLowerCase() === default_currency_code.toLowerCase()
          )

          if (!hasDefCurrency) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Store does not have currency: ${default_currency_code}`
            )
          }

          const curr = (await currencyRepository.findOne({
            where: {
              code: default_currency_code.toLowerCase(),
            },
          })) as Currency

          store.default_currency = curr
          store.default_currency_code = curr.code
        }

        for (const [key, value] of Object.entries(rest)) {
          store[key] = value
        }

        return await storeRepository.save(store)
      }
    )
  }

  /**
   * Add a currency to the store
   * @param code - 3 character ISO currency code
   * @return result after update
   */
  async addCurrency(code: string): Promise<Store | never> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const storeRepo = transactionManager.withRepository(
          this.storeRepository_
        )
        const currencyRepository = transactionManager.withRepository(
          this.currencyRepository_
        )

        const curr = await currencyRepository.findOne({
          where: { code: code.toLowerCase() },
        })

        if (!curr) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Currency ${code} not found`
          )
        }

        const store = await this.retrieve({ relations: ["currencies"] })

        const doesStoreInclCurrency = store.currencies
          .map((c) => c.code.toLowerCase())
          .includes(curr.code.toLowerCase())
        if (doesStoreInclCurrency) {
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            `Currency already added`
          )
        }

        store.currencies = [...store.currencies, curr]
        return await storeRepo.save(store)
      }
    )
  }

  /**
   * Removes a currency from the store
   * @param code - 3 character ISO currency code
   * @return result after update
   */
  async removeCurrency(code: string): Promise<any> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const storeRepo = transactionManager.withRepository(
          this.storeRepository_
        )
        const store = await this.retrieve({ relations: ["currencies"] })
        const doesCurrencyExists = store.currencies.some(
          (c) => c.code === code.toLowerCase()
        )
        if (!doesCurrencyExists) {
          return store
        }

        store.currencies = store.currencies.filter((c) => c.code !== code)
        return await storeRepo.save(store)
      }
    )
  }
}

export default StoreService
