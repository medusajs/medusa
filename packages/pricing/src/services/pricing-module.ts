import {
  Context,
  CreateMoneyAmountDTO,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  PriceSetDTO,
  PricingContext,
  PricingFilters,
  PricingTypes,
  RuleTypeDTO,
} from "@medusajs/types"

import {
  Currency,
  MoneyAmount,
  PriceList,
  PriceListRule,
  PriceListRuleValue,
  PriceRule,
  PriceSet,
  PriceSetMoneyAmount,
  PriceSetMoneyAmountRules,
  PriceSetRuleType,
  RuleType,
} from "@models"

import {
  CurrencyService,
  MoneyAmountService,
  PriceListRuleService,
  PriceListRuleValueService,
  PriceListService,
  PriceRuleService,
  PriceSetMoneyAmountRulesService,
  PriceSetMoneyAmountService,
  PriceSetRuleTypeService,
  PriceSetService,
  RuleTypeService,
} from "@services"

import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  groupBy,
  removeNullish,
  shouldForceTransaction,
} from "@medusajs/utils"

import { AddPricesDTO } from "@medusajs/types"
import { joinerConfig } from "../joiner-config"
import { PricingRepositoryService } from "../types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  pricingRepository: PricingRepositoryService
  currencyService: CurrencyService<any>
  moneyAmountService: MoneyAmountService<any>
  priceSetService: PriceSetService<any>
  priceSetMoneyAmountRulesService: PriceSetMoneyAmountRulesService<any>
  ruleTypeService: RuleTypeService<any>
  priceRuleService: PriceRuleService<any>
  priceSetRuleTypeService: PriceSetRuleTypeService<any>
  priceSetMoneyAmountService: PriceSetMoneyAmountService<any>
  priceListService: PriceListService<any>
  priceListRuleService: PriceListRuleService<any>
  priceListRuleValueService: PriceListRuleValueService<any>
}

export default class PricingModuleService<
  TPriceSet extends PriceSet = PriceSet,
  TMoneyAmount extends MoneyAmount = MoneyAmount,
  TCurrency extends Currency = Currency,
  TRuleType extends RuleType = RuleType,
  TPriceSetMoneyAmountRules extends PriceSetMoneyAmountRules = PriceSetMoneyAmountRules,
  TPriceRule extends PriceRule = PriceRule,
  TPriceSetRuleType extends PriceSetRuleType = PriceSetRuleType,
  TPriceSetMoneyAmount extends PriceSetMoneyAmount = PriceSetMoneyAmount,
  TPriceList extends PriceList = PriceList,
  TPriceListRule extends PriceListRule = PriceListRule,
  TPriceListRuleValue extends PriceListRuleValue = PriceListRuleValue
> implements PricingTypes.IPricingModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly pricingRepository_: PricingRepositoryService
  protected readonly currencyService_: CurrencyService<TCurrency>
  protected readonly moneyAmountService_: MoneyAmountService<TMoneyAmount>
  protected readonly ruleTypeService_: RuleTypeService<TRuleType>
  protected readonly priceSetService_: PriceSetService<TPriceSet>
  protected readonly priceSetMoneyAmountRulesService_: PriceSetMoneyAmountRulesService<TPriceSetMoneyAmountRules>
  protected readonly priceRuleService_: PriceRuleService<TPriceRule>
  protected readonly priceSetRuleTypeService_: PriceSetRuleTypeService<TPriceSetRuleType>
  protected readonly priceSetMoneyAmountService_: PriceSetMoneyAmountService<TPriceSetMoneyAmount>
  protected readonly priceListService_: PriceListService<TPriceList>
  protected readonly priceListRuleService_: PriceListRuleService<TPriceListRule>
  protected readonly priceListRuleValueService_: PriceListRuleValueService<TPriceListRuleValue>

  constructor(
    {
      baseRepository,
      pricingRepository,
      moneyAmountService,
      currencyService,
      ruleTypeService,
      priceSetService,
      priceSetMoneyAmountRulesService,
      priceRuleService,
      priceSetRuleTypeService,
      priceSetMoneyAmountService,
      priceListService,
      priceListRuleService,
      priceListRuleValueService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.pricingRepository_ = pricingRepository
    this.currencyService_ = currencyService
    this.moneyAmountService_ = moneyAmountService
    this.ruleTypeService_ = ruleTypeService
    this.priceSetService_ = priceSetService
    this.priceSetMoneyAmountRulesService_ = priceSetMoneyAmountRulesService
    this.ruleTypeService_ = ruleTypeService
    this.priceRuleService_ = priceRuleService
    this.priceSetRuleTypeService_ = priceSetRuleTypeService
    this.priceSetMoneyAmountService_ = priceSetMoneyAmountService
    this.priceListService_ = priceListService
    this.priceListRuleService_ = priceListRuleService
    this.priceListRuleValueService_ = priceListRuleValueService
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
    const results = await this.pricingRepository_.calculatePrices(
      pricingFilters,
      pricingContext,
      sharedContext
    )
    const pricesSetPricesMap = groupBy(results, "id")

    const calculatedPrices = pricingFilters.id.map(
      (priceSetId: string): PricingTypes.CalculatedPriceSetDTO => {
        // This is where we select prices, for now we just do a first match based on the database results
        // which is prioritized by number_rules first for exact match and then deafult_priority of the rule_type
        // inject custom price selection here
        const price = pricesSetPricesMap.get(priceSetId)?.[0]

        return {
          id: priceSetId,
          amount: price?.amount || null,
          currency_code: price?.currency_code || null,
          min_quantity: price?.min_quantity || null,
          max_quantity: price?.max_quantity || null,
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

  async create(
    data: PricingTypes.CreatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

  async create(
    data: PricingTypes.CreatePriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  @InjectManager("baseRepository_")
  async create(
    data: PricingTypes.CreatePriceSetDTO | PricingTypes.CreatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO | PriceSetDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const priceSets = await this.create_(input, sharedContext)

    const dbPriceSets = await this.list(
      { id: priceSets.filter((p) => !!p).map((p) => p!.id) },
      {
        relations: ["rule_types", "money_amounts", "price_rules"],
      }
    )

    return (Array.isArray(data) ? dbPriceSets : dbPriceSets[0]) as unknown as
      | PriceSetDTO
      | PriceSetDTO[]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async create_(
    data: PricingTypes.CreatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const ruleAttributes = data
      .map((d) => d.rules?.map((r) => r.rule_attribute) ?? [])
      .flat()

    const ruleTypes = await this.ruleTypeService_.list(
      {
        rule_attribute: ruleAttributes,
      },
      {},
      sharedContext
    )

    const ruleTypeMap = ruleTypes.reduce((acc, curr) => {
      acc.set(curr.rule_attribute, curr)
      return acc
    }, new Map())

    const invalidRuleAttributes = ruleAttributes.filter(
      (r) => !ruleTypeMap.has(r)
    )

    if (invalidRuleAttributes.length > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Rule types don't exist for: ${invalidRuleAttributes.join(", ")}`
      )
    }

    const invalidMoneyAmountRule = data
      .map((d) => d.prices?.map((ma) => Object.keys(ma.rules)).flat() ?? [])
      .flat()
      .filter((r) => !ruleTypeMap.has(r))

    if (invalidMoneyAmountRule.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Rule types don't exist for money amounts with rule attribute: ${invalidMoneyAmountRule.join(
          ", "
        )}`
      )
    }

    const priceSets = await Promise.all(
      data.map(async (d) => {
        const { rules, prices, ...rest } = d
        const [priceSet] = await this.priceSetService_.create(
          [rest],
          sharedContext
        )

        if (rules?.length) {
          const priceSetRuleTypesCreate = rules!.map((r) => ({
            rule_type: ruleTypeMap.get(r.rule_attribute),
            price_set: priceSet,
          }))

          await this.priceSetRuleTypeService_.create(
            priceSetRuleTypesCreate as unknown as PricingTypes.CreatePriceSetRuleTypeDTO[],
            sharedContext
          )
        }

        if (prices?.length) {
          for (const ma of prices) {
            const [moneyAmount] = await this.moneyAmountService_.create(
              [ma] as unknown as CreateMoneyAmountDTO[],
              sharedContext
            )

            const cleanRules = ma.rules ? removeNullish(ma.rules) : {}

            const numberOfRules = Object.entries(cleanRules).length

            const [priceSetMoneyAmount] =
              await this.priceSetMoneyAmountService_.create(
                [
                  {
                    price_set: priceSet,
                    money_amount: moneyAmount,
                    title: "test",
                    number_rules: numberOfRules,
                  },
                ] as unknown as PricingTypes.CreatePriceSetMoneyAmountDTO[],
                sharedContext
              )

            if (numberOfRules) {
              const priceSetRulesCreate = Object.entries(cleanRules).map(
                ([k, v]) => ({
                  price_set_money_amount: priceSetMoneyAmount,
                  rule_type: ruleTypeMap.get(k),
                  price_set: priceSet,
                  value: v,
                  price_list_id: "test",
                })
              )

              await this.priceRuleService_.create(
                priceSetRulesCreate as unknown as PricingTypes.CreatePriceRuleDTO[],
                sharedContext
              )
            }
          }
        }

        return priceSet
      })
    )

    return priceSets
  }

  async addRules(
    data: PricingTypes.AddRulesDTO,
    sharedContext?: Context
  ): Promise<PricingTypes.PriceSetDTO>

  async addRules(
    data: PricingTypes.AddRulesDTO[],
    sharedContext?: Context
  ): Promise<PricingTypes.PriceSetDTO[]>

  @InjectManager("baseRepository_")
  async addRules(
    data: PricingTypes.AddRulesDTO | PricingTypes.AddRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetDTO[] | PricingTypes.PriceSetDTO> {
    const inputs = Array.isArray(data) ? data : [data]

    const priceSets = await this.addRules_(inputs, sharedContext)

    return (Array.isArray(data) ? priceSets : priceSets[0]) as unknown as
      | PricingTypes.PriceSetDTO[]
      | PricingTypes.PriceSetDTO
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async addRules_(
    inputs: PricingTypes.AddRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetDTO[]> {
    const priceSets = await this.priceSetService_.list(
      { id: inputs.map((d) => d.priceSetId) },
      { relations: ["rule_types"] }
    )

    const priceSetRuleTypeMap: Map<string, Map<string, RuleTypeDTO>> = new Map(
      priceSets.map((priceSet) => [
        priceSet.id,
        new Map([...priceSet.rule_types].map((rt) => [rt.rule_attribute, rt])),
      ])
    )

    const priceSetMap = new Map(priceSets.map((p) => [p.id, p]))

    const invalidPriceSetInputs = inputs.filter(
      (d) => !priceSetMap.has(d.priceSetId)
    )

    if (invalidPriceSetInputs.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `PriceSets with ids: ${invalidPriceSetInputs
          .map((d) => d.priceSetId)
          .join(", ")} was not found`
      )
    }

    const ruleTypes = await this.ruleTypeService_.list(
      {
        rule_attribute: inputs
          .map((d) => d.rules.map((r) => r.attribute))
          .flat(),
      },
      {},
      sharedContext
    )

    const ruleTypeMap: Map<string, RuleTypeDTO> = new Map(
      ruleTypes.map((rt) => [rt.rule_attribute, rt])
    )

    const invalidRuleAttributeInputs = inputs
      .map((d) => d.rules.map((r) => r.attribute))
      .flat()
      .filter((r) => !ruleTypeMap.has(r))

    if (invalidRuleAttributeInputs.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Rule types don't exist for attributes: ${[
          ...new Set(invalidRuleAttributeInputs),
        ].join(", ")}`
      )
    }

    const priceSetRuleTypesCreate: PricingTypes.CreatePriceSetRuleTypeDTO[] = []

    inputs.forEach((d) => {
      const priceSet = priceSetMap.get(d.priceSetId)

      for (const r of d.rules) {
        if (priceSetRuleTypeMap.get(d.priceSetId)!.has(r.attribute)) {
          continue
        }

        priceSetRuleTypesCreate.push({
          rule_type: ruleTypeMap.get(r.attribute) as RuleTypeDTO,
          price_set: priceSet as unknown as PriceSetDTO,
        })
      }
    })

    await this.priceSetRuleTypeService_.create(
      priceSetRuleTypesCreate as unknown as PricingTypes.CreatePriceSetRuleTypeDTO[],
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceSetDTO[]>(
      priceSets,
      {
        populate: true,
      }
    )
  }

  async addPrices(
    data: AddPricesDTO,
    sharedContext?: Context
  ): Promise<PricingTypes.PriceSetDTO>

  async addPrices(
    data: AddPricesDTO[],
    sharedContext?: Context
  ): Promise<PricingTypes.PriceSetDTO[]>

  @InjectManager("baseRepository_")
  async addPrices(
    data: AddPricesDTO | AddPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetDTO[] | PricingTypes.PriceSetDTO> {
    const input = Array.isArray(data) ? data : [data]

    await this.addPrices_(input, sharedContext)

    return (await this.list(
      { id: input.map((d) => d.priceSetId) },
      { relations: ["money_amounts"] }
    )) as unknown as PricingTypes.PriceSetDTO[] | PricingTypes.PriceSetDTO
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async addPrices_(
    input: AddPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const priceSets = await this.list(
      { id: input.map((d) => d.priceSetId) },
      { relations: ["rule_types"] },
      sharedContext
    )

    const priceSetMap = new Map(priceSets.map((p) => [p.id, p]))

    const ruleTypeMap: Map<string, Map<string, RuleTypeDTO>> = new Map(
      priceSets.map((priceSet) => [
        priceSet.id,
        new Map(
          priceSet.rule_types?.map((rt) => [rt.rule_attribute, rt]) ?? []
        ),
      ])
    )

    input.forEach(({ priceSetId, prices }) => {
      const priceSet = priceSetMap.get(priceSetId)

      if (!priceSet) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price set with id: ${priceSetId} not found`
        )
      }

      const ruleAttributes = prices
        .map((d) => (d.rules ? Object.keys(d.rules) : []))
        .flat()

      const invalidRuleAttributes = ruleAttributes.filter(
        (r) => !ruleTypeMap.get(priceSetId)!.has(r)
      )

      if (invalidRuleAttributes.length > 0) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Rule types don't exist for: ${invalidRuleAttributes.join(", ")}`
        )
      }
    })

    for (const { priceSetId, prices } of input) {
      await Promise.all(
        prices.map(async (ma) => {
          const [moneyAmount] = await this.moneyAmountService_.create(
            [ma] as unknown as CreateMoneyAmountDTO[],
            sharedContext
          )

          const numberOfRules = Object.entries(ma?.rules ?? {}).length

          const [priceSetMoneyAmount] =
            await this.priceSetMoneyAmountService_.create(
              [
                {
                  price_set: priceSetId,
                  money_amount: moneyAmount,
                  title: "test",
                  number_rules: numberOfRules,
                },
              ] as unknown as PricingTypes.CreatePriceSetMoneyAmountDTO[],
              sharedContext
            )

          if (numberOfRules) {
            const priceSetRulesCreate = Object.entries(ma.rules!).map(
              ([k, v]) => ({
                price_set_money_amount: priceSetMoneyAmount,
                rule_type: ruleTypeMap.get(priceSetId)!.get(k),
                price_set: priceSetId,
                value: v,
                price_list_id: "test",
              })
            )

            await this.priceRuleService_.create(
              priceSetRulesCreate as unknown as PricingTypes.CreatePriceRuleDTO[],
              sharedContext
            )
          }

          return moneyAmount
        })
      )
    }

    return priceSets
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async removeRules(
    data: PricingTypes.RemovePriceSetRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const priceSets = await this.priceSetService_.list({
      id: data.map((d) => d.id),
    })
    const priceSetIds = priceSets.map((ps) => ps.id)

    const ruleTypes = await this.ruleTypeService_.list({
      rule_attribute: data.map((d) => d.rules || []).flat(),
    })
    const ruleTypeIds = ruleTypes.map((rt) => rt.id)

    const priceSetRuleTypes = await this.priceSetRuleTypeService_.list({
      price_set_id: priceSetIds,
      rule_type_id: ruleTypeIds,
    })

    const priceRules = await this.priceRuleService_.list(
      {
        price_set_id: priceSetIds,
        rule_type_id: ruleTypeIds,
      },
      {
        select: ["price_set_money_amount"],
      }
    )

    await this.priceSetRuleTypeService_.delete(
      priceSetRuleTypes.map((psrt) => psrt.id),
      sharedContext
    )

    await this.priceSetMoneyAmountService_.delete(
      priceRules.map((pr) => pr.price_set_money_amount.id),
      sharedContext
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
    ruleTypeIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.ruleTypeService_.delete(ruleTypeIds, sharedContext)
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

  @InjectManager("baseRepository_")
  async listPriceSetMoneyAmounts(
    filters: PricingTypes.FilterablePriceSetMoneyAmountProps = {},
    config: FindConfig<PricingTypes.PriceSetMoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetMoneyAmountDTO[]> {
    const records = await this.priceSetMoneyAmountService_.list(
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
  async listAndCountPriceSetMoneyAmounts(
    filters: PricingTypes.FilterablePriceSetMoneyAmountProps = {},
    config: FindConfig<PricingTypes.PriceSetMoneyAmountDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.PriceSetMoneyAmountDTO[], number]> {
    const [records, count] =
      await this.priceSetMoneyAmountService_.listAndCount(
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
    const priceRule = await this.priceRuleService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceRuleDTO>(
      priceRule,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listPriceRules(
    filters: PricingTypes.FilterablePriceRuleProps = {},
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceRuleDTO[]> {
    const priceRules = await this.priceRuleService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
      priceRules,
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
    const [priceRules, count] = await this.priceRuleService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
        priceRules,
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
    const priceRules = await this.priceRuleService_.create(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
      priceRules,
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
    const priceRules = await this.priceRuleService_.update(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
      priceRules,
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

  @InjectManager("baseRepository_")
  async retrievePriceList(
    id: string,
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const priceList = await this.priceListService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO>(
      priceList,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listPriceLists(
    filters: PricingTypes.FilterablePriceListProps = {},
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.priceListService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountPriceLists(
    filters: PricingTypes.FilterablePriceListProps = {},
    config: FindConfig<PricingTypes.PriceListDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.PriceListDTO[], number]> {
    const [priceLists, count] = await this.priceListService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
        priceLists,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectManager("baseRepository_")
  async createPriceLists(
    data: PricingTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.createPriceLists_(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async createPriceLists_(
    data: PricingTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const createdPriceLists: PricingTypes.PriceListDTO[] = []
    const ruleAttributes = data
      .map((priceListData) => Object.keys(priceListData.rules))
      .flat()

    const ruleTypes = await this.listRuleTypes({
      rule_attribute: ruleAttributes,
    })

    const ruleTypeMap: Map<string, RuleTypeDTO> = new Map(
      ruleTypes.map((rt) => [rt.rule_attribute, rt])
    )

    data.map((priceListData) => Object.keys(priceListData.rules))

    for (const priceListData of data) {
      const { rules = {}, prices = [], ...priceListOnlyData } = priceListData

      const [createdPriceList] = (await this.priceListService_.create(
        [
          {
            ...priceListOnlyData,
            number_rules: Object.keys(rules).length,
          },
        ],
        sharedContext
      )) as unknown as PricingTypes.PriceListDTO[]

      createdPriceLists.push(createdPriceList)

      for (const [ruleAttribute, ruleValues = []] of Object.entries(rules)) {
        // Find or create rule type
        let ruleType = ruleTypeMap.get(ruleAttribute)

        if (!ruleType) {
          ;[ruleType] = await this.createRuleTypes(
            [
              {
                name: ruleAttribute,
                rule_attribute: ruleAttribute,
              },
            ],
            sharedContext
          )

          ruleTypeMap.set(ruleAttribute, ruleType)
        }

        // Create the rule
        const [priceListRule] = await this.priceListRuleService_.create(
          [
            {
              price_list: createdPriceList,
              rule_type: ruleType?.id || ruleType,
            },
          ],
          sharedContext
        )

        // Create the values for the rule
        for (const ruleValue of ruleValues) {
          await this.priceListRuleValueService_.create(
            [
              {
                price_list_rule: priceListRule,
                value: ruleValue,
              },
            ],
            sharedContext
          )
        }
      }

      for (const price of prices) {
        const { price_set_id: priceSetId, ...moneyAmountData } = price

        const [moneyAmount] = await this.moneyAmountService_.create(
          [moneyAmountData],
          sharedContext
        )

        await this.priceSetMoneyAmountService_.create(
          [
            {
              price_set: priceSetId,
              price_list: createdPriceList,
              money_amount: moneyAmount,
              title: "test",
              number_rules: 0,
            },
          ] as unknown as PricingTypes.CreatePriceSetMoneyAmountDTO[],
          sharedContext
        )
      }
    }

    return createdPriceLists
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updatePriceLists(
    data: PricingTypes.UpdatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.priceListService_.update(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deletePriceLists(
    priceListIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceListService_.delete(priceListIds, sharedContext)
  }

  @InjectManager("baseRepository_")
  async retrievePriceListRule(
    id: string,
    config: FindConfig<PricingTypes.PriceListRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListRuleDTO> {
    const priceList = await this.priceListRuleService_.retrieve(
      id,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceListRuleDTO>(
      priceList,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listPriceListRules(
    filters: PricingTypes.FilterablePriceListRuleProps = {},
    config: FindConfig<PricingTypes.PriceListRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListRuleDTO[]> {
    const priceLists = await this.priceListRuleService_.list(
      filters,
      config,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceListRuleDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountPriceListRules(
    filters: PricingTypes.FilterablePriceListRuleProps = {},
    config: FindConfig<PricingTypes.PriceListRuleDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PricingTypes.PriceListRuleDTO[], number]> {
    const [priceLists, count] = await this.priceListRuleService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PricingTypes.PriceListRuleDTO[]>(
        priceLists,
        {
          populate: true,
        }
      ),
      count,
    ]
  }

  @InjectManager("baseRepository_")
  async createPriceListRules(
    data: PricingTypes.CreatePriceListRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListRuleDTO[]> {
    const priceLists = await this.createPriceListRules_(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceListRuleDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async createPriceListRules_(
    data: PricingTypes.CreatePriceListRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.priceListRuleService_.create(data, sharedContext)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async updatePriceListRules(
    data: PricingTypes.UpdatePriceListRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListRuleDTO[]> {
    const priceLists = await this.priceListRuleService_.update(
      data,
      sharedContext
    )

    return this.baseRepository_.serialize<PricingTypes.PriceListRuleDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async deletePriceListRules(
    priceListRuleIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceListRuleService_.delete(priceListRuleIds, sharedContext)
  }

  @InjectManager("baseRepository_")
  async addPriceListPrices(
    data: PricingTypes.AddPriceListPricesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const [priceList] = await this.addPriceListPrices_([data], sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO>(
      priceList,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  protected async addPriceListPrices_(
    data: PricingTypes.AddPriceListPricesDTO[],
    sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.listPriceLists(
      { id: data.map((d) => d.priceListId) },
      {},
      sharedContext
    )

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))

    for (const { priceListId, prices } of data) {
      const priceList = priceListMap.get(priceListId)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${priceListId} not found`
        )
      }

      await Promise.all(
        prices.map(async (price) => {
          const [moneyAmount] = await this.moneyAmountService_.create(
            [price] as unknown as CreateMoneyAmountDTO[],
            sharedContext
          )

          await this.priceSetMoneyAmountService_.create(
            [
              {
                price_set: price.price_set_id,
                money_amount: moneyAmount,
                title: "test",
                number_rules: 0,
                price_list: priceList.id,
              },
            ] as unknown as PricingTypes.CreatePriceSetMoneyAmountDTO[],
            sharedContext
          )

          return moneyAmount
        })
      )
    }

    return priceLists
  }
}
