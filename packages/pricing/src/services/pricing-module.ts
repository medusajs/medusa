import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  PricingContext,
  PricingFilters,
  PricingTypes,
} from "@medusajs/types"
import {
  Currency,
  MoneyAmount,
  PriceRule,
  PriceSet,
  PriceSetMoneyAmountRules,
  RuleType,
} from "@models"
import {
  CurrencyService,
  MoneyAmountService,
  PriceRuleService,
  PriceSetMoneyAmountRulesService,
  PriceSetService,
  RuleTypeService,
} from "@services"

import { EntityManager } from "@mikro-orm/postgresql"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  shouldForceTransaction,
} from "@medusajs/utils"

import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  currencyService: CurrencyService<any>
  moneyAmountService: MoneyAmountService<any>
  priceSetService: PriceSetService<any>
  priceSetMoneyAmountRulesService: PriceSetMoneyAmountRulesService<any>
  ruleTypeService: RuleTypeService<any>
  priceRuleService: PriceRuleService<any>
}

export default class PricingModuleService<
  TPriceSet extends PriceSet = PriceSet,
  TMoneyAmount extends MoneyAmount = MoneyAmount,
  TCurrency extends Currency = Currency,
  TRuleType extends RuleType = RuleType,
  TPriceSetMoneyAmountRules extends PriceSetMoneyAmountRules = PriceSetMoneyAmountRules,
  TPriceRule extends PriceRule = PriceRule
> implements PricingTypes.IPricingModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly currencyService_: CurrencyService<TCurrency>
  protected readonly moneyAmountService_: MoneyAmountService<TMoneyAmount>
  protected readonly ruleTypeService_: RuleTypeService<TRuleType>
  protected readonly priceSetService_: PriceSetService<TPriceSet>
  protected readonly priceSetMoneyAmountRulesService_: PriceSetMoneyAmountRulesService<TPriceSetMoneyAmountRules>
  protected readonly priceRuleService_: PriceRuleService<TPriceRule>

  constructor(
    {
      baseRepository,
      moneyAmountService,
      currencyService,
      ruleTypeService,
      priceSetService,
      priceSetMoneyAmountRulesService,
      priceRuleService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.currencyService_ = currencyService
    this.moneyAmountService_ = moneyAmountService
    this.ruleTypeService_ = ruleTypeService
    this.priceSetService_ = priceSetService
    this.priceSetMoneyAmountRulesService_ = priceSetMoneyAmountRulesService
    this.ruleTypeService_ = ruleTypeService
    this.priceRuleService_ = priceRuleService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  @InjectManager("baseRepository_")
  async calculatePrices(
    pricingFilters: PricingFilters,
    pricingContext: PricingContext = { context: {} },
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.CalculatedPriceSetDTO> {
    // Keeping this whole logic raw in here for now as they will undergo
    // some changes, will abstract them out once we have a final version
    const context = pricingContext.context || {}
    const manager = sharedContext.manager as EntityManager
    const priceSetFilters: PricingTypes.FilterablePriceSetProps = {
      id: pricingFilters.id,
    }

    const ruleAttributes = Object.entries(context).map(([k, v]) => k)
    const priceRuleValues = Object.entries(context).map(([k, v]) => v)
    const knex = manager.getKnex()
    const em = manager
    // console.log(
    //   "ALL price set money amount - ",
    //   await manager.find(PriceSetMoneyAmount, {})
    // )
    // console.log(
    //   "ALL price set money amount rules - ",
    //   await manager.find(PriceSetMoneyAmountRules, {})
    // )

    // console.log("ALL rule types - ", await manager.find(RuleType, {}))

    // Subquery for price_set_money_amount
    const psmaSubQuery = em
      .createQueryBuilder("PriceSetMoneyAmount", "psma")
      .select(["id", "price_set_id", "money_amount_id", "title"])
      .leftJoin("price_set_money_amount_rules", "psmar")
      .leftJoin("rule_types", "rt")
      .where({
        $or: [
          { "rt.rule_attribute": "currency_code", "psmar.value": "USD" },
          // { "rt.rule_attribute": "currency_code", "psmar.value": "EUR" },
        ],
      })
      .groupBy("id")
    // .having("COUNT(DISTINCT rt.rule_attribute) = psma.number_rules")
    // console.log("running 2 - ", await psmaSubQuery.getQuery())
    // console.log("psmaSubQuery - ", await psmaSubQuery.execute())
    // Main query for price_set
    console.log("blah")
    const mainQuery = em
      .createQueryBuilder("PriceSetMoneyAmount", "psma1")
      .select([
        "psma.id",
        // "ma.amount",
        // "ma.currency_code",
        // "psma.title",
        // "pr.is_dynamic",
        // "prt.rule_attribute",
        // "pr.value",
        // "pr.priority",
      ])
      // .withSubQuery(psmaSubQuery.getKnexQuery(), "psma")
      .from(psmaSubQuery, "psma")
      .joinAndSelect("price_set", "s", {
        "psma.price_set_id": "s.id",
      })
    // .join("money_amount", "ma", "ma.id = psma.money_amount_id")
    // .leftJoin(
    //   "price_rules",
    //   "pr",
    //   "pr.price_set_id = s.id AND pr.price_set_money_amount_id = psma.id"
    // )
    // .leftJoin("rule_type", "prt", "prt.id = pr.rule_type_id")
    // .where({
    //   $or: [
    //     { "prt.rule_attribute": "customer_group_id", "pr.value": "VIP" },
    //     { "prt.rule_attribute": "customer_id", "pr.value": "cus_123" },
    //     { "prt.rule_attribute": "city_id", "pr.value": "copenhagen" },
    //   ],
    //   $and: [{ "pr.is_dynamic": true }, { "pr.priority": null }],
    // })
    // .orderBy({ "s.id": "ASC", "pr.priority": "DESC NULLS LAST" })

    console.log("mainQuery.getQuery() - ", await mainQuery.getQuery())
    console.log("mainQuery.execute() - ", await mainQuery.execute())
    // this is a missed implementation in mikroORM that mimics
    // entity building and merging of duplicated rows.
    const joinedProps = (mainQuery as any)._joinedProps
    const driver = (mainQuery as any).driver
    const mainAlias = (mainQuery as any).mainAlias

    let queryBuilderResults = await mainQuery.execute()

    if (joinedProps.size > 0) {
      queryBuilderResults = driver.mergeJoinedResult(
        queryBuilderResults,
        mainAlias.metadata
      )
    }

    const priceSets = JSON.parse(JSON.stringify(queryBuilderResults))
    const calculatedPrices = priceSets.map(
      (priceSet): PricingTypes.CalculatedPriceSetDTO => {
        // TODO: This will change with the rules engine selection,
        // making a DB query directly instead
        // This should look for a default price when no rules apply
        // When no price is set, return null values for all cases

        return {
          id: priceSet.id,
          amount: priceSet?.ma__amount || null,
          currency_code: priceSet?.ma__currency_code || null,
          min_quantity: priceSet?.ma__min_quantity || null,
          max_quantity: priceSet?.ma__max_quantity || null,
        }
      }
    )

    return JSON.parse(JSON.stringify(calculatedPrices))
  }

  @InjectManager("baseRepository_")
  async retrieve(
    id: string,
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetDTO> {
    const priceSet = await this.priceSetService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceSetDTO>(priceSet, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async list(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetDTO[]> {
    const priceSets = await this.priceSetService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceSetDTO[]>(
      priceSets,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.PriceSetDTO[], number]> {
    const [priceSets, count] = await this.priceSetService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.PriceSetDTO[]>(
        priceSets,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create(
    data: PricingTypes.CreatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const priceSets = await this.priceSetService_.create(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceSetDTO[]>(
      priceSets,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async update(
    data: PricingTypes.UpdatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const priceSets = await this.priceSetService_.update(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceSetDTO[]>(
      priceSets,
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
    await this.priceSetService_.delete(ids, sharedContext)
  }

  @InjectManager("baseRepository_")
  async retrieveMoneyAmount(
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
  async listMoneyAmounts(
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
  async listAndCountMoneyAmounts(
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
  async createMoneyAmounts(
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
  async updateMoneyAmounts(
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
  async deleteMoneyAmounts(
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
    filters: PricingTypes.FilterableRuleTypeProps = {},
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
    filters: PricingTypes.FilterableRuleTypeProps = {},
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

  @InjectManager("baseRepository_")
  async retrievePriceSetMoneyAmountRules(
    id: string,
    config: FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetMoneyAmountRulesDTO> {
    const record = await this.priceSetMoneyAmountRulesService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceSetMoneyAmountRulesDTO>(
      record,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listPriceSetMoneyAmountRules(
    filters: PricingTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetMoneyAmountRulesDTO[]> {
    const records = await this.priceSetMoneyAmountRulesService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<
      PricingTypes.PriceSetMoneyAmountRulesDTO[]
    >(records, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listAndCountPriceSetMoneyAmountRules(
    filters: PricingTypes.FilterablePriceSetMoneyAmountRulesProps = {},
    config: FindConfig<PricingTypes.PriceSetMoneyAmountRulesDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.PriceSetMoneyAmountRulesDTO[], number]> {
    const [records, count] =
      await this.priceSetMoneyAmountRulesService_.listAndCount(
        filters,
        config,
        sharedContext
      )

    return [
      await this.baseRepository_.serialize<
        PricingTypes.PriceSetMoneyAmountRulesDTO[]
      >(records, {
        populate: true,
      }),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createPriceSetMoneyAmountRules(
    data: PricingTypes.CreatePriceSetMoneyAmountRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetMoneyAmountRulesDTO[]> {
    const records = await this.priceSetMoneyAmountRulesService_.create(
      data,
      sharedContext
    )

    return this.baseRepository_.serialize<
      PricingTypes.PriceSetMoneyAmountRulesDTO[]
    >(records, {
      populate: true,
    })
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updatePriceSetMoneyAmountRules(
    data: PricingTypes.UpdatePriceSetMoneyAmountRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetMoneyAmountRulesDTO[]> {
    const records = await this.priceSetMoneyAmountRulesService_.update(
      data,
      sharedContext
    )

    return this.baseRepository_.serialize<
      PricingTypes.PriceSetMoneyAmountRulesDTO[]
    >(records, {
      populate: true,
    })
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deletePriceSetMoneyAmountRules(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceSetMoneyAmountRulesService_.delete(ids, sharedContext)
  }

  @InjectManager("baseRepository_")
  async retrievePriceRule(
    id: string,
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceRuleDTO> {
    const ruleType = await this.priceRuleService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceRuleDTO>(ruleType, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async listPriceRules(
    filters: PricingTypes.FilterablePriceRuleProps = {},
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceRuleDTO[]> {
    const ruleTypes = await this.priceRuleService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
      ruleTypes,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountPriceRules(
    filters: PricingTypes.FilterablePriceRuleProps = {},
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.PriceRuleDTO[], number]> {
    const [ruleTypes, count] = await this.priceRuleService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
        ruleTypes,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createPriceRules(
    data: PricingTypes.CreatePriceRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceRuleDTO[]> {
    const ruleTypes = await this.priceRuleService_.create(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
      ruleTypes,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updatePriceRules(
    data: PricingTypes.UpdatePriceRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceRuleDTO[]> {
    const ruleTypes = await this.priceRuleService_.update(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
      ruleTypes,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deletePriceRules(
    priceRuleIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceRuleService_.delete(priceRuleIds, sharedContext)
  }
}
