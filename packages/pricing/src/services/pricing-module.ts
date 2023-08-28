import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  JoinerServiceConfig,
  PricingTypes,
} from "@medusajs/types"
import { Currency } from "@models"
import { CurrencyService } from "@services"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"

import { shouldForceTransaction } from "@medusajs/utils"
import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  currencyService: CurrencyService<any>
}

export default class PricingModuleService<TCurrency extends Currency = Currency>
  implements PricingTypes.IPricingModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly currencyService_: CurrencyService<TCurrency>

  constructor(
    { baseRepository, currencyService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.currencyService_ = currencyService
  }

  __joinerConfig(): JoinerServiceConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async retrieveCurrency(
    code: string,
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.CurrencyDTO> {
    const currency = await this.currencyService_.retrieve(
      code,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(currency))
  }

  @InjectManager("baseRepository_")
  async listCurrencies(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.CurrencyDTO[]> {
    const currencies = await this.currencyService_.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(currencies))
  }

  @InjectManager("baseRepository_")
  async listAndCountCurrencies(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.CurrencyDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.CurrencyDTO[], number]> {
    const [currencies, count] = await this.currencyService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [JSON.parse(JSON.stringify(currencies)), count]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createCurrencies(
    data: PricingTypes.CreateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const currencies = await this.currencyService_.create(data, sharedContext)

    return JSON.parse(JSON.stringify(currencies))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateCurrencies(
    data: PricingTypes.UpdateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const currencies = await this.currencyService_.update(data, sharedContext)

    return JSON.parse(JSON.stringify(currencies))
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteCurrencies(
    currencyCodes: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.currencyService_.delete(currencyCodes, sharedContext)
  }
}
