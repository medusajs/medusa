import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import TaxInclusivePricingFeatureFlag from "../loaders/feature-flags/tax-inclusive-pricing"
import { Currency } from "../models"
import { CurrencyRepository } from "../repositories/currency"
import { FindConfig, Selector } from "../types/common"
import { UpdateCurrencyInput } from "../types/currency"
import { buildQuery } from "../utils"
import { FlagRouter } from "../utils/flag-router"
import EventBusService from "./event-bus"

type InjectedDependencies = {
  manager: EntityManager
  currencyRepository: typeof CurrencyRepository
  eventBusService: EventBusService
  featureFlagRouter: FlagRouter
}

export default class CurrencyService extends TransactionBaseService {
  static readonly Events = {
    UPDATED: "currency.updated",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly currencyRepository_: typeof CurrencyRepository
  protected readonly eventBusService_: EventBusService
  protected readonly featureFlagRouter_: FlagRouter

  constructor({
    manager,
    currencyRepository,
    eventBusService,
    featureFlagRouter,
  }: InjectedDependencies) {
    super(arguments[0])
    this.manager_ = manager
    this.currencyRepository_ = currencyRepository
    this.eventBusService_ = eventBusService
    this.featureFlagRouter_ = featureFlagRouter
  }

  /**
   * Return the currency
   * @param code - The code of the currency that must be retrieve
   * @return The currency
   */
  async retrieveByCode(code: string): Promise<Currency | never> {
    const currencyRepo = this.manager_.getCustomRepository(
      this.currencyRepository_
    )

    code = code.toLowerCase()
    const currency = await currencyRepo.findOne({
      where: { code },
    })

    if (!currency) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Currency with code: ${code} was not found`
      )
    }

    return currency
  }

  /**
   * Lists currencies based on the provided parameters and includes the count of
   * currencies that match the query.
   * @param selector - an object that defines rules to filter currencies
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return an array containing the currencies as
   *   the first element and the total count of products that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: Selector<Currency>,
    config: FindConfig<Currency> = {
      skip: 0,
      take: 20,
    }
  ): Promise<[Currency[], number]> {
    const productRepo = this.manager_.getCustomRepository(
      this.currencyRepository_
    )

    const query = buildQuery(selector, config)

    return await productRepo.findAndCount(query)
  }

  /**
   * Update a currency
   * @param code - The code of the currency to update
   * @param data - The data that must be updated on the currency
   * @return The updated currency
   */
  async update(
    code: string,
    data: UpdateCurrencyInput
  ): Promise<Currency | undefined | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const currency = await this.retrieveByCode(code)

      if (
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        )
      ) {
        if (typeof data.includes_tax !== "undefined") {
          currency.includes_tax = data.includes_tax
        }
      }

      const currencyRepo = transactionManager.getCustomRepository(
        this.currencyRepository_
      )
      await currencyRepo.save(currency)

      await this.eventBusService_.emit(CurrencyService.Events.UPDATED, {
        code,
      })

      return currency
    })
  }
}
