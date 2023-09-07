import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  PricingTypes,
} from "@medusajs/types"
import { Currency, MoneyAmount, RuleType } from "@models"
import { CurrencyService, MoneyAmountService } from "@services"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  shouldForceTransaction,
} from "@medusajs/utils"

import { joinerConfig } from "../joiner-config"
import RuleTypeService from "./rule-type"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  currencyService: CurrencyService<any>
  moneyAmountService: MoneyAmountService<any>
  ruleTypeService: RuleTypeService<any>
}

export default class PricingModuleService<
  TMoneyAmount extends MoneyAmount = MoneyAmount,
  TCurrency extends Currency = Currency,
  TRuleType extends RuleType = RuleType,
> implements PricingTypes.IPricingModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly currencyService_: CurrencyService<TCurrency>
  protected readonly moneyAmountService_: MoneyAmountService<TMoneyAmount>
  protected readonly ruleTypeService_: RuleTypeService<TRuleType>

  constructor(
    {
      baseRepository,
      moneyAmountService,
      currencyService,
      ruleTypeService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.currencyService_ = currencyService
    this.moneyAmountService_ = moneyAmountService
    this.ruleTypeService_ = ruleTypeService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async retrieve(
    id: string,
    config: FindConfig<PricingTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.MoneyAmountDTO> {
    const moneyAmount = await this.moneyAmountService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO>(
      moneyAmount,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async list(
    filters: PricingTypes.FilterableMoneyAmountProps = {},
    config: FindConfig<PricingTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.MoneyAmountDTO[]> {
    const moneyAmounts = await this.moneyAmountService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO[]>(
      moneyAmounts,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: PricingTypes.FilterableMoneyAmountProps = {},
    config: FindConfig<PricingTypes.MoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.MoneyAmountDTO[], number]> {
    const [moneyAmounts, count] = await this.moneyAmountService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO[]>(
        moneyAmounts,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create(
    data: PricingTypes.CreateMoneyAmountDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const moneyAmounts = await this.moneyAmountService_.create(
      data,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO[]>(
      moneyAmounts,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async update(
    data: PricingTypes.UpdateMoneyAmountDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const moneyAmounts = await this.moneyAmountService_.update(
      data,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.MoneyAmountDTO[]>(
      moneyAmounts,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.moneyAmountService_.delete(ids, sharedContext)
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

    return this.baseRepository_.serialize<PricingTypes.CurrencyDTO>(currency, {
      populate: true,
    })
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

    return this.baseRepository_.serialize<PricingTypes.CurrencyDTO[]>(
      currencies,
      {
        populate: true,
      }
    )
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

    return [
      await this.baseRepository_.serialize<PricingTypes.CurrencyDTO[]>(
        currencies,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createCurrencies(
    data: PricingTypes.CreateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const currencies = await this.currencyService_.create(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.CurrencyDTO[]>(
      currencies,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateCurrencies(
    data: PricingTypes.UpdateCurrencyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const currencies = await this.currencyService_.update(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.CurrencyDTO[]>(
      currencies,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteCurrencies(
    currencyCodes: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.currencyService_.delete(currencyCodes, sharedContext)
  }


  @InjectManager("baseRepository_")
  async retrieveRuleType(
    id: string,
    config: FindConfig<PricingTypes.RuleTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.RuleTypeDTO> {
    const ruleType = await this.ruleTypeService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.RuleTypeDTO>(ruleType, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listRuleTypes(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.RuleTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.RuleTypeDTO[]> {
    const ruleTypes = await this.ruleTypeService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.RuleTypeDTO[]>(
      ruleTypes,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountRuleTypes(
    filters: PricingTypes.FilterableCurrencyProps = {},
    config: FindConfig<PricingTypes.RuleTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.RuleTypeDTO[], number]> {
    const [ruleTypes, count] = await this.ruleTypeService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.RuleTypeDTO[]>(
        ruleTypes,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createRuleTypes(
    data: PricingTypes.CreateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.RuleTypeDTO[]> {
    const ruleTypes = await this.ruleTypeService_.create(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.RuleTypeDTO[]>(
      ruleTypes,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updateRuleTypes(
    data: PricingTypes.UpdateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.RuleTypeDTO[]> {
    const ruleTypes = await this.ruleTypeService_.update(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.RuleTypeDTO[]>(
      ruleTypes,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deleteRuleTypes(
    ruleTypes: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.ruleTypeService_.delete(ruleTypes, sharedContext)
  }
}
