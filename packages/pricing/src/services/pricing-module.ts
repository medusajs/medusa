import {
  AddPricesDTO,
  Context,
  CreateMoneyAmountDTO,
  CreatePriceListRuleDTO,
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
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  PriceListType,
  arrayDifference,
  deduplicate,
  groupBy,
  removeNullish,
} from "@medusajs/utils"

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
import { joinerConfig } from "../joiner-config"
import { CreatePriceListRuleValueDTO, PricingRepositoryService } from "../types"

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
  ): Promise<PricingTypes.CalculatedPriceSet[]> {
    const results = await this.pricingRepository_.calculatePrices(
      pricingFilters,
      pricingContext,
      sharedContext
    )

    const pricesSetPricesMap = groupBy(results, "price_set_id")

    const calculatedPrices: PricingTypes.CalculatedPriceSet[] =
      pricingFilters.id.map(
        (priceSetId: string): PricingTypes.CalculatedPriceSet => {
          // This is where we select prices, for now we just do a first match based on the database results
          // which is prioritized by rules_count first for exact match and then deafult_priority of the rule_type
          // inject custom price selection here
          const prices = pricesSetPricesMap.get(priceSetId) || []
          const priceListPrice = prices.find((p) => p.price_list_id)

          const defaultPrice = prices?.find((p) => !p.price_list_id)

          let calculatedPrice: PricingTypes.CalculatedPriceSetDTO = defaultPrice
          let originalPrice: PricingTypes.CalculatedPriceSetDTO = defaultPrice

          if (priceListPrice) {
            calculatedPrice = priceListPrice

            if (priceListPrice.price_list_type === PriceListType.OVERRIDE) {
              originalPrice = priceListPrice
            }
          }

          return {
            id: priceSetId,
            is_calculated_price_price_list: !!calculatedPrice?.price_list_id,
            calculated_amount: parseInt(calculatedPrice?.amount || "") || null,

            is_original_price_price_list: !!originalPrice?.price_list_id,
            original_amount: parseInt(originalPrice?.amount || "") || null,

            currency_code: calculatedPrice?.currency_code || null,

            calculated_price: {
              money_amount_id: calculatedPrice?.id || null,
              price_list_id: calculatedPrice?.price_list_id || null,
              price_list_type: calculatedPrice?.price_list_type || null,
              min_quantity:
                parseInt(calculatedPrice?.min_quantity || "") || null,
              max_quantity:
                parseInt(calculatedPrice?.max_quantity || "") || null,
            },

            original_price: {
              money_amount_id: originalPrice?.id || null,
              price_list_id: originalPrice?.price_list_id || null,
              price_list_type: originalPrice?.price_list_type || null,
              min_quantity: parseInt(originalPrice?.min_quantity || "") || null,
              max_quantity: parseInt(originalPrice?.max_quantity || "") || null,
            },
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
      },
      sharedContext
    )

    return (Array.isArray(data) ? dbPriceSets : dbPriceSets[0]) as unknown as
      | PriceSetDTO
      | PriceSetDTO[]
  }

  @InjectTransactionManager("baseRepository_")
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
      { take: null },
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
      .map(
        (d) => d.prices?.map((ma) => Object.keys(ma?.rules ?? {})).flat() ?? []
      )
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

    // Bulk create price sets
    const priceSetData = data.map(({ rules, prices, ...rest }) => rest)
    const createdPriceSets = await this.priceSetService_.create(
      priceSetData,
      sharedContext
    )

    // Price set rule types
    const ruleTypeData = data.flatMap(
      (item, index) =>
        item.rules?.map((rule) => ({
          rule_type: ruleTypeMap.get(rule.rule_attribute),
          price_set: createdPriceSets[index],
        })) || []
    )

    if (ruleTypeData.length > 0) {
      await this.priceSetRuleTypeService_.create(
        ruleTypeData as unknown as PricingTypes.CreatePriceSetRuleTypeDTO[],
        sharedContext
      )
    }

    // Money amounts
    const moneyAmountData = data.flatMap((item) => item.prices || [])
    const createdMoneyAmounts = await this.moneyAmountService_.create(
      moneyAmountData,
      sharedContext
    )

    let moneyAmountIndex = 0
    const priceSetMoneyAmountData: unknown[] = []
    const priceRulesData: unknown[] = []

    for (const [index, item] of data.entries()) {
      for (const ma of item.prices || []) {
        const cleanRules = ma.rules ? removeNullish(ma.rules) : {}
        const numberOfRules = Object.entries(cleanRules).length

        const priceSetMoneyAmount = {
          price_set: createdPriceSets[index],
          money_amount: createdMoneyAmounts[moneyAmountIndex++],
          title: "test", // TODO: accept title
          rules_count: numberOfRules,
        }
        priceSetMoneyAmountData.push(priceSetMoneyAmount)

        for (const [k, v] of Object.entries(cleanRules)) {
          priceRulesData.push({
            price_set_money_amount: null, // Updated later
            rule_type: ruleTypeMap.get(k),
            price_set: createdPriceSets[index],
            value: v,
            price_list_id: "test",
          })
        }
      }
    }

    // Bulk create price set money amounts
    const createdPriceSetMoneyAmounts =
      await this.priceSetMoneyAmountService_.create(
        priceSetMoneyAmountData as PricingTypes.CreatePriceSetMoneyAmountDTO[],
        sharedContext
      )

    // Update price set money amount references
    for (let i = 0, j = 0; i < priceSetMoneyAmountData.length; i++) {
      const rulesCount = (priceSetMoneyAmountData[i] as any).rules_count
      for (let k = 0; k < rulesCount; k++, j++) {
        ;(priceRulesData[j] as any).price_set_money_amount =
          createdPriceSetMoneyAmounts[i]
      }
    }

    // Price rules
    if (priceRulesData.length > 0) {
      await this.priceRuleService_.create(
        priceRulesData as PricingTypes.CreatePriceRuleDTO[],
        sharedContext
      )
    }

    return createdPriceSets
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

    return await this.list(
      { id: priceSets.map(({ id }) => id) },
      {
        relations: ["rule_types"],
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async addRules_(
    inputs: PricingTypes.AddRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TPriceSet[]> {
    const priceSets = await this.priceSetService_.list(
      { id: inputs.map((d) => d.priceSetId) },
      { relations: ["rule_types"] },
      sharedContext
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
      { take: null },
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

    return priceSets
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
      { relations: ["money_amounts"] },
      sharedContext
    )) as unknown as PricingTypes.PriceSetDTO[] | PricingTypes.PriceSetDTO
  }

  @InjectTransactionManager("baseRepository_")
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

    // Money amounts
    const moneyAmountsBulkData = input.flatMap((entry) => entry.prices)
    const createdMoneyAmounts = await this.moneyAmountService_.create(
      moneyAmountsBulkData as unknown as CreateMoneyAmountDTO[],
      sharedContext
    )

    // Price set money amounts
    let maCursor = 0
    const priceSetMoneyAmountsBulkData = input.flatMap(
      ({ priceSetId, prices }) =>
        prices.map(() => {
          const ma = createdMoneyAmounts[maCursor]
          const numberOfRules = Object.entries(
            prices[maCursor]?.rules ?? {}
          ).length
          maCursor++
          return {
            price_set: priceSetId,
            money_amount: ma,
            title: "test", // TODO: accept title
            rules_count: numberOfRules,
          }
        })
    )
    const createdPriceSetMoneyAmounts =
      await this.priceSetMoneyAmountService_.create(
        priceSetMoneyAmountsBulkData as unknown as PricingTypes.CreatePriceSetMoneyAmountDTO[],
        sharedContext
      )

    // Price rules
    let rulesCursor = 0
    const priceRulesBulkData = input.flatMap(({ priceSetId, prices }) =>
      prices.flatMap((ma) => {
        const rules = ma.rules ?? {}
        const priceSetMoneyAmount = createdPriceSetMoneyAmounts[rulesCursor]
        rulesCursor++
        return Object.entries(rules).map(([k, v]) => ({
          price_set_money_amount: priceSetMoneyAmount,
          rule_type: ruleTypeMap.get(priceSetId)!.get(k),
          price_set: priceSetId,
          value: v,
          price_list_id: "test", // TODO: accept title
        }))
      })
    )

    if (priceRulesBulkData.length > 0) {
      await this.priceRuleService_.create(
        priceRulesBulkData as unknown as PricingTypes.CreatePriceRuleDTO[],
        sharedContext
      )
    }
  }

  @InjectTransactionManager("baseRepository_")
  async removeRules(
    data: PricingTypes.RemovePriceSetRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const priceSets = await this.priceSetService_.list(
      {
        id: data.map((d) => d.id),
      },
      {},
      sharedContext
    )
    const priceSetIds = priceSets.map((ps) => ps.id)

    const ruleTypes = await this.ruleTypeService_.list(
      {
        rule_attribute: data.map((d) => d.rules || []).flat(),
      },
      { take: null },
      sharedContext
    )
    const ruleTypeIds = ruleTypes.map((rt) => rt.id)

    const priceSetRuleTypes = await this.priceSetRuleTypeService_.list(
      {
        price_set_id: priceSetIds,
        rule_type_id: ruleTypeIds,
      },
      { take: null },
      sharedContext
    )

    const priceRules = await this.priceRuleService_.list(
      {
        price_set_id: priceSetIds,
        rule_type_id: ruleTypeIds,
      },
      {
        select: ["price_set_money_amount"],
        take: null,
      },
      sharedContext
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
  protected async createPriceLists_(
    data: PricingTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const ruleTypeAttributes: string[] = []

    for (const priceListData of data) {
      const { prices = [], rules: priceListRules = {} } = priceListData

      ruleTypeAttributes.push(...Object.keys(priceListRules))

      for (const price of prices) {
        const { rules: priceListPriceRules = {} } = price

        ruleTypeAttributes.push(...Object.keys(priceListPriceRules))
      }
    }

    const ruleTypes = await this.listRuleTypes(
      { rule_attribute: ruleTypeAttributes },
      { take: null }
    )

    const invalidRuleTypes = arrayDifference(
      deduplicate(ruleTypeAttributes),
      ruleTypes.map((ruleType) => ruleType.rule_attribute)
    )

    if (invalidRuleTypes.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot find RuleTypes with rule_attribute - ${invalidRuleTypes.join(
          ", "
        )}`
      )
    }

    const ruleTypeMap: Map<string, RuleTypeDTO> = new Map(
      ruleTypes.map((rt) => [rt.rule_attribute, rt])
    )

    const priceListsToCreate: PricingTypes.CreatePriceListDTO[] = []

    for (const priceListData of data) {
      const { rules = {}, ...priceListOnlyData } = priceListData

      priceListsToCreate.push({
        ...priceListOnlyData,
        rules_count: Object.keys(rules).length,
      })
    }

    const priceLists = (await this.priceListService_.create(
      priceListsToCreate
    )) as unknown as PricingTypes.PriceListDTO[]

    for (var i = 0; i < data.length; i++) {
      const { rules = {}, prices = [] } = data[i]
      const priceList = priceLists[i]

      for (const [ruleAttribute, ruleValues = []] of Object.entries(rules)) {
        let ruleType = ruleTypeMap.get(ruleAttribute)!

        // Create the rule
        const [priceListRule] = await this.priceListRuleService_.create(
          [
            {
              price_list: priceList,
              rule_type: ruleType.id,
            },
          ],
          sharedContext
        )

        // Create the values for the rule
        for (const ruleValue of ruleValues as string[]) {
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
        const {
          price_set_id: priceSetId,
          rules: priceRules = {},
          ...moneyAmountData
        } = price

        const [moneyAmount] = await this.moneyAmountService_.create(
          [moneyAmountData],
          sharedContext
        )

        const [priceSetMoneyAmount] =
          await this.priceSetMoneyAmountService_.create(
            [
              {
                price_set: priceSetId,
                price_list: priceList,
                money_amount: moneyAmount,
                title: "test",
                rules_count: Object.keys(priceRules).length,
              },
            ] as unknown as PricingTypes.CreatePriceSetMoneyAmountDTO[],
            sharedContext
          )

        await this.createPriceRules(
          Object.entries(priceRules).map(([ruleAttribute, ruleValue]) => {
            return {
              price_set_id: priceSetId,
              rule_type:
                ruleTypeMap.get(ruleAttribute)!?.id ||
                ruleTypeMap.get(ruleAttribute)!,
              value: ruleValue,
              price_set_money_amount: priceSetMoneyAmount as any,
            }
          }),
          sharedContext
        )
      }
    }

    return priceLists
  }

  @InjectTransactionManager("baseRepository_")
  async updatePriceLists(
    data: PricingTypes.UpdatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.updatePriceLists_(data, sharedContext)

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async updatePriceLists_(
    data: PricingTypes.UpdatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const updatedPriceLists: PricingTypes.PriceListDTO[] = []
    const ruleAttributes: string[] = []
    const priceListIds: string[] = []

    for (const priceListData of data) {
      if (typeof priceListData.rules === "object") {
        ruleAttributes.push(...Object.keys(priceListData.rules))
        priceListIds.push(priceListData.id)
      }
    }

    const existingPriceLists = await this.listPriceLists(
      { id: priceListIds },
      { relations: ["price_list_rules"] },
      sharedContext
    )

    const priceListRuleIds = existingPriceLists
      .map((pl) => (pl.price_list_rules || []).map((plr) => plr.id))
      .flat()

    const existingPriceListRules = await this.listPriceListRules(
      {
        id: priceListRuleIds,
      },
      {},
      sharedContext
    )

    if (existingPriceListRules.length) {
      await this.deletePriceListRules(
        existingPriceListRules.map((plr) => plr.id),
        sharedContext
      )
    }

    const ruleTypes = await this.listRuleTypes(
      {
        rule_attribute: ruleAttributes,
      },
      { take: null },
      sharedContext
    )

    const ruleTypeMap: Map<string, RuleTypeDTO> = new Map(
      ruleTypes.map((rt) => [rt.rule_attribute, rt])
    )

    for (const priceListData of data) {
      const { rules, ...priceListOnlyData } = priceListData
      const updatePriceListData = {
        ...priceListOnlyData,
      }

      if (typeof rules === "object") {
        updatePriceListData.rules_count = Object.keys(rules).length
      }

      const [updatedPriceList] = (await this.priceListService_.update(
        [updatePriceListData],
        sharedContext
      )) as unknown as PricingTypes.PriceListDTO[]

      updatedPriceLists.push(updatedPriceList)

      for (const [ruleAttribute, ruleValues = []] of Object.entries(
        rules || {}
      )) {
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

        const [priceListRule] = await this.priceListRuleService_.create(
          [
            {
              price_list: updatedPriceList,
              rule_type: ruleType?.id || ruleType,
            },
          ],
          sharedContext
        )

        for (const ruleValue of ruleValues as string[]) {
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
    }

    return updatedPriceLists
  }

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
  async createPriceListRules_(
    data: PricingTypes.CreatePriceListRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.priceListRuleService_.create(data, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
  async deletePriceListRules(
    priceListRuleIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.priceListRuleService_.delete(priceListRuleIds, sharedContext)
  }

  @InjectManager("baseRepository_")
  async addPriceListPrices(
    data: PricingTypes.AddPriceListPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    return await this.addPriceListPrices_(data, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async addPriceListPrices_(
    data: PricingTypes.AddPriceListPricesDTO[],
    sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const ruleTypeAttributes: string[] = []
    const priceListIds: string[] = []
    const priceSetIds: string[] = []

    for (const priceListData of data) {
      priceListIds.push(priceListData.priceListId)

      for (const price of priceListData.prices) {
        ruleTypeAttributes.push(...Object.keys(price.rules || {}))
        priceSetIds.push(price.price_set_id)
      }
    }

    const ruleTypes = await this.listRuleTypes(
      { rule_attribute: ruleTypeAttributes },
      { take: null },
      sharedContext
    )

    const priceSets = await this.list(
      { id: priceSetIds },
      { relations: ["rule_types"] },
      sharedContext
    )

    const priceSetRuleTypeMap: Map<string, Set<string>> = priceSets.reduce(
      (acc, curr) => {
        const priceSetRuleAttributeSet: Set<string> =
          acc.get(curr.id) || new Set()

        for (const rt of curr.rule_types ?? []) {
          priceSetRuleAttributeSet.add(rt.rule_attribute)
        }

        acc.set(curr.id, priceSetRuleAttributeSet)
        return acc
      },
      new Map()
    )

    const ruleTypeErrors: string[] = []

    for (const priceListData of data) {
      for (const price of priceListData.prices) {
        for (const rule_attribute of Object.keys(price.rules ?? {})) {
          if (
            !priceSetRuleTypeMap.get(price.price_set_id)?.has(rule_attribute)
          ) {
            ruleTypeErrors.push(
              `rule_attribute "${rule_attribute}" in price set ${price.price_set_id}`
            )
          }
        }
      }
    }

    if (ruleTypeErrors.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid rule type configuration: Price set rules doesn't exist for ${ruleTypeErrors.join(
          ", "
        )}`
      )
    }

    const ruleTypeMap: Map<string, RuleTypeDTO> = new Map(
      ruleTypes.map((rt) => [rt.rule_attribute, rt])
    )

    const priceLists = await this.listPriceLists(
      { id: priceListIds },
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
          const priceRules = price.rules || {}
          const noOfRules = Object.keys(priceRules).length

          const [moneyAmount] = await this.moneyAmountService_.create(
            [price] as unknown as CreateMoneyAmountDTO[],
            sharedContext
          )

          const [psma] = await this.priceSetMoneyAmountService_.create(
            [
              {
                price_set: price.price_set_id,
                money_amount: moneyAmount.id,
                title: "test",
                price_list: priceList.id,
                rules_count: noOfRules,
              },
            ],
            sharedContext
          )

          await this.createPriceRules(
            Object.entries(priceRules).map(([ruleAttribute, ruleValue]) => {
              return {
                price_set_id: price.price_set_id,
                rule_type:
                  ruleTypeMap.get(ruleAttribute)!?.id ||
                  ruleTypeMap.get(ruleAttribute)!,
                value: ruleValue,
                price_set_money_amount: psma as any,
              }
            }),
            sharedContext
          )

          return psma
        })
      )
    }

    return priceLists
  }

  @InjectManager("baseRepository_")
  async setPriceListRules(
    data: PricingTypes.SetPriceListRulesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const [priceList] = await this.setPriceListRules_([data], sharedContext)

    return priceList
  }

  @InjectTransactionManager("baseRepository_")
  protected async setPriceListRules_(
    data: PricingTypes.SetPriceListRulesDTO[],
    sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.priceListService_.list(
      { id: data.map((d) => d.priceListId) },
      {
        relations: ["price_list_rules", "price_list_rules.rule_type"],
      },
      sharedContext
    )

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))

    const ruleTypes = await this.listRuleTypes(
      {
        rule_attribute: data.map((d) => Object.keys(d.rules)).flat(),
      },
      {
        take: null,
      }
    )

    const ruleTypeMap = new Map(ruleTypes.map((rt) => [rt.rule_attribute, rt]))

    const ruleIdsToUpdate: string[] = []
    const rulesToCreate: CreatePriceListRuleDTO[] = []

    const priceRuleValues = new Map<string, Map<string, string[]>>()

    for (const { priceListId, rules } of data) {
      const priceList = priceListMap.get(priceListId)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${priceListId} not found`
        )
      }

      const priceListRulesMap: Map<string, PriceListRule> = new Map(
        priceList.price_list_rules
          .getItems()
          .map((p) => [p.rule_type.rule_attribute, p])
      )

      const priceListRuleValues = new Map<string, string[]>()
      await Promise.all(
        Object.entries(rules).map(async ([key, value]) => {
          const ruleType = ruleTypeMap.get(key)
          if (!ruleType) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Rule type with attribute: ${key} not found`
            )
          }

          const rule = priceListRulesMap.get(key)

          priceListRuleValues.set(
            ruleType.id,
            Array.isArray(value) ? value : [value]
          )

          if (!rule) {
            rulesToCreate.push({
              rule_type: ruleType.id,
              price_list: priceListId,
            })
          } else {
            ruleIdsToUpdate.push(rule.id)
          }
        })
      )

      priceRuleValues.set(priceListId, priceListRuleValues)
    }

    const [createdRules, priceListValuesToDelete] = await Promise.all([
      this.priceListRuleService_.create(rulesToCreate),
      this.priceListRuleValueService_.list(
        {
          price_list_rule_id: ruleIdsToUpdate,
        },
        { take: null }
      ),
    ])

    const priceListRuleValuesToCreate: CreatePriceListRuleValueDTO[] = []

    for (const { id, price_list, rule_type } of createdRules) {
      const ruleValues = priceRuleValues.get(
        price_list.id ?? (price_list as unknown as string)
      )
      if (!ruleValues) {
        continue
      }

      const values = ruleValues.get(
        rule_type.id ?? (rule_type as unknown as string)
      )
      if (!values) {
        continue
      }

      values.forEach((v) => {
        priceListRuleValuesToCreate.push({
          price_list_rule: id,
          value: v,
        })
      })
    }

    await Promise.all([
      this.priceListRuleValueService_.delete(
        priceListValuesToDelete.map((p) => p.id)
      ),
      this.priceListRuleValueService_.create(priceListRuleValuesToCreate),
    ])

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async removePriceListRules(
    data: PricingTypes.RemovePriceListRulesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const [priceList] = await this.removePriceListRules_([data], sharedContext)

    return priceList
  }

  @InjectTransactionManager("baseRepository_")
  protected async removePriceListRules_(
    data: PricingTypes.RemovePriceListRulesDTO[],
    sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.priceListService_.list(
      { id: data.map((d) => d.priceListId) },
      {
        relations: ["price_list_rules", "price_list_rules.rule_type"],
      },
      sharedContext
    )

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))

    const idsToDelete: string[] = []
    for (const { priceListId, rules } of data) {
      const priceList = priceListMap.get(priceListId)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${priceListId} not found`
        )
      }

      const priceListRulesMap: Map<string, PriceListRule> = new Map(
        priceList.price_list_rules
          .getItems()
          .map((p) => [p.rule_type.rule_attribute, p])
      )

      await Promise.all(
        rules.map(async (rule_attribute) => {
          const rule = priceListRulesMap.get(rule_attribute)
          if (rule) {
            idsToDelete.push(rule.id)
          }
        })
      )
    }

    await this.priceListRuleService_.delete(idsToDelete)

    return this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists,
      {
        populate: true,
      }
    )
  }
}
