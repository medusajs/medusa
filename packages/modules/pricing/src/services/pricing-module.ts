import {
  AddPricesDTO,
  Context,
  CreatePriceListRuleDTO,
  CreatePriceRuleDTO,
  CreatePricesDTO,
  CreatePriceSetDTO,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  PriceSetDTO,
  PricingContext,
  PricingFilters,
  PricingRepositoryService,
  PricingTypes,
  RuleTypeDTO,
  UpsertPriceSetDTO,
} from "@medusajs/types"
import {
  arrayDifference,
  deduplicate,
  generateEntityId,
  groupBy,
  InjectManager,
  InjectTransactionManager,
  isPresent,
  isString,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  PriceListType,
  promiseAll,
  removeNullish,
} from "@medusajs/utils"

import {
  Price,
  PriceList,
  PriceListRule,
  PriceListRuleValue,
  PriceRule,
  PriceSet,
  PriceSetRuleType,
  RuleType,
} from "@models"

import { PriceListService, RuleTypeService } from "@services"
import { validatePriceListDates } from "@utils"
import { UpdatePriceSetInput } from "src/types/services"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { PriceListIdPrefix } from "../models/price-list"
import { PriceSetIdPrefix } from "../models/price-set"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  pricingRepository: PricingRepositoryService
  priceSetService: ModulesSdkTypes.InternalModuleService<any>
  ruleTypeService: RuleTypeService<any>
  priceRuleService: ModulesSdkTypes.InternalModuleService<any>
  priceSetRuleTypeService: ModulesSdkTypes.InternalModuleService<any>
  priceService: ModulesSdkTypes.InternalModuleService<any>
  priceListService: PriceListService<any>
  priceListRuleService: ModulesSdkTypes.InternalModuleService<any>
  priceListRuleValueService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [
  PriceList,
  PriceListRule,
  PriceListRuleValue,
  PriceRule,
  Price,
  PriceSetRuleType,
  RuleType,
]

export default class PricingModuleService<
    TPriceSet extends PriceSet = PriceSet,
    TRuleType extends RuleType = RuleType,
    TPriceRule extends PriceRule = PriceRule,
    TPriceSetRuleType extends PriceSetRuleType = PriceSetRuleType,
    TPrice extends Price = Price,
    TPriceList extends PriceList = PriceList,
    TPriceListRule extends PriceListRule = PriceListRule,
    TPriceListRuleValue extends PriceListRuleValue = PriceListRuleValue
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    PricingTypes.PriceSetDTO,
    {
      Price: { dto: PricingTypes.PriceDTO }
      PriceRule: {
        dto: PricingTypes.PriceRuleDTO
        create: PricingTypes.CreatePriceRuleDTO
        update: PricingTypes.UpdatePriceRuleDTO
      }
      RuleType: {
        dto: PricingTypes.RuleTypeDTO
        create: PricingTypes.CreateRuleTypeDTO
        update: PricingTypes.UpdateRuleTypeDTO
      }
      PriceList: { dto: PricingTypes.PriceListDTO }
      PriceListRule: { dto: PricingTypes.PriceListRuleDTO }
    }
  >(PriceSet, generateMethodForModels, entityNameToLinkableKeysMap)
  implements PricingTypes.IPricingModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly pricingRepository_: PricingRepositoryService
  protected readonly ruleTypeService_: RuleTypeService<TRuleType>
  protected readonly priceSetService_: ModulesSdkTypes.InternalModuleService<TPriceSet>
  protected readonly priceRuleService_: ModulesSdkTypes.InternalModuleService<TPriceRule>
  protected readonly priceSetRuleTypeService_: ModulesSdkTypes.InternalModuleService<TPriceSetRuleType>
  protected readonly priceService_: ModulesSdkTypes.InternalModuleService<TPrice>
  protected readonly priceListService_: PriceListService<TPriceList>
  protected readonly priceListRuleService_: ModulesSdkTypes.InternalModuleService<TPriceListRule>
  protected readonly priceListRuleValueService_: ModulesSdkTypes.InternalModuleService<TPriceListRuleValue>

  constructor(
    {
      baseRepository,
      pricingRepository,
      ruleTypeService,
      priceSetService,
      priceRuleService,
      priceSetRuleTypeService,
      priceService,
      priceListService,
      priceListRuleService,
      priceListRuleValueService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.pricingRepository_ = pricingRepository
    this.ruleTypeService_ = ruleTypeService
    this.priceSetService_ = priceSetService
    this.ruleTypeService_ = ruleTypeService
    this.priceRuleService_ = priceRuleService
    this.priceSetRuleTypeService_ = priceSetRuleTypeService
    this.priceService_ = priceService
    this.priceListService_ = priceListService
    this.priceListRuleService_ = priceListRuleService
    this.priceListRuleValueService_ = priceListRuleValueService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  private setupCalculatedPriceConfig_(
    filters,
    config
  ): PricingContext["context"] | undefined {
    const fieldIdx = config.relations?.indexOf("calculated_price")
    const shouldCalculatePrice = fieldIdx > -1

    const pricingContext = filters.context ?? {}

    delete filters.context
    if (!shouldCalculatePrice) {
      return
    }

    // cleanup virtual field "calculated_price"
    config.relations?.splice(fieldIdx, 1)

    return pricingContext
  }

  @InjectManager("baseRepository_")
  async list(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO[]> {
    const pricingContext = this.setupCalculatedPriceConfig_(filters, config)

    const priceSets = await super.list(filters, config, sharedContext)

    if (pricingContext && priceSets.length) {
      const priceSetIds: string[] = []
      const priceSetMap = new Map()
      for (const priceSet of priceSets) {
        priceSetIds.push(priceSet.id)
        priceSetMap.set(priceSet.id, priceSet)
      }

      const calculatedPrices = await this.calculatePrices(
        { id: priceSets.map((p) => p.id) },
        { context: pricingContext },
        sharedContext
      )

      for (const calculatedPrice of calculatedPrices) {
        const priceSet = priceSetMap.get(calculatedPrice.id)
        priceSet.calculated_price = calculatedPrice
      }
    }

    return priceSets
  }

  @InjectManager("baseRepository_")
  async listAndCount(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PriceSetDTO[], number]> {
    const pricingContext = this.setupCalculatedPriceConfig_(filters, config)

    const [priceSets, count] = await super.listAndCount(
      filters,
      config,
      sharedContext
    )

    if (pricingContext && priceSets.length) {
      const priceSetIds: string[] = []
      const priceSetMap = new Map()
      for (const priceSet of priceSets) {
        priceSetIds.push(priceSet.id)
        priceSetMap.set(priceSet.id, priceSet)
      }

      const calculatedPrices = await this.calculatePrices(
        { id: priceSets.map((p) => p.id) },
        { context: pricingContext },
        sharedContext
      )

      for (const calculatedPrice of calculatedPrices) {
        const priceSet = priceSetMap.get(calculatedPrice.id)
        priceSet.calculated_price = calculatedPrice
      }
    }

    return [priceSets, count]
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

          // TODO: inject custom price selection here

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
              id: calculatedPrice?.id || null,
              price_list_id: calculatedPrice?.price_list_id || null,
              price_list_type: calculatedPrice?.price_list_type || null,
              min_quantity:
                parseInt(calculatedPrice?.min_quantity || "") || null,
              max_quantity:
                parseInt(calculatedPrice?.max_quantity || "") || null,
            },

            original_price: {
              id: originalPrice?.id || null,
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

    // TODO: Remove the need to refetch the data here
    const dbPriceSets = await this.list(
      { id: priceSets.map((p) => p.id) },
      { relations: ["rule_types", "prices", "price_rules"] },
      sharedContext
    )

    // Ensure the output to be in the same order as the input
    const results = priceSets.map((priceSet) => {
      return dbPriceSets.find((p) => p.id === priceSet.id)!
    })

    return await this.baseRepository_.serialize<PriceSetDTO[] | PriceSetDTO>(
      Array.isArray(data) ? results : results[0]
    )
  }

  async upsert(
    data: UpsertPriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>
  async upsert(
    data: UpsertPriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

  @InjectManager("baseRepository_")
  async upsert(
    data: UpsertPriceSetDTO | UpsertPriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO | PriceSetDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (priceSet): priceSet is UpdatePriceSetInput => !!priceSet.id
    )
    const forCreate = input.filter(
      (priceSet): priceSet is CreatePriceSetDTO => !priceSet.id
    )

    const operations: Promise<PriceSet[]>[] = []

    if (forCreate.length) {
      operations.push(this.create_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.update_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()
    return await this.baseRepository_.serialize<PriceSetDTO[] | PriceSetDTO>(
      Array.isArray(data) ? result : result[0]
    )
  }

  async update(
    id: string,
    data: PricingTypes.UpdatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>
  async update(
    selector: PricingTypes.FilterablePriceSetProps,
    data: PricingTypes.UpdatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  @InjectManager("baseRepository_")
  async update(
    idOrSelector: string | PricingTypes.FilterablePriceSetProps,
    data: PricingTypes.UpdatePriceSetDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO | PriceSetDTO[]> {
    let normalizedInput: UpdatePriceSetInput[] = []
    if (isString(idOrSelector)) {
      // Check if the ID exists, it will throw if not.
      await this.priceSetService_.retrieve(idOrSelector, {}, sharedContext)
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const priceSets = await this.priceSetService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = priceSets.map((priceSet) => ({
        id: priceSet.id,
        ...data,
      }))
    }

    const updateResult = await this.update_(normalizedInput, sharedContext)
    const priceSets = await this.baseRepository_.serialize<
      PriceSetDTO[] | PriceSetDTO
    >(updateResult)

    return isString(idOrSelector) ? priceSets[0] : priceSets
  }

  private async normalizeUpdateData(
    data: UpdatePriceSetInput[],
    sharedContext
  ) {
    const ruleAttributes = data
      .map((d) => d.prices?.map((p) => Object.keys(p.rules ?? [])) ?? [])
      .flat(Infinity)
      .filter(Boolean)

    const ruleTypes = await this.ruleTypeService_.list(
      { rule_attribute: ruleAttributes },
      { take: null },
      sharedContext
    )

    const ruleTypeMap = ruleTypes.reduce((acc, curr) => {
      acc.set(curr.rule_attribute, curr)
      return acc
    }, new Map())

    return data.map((priceSet) => {
      const prices = priceSet.prices?.map((price) => {
        const rules = Object.entries(price.rules ?? {}).map(
          ([attribute, value]) => {
            return {
              price_set_id: priceSet.id,
              rule_type_id: ruleTypeMap.get(attribute)!.id,
              value,
            }
          }
        )
        const hasRulesInput = isPresent(price.rules)
        delete price.rules
        return {
          ...price,
          price_set_id: priceSet.id,
          price_rules: hasRulesInput ? rules : undefined,
          rules_count: hasRulesInput ? rules.length : undefined,
        }
      })

      return {
        ...priceSet,
        prices,
      }
    })
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    data: UpdatePriceSetInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSet[]> {
    // TODO: We are not handling rule types, rules, etc. here, add support after data models are finalized
    // TODO: Since money IDs are rarely passed, this will delete all previous data and insert new entries.
    // We can make the `insert` inside upsertWithReplace do an `upsert` instead to avoid this
    const normalizedData = await this.normalizeUpdateData(data, sharedContext)

    const prices = normalizedData.flatMap((priceSet) => priceSet.prices || [])
    const { entities: upsertedPrices } =
      await this.priceService_.upsertWithReplace(
        prices,
        {
          relations: ["price_rules"],
        },
        sharedContext
      )

    const priceSetsToUpsert = normalizedData.map((priceSet) => {
      const { prices, ...rest } = priceSet
      return {
        ...rest,
        prices: upsertedPrices
          .filter((p) => p.price_set_id === priceSet.id)
          .map((price) => {
            // @ts-ignore
            delete price.price_rules
            return price
          }),
      }
    })

    const { entities: priceSets } =
      await this.priceSetService_.upsertWithReplace(
        priceSetsToUpsert,
        { relations: ["prices"] },
        sharedContext
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

    const dbPriceSets = await this.list(
      { id: priceSets.map(({ id }) => id) },
      { relations: ["rule_types"] }
    )

    const orderedPriceSets = priceSets.map((priceSet) => {
      return dbPriceSets.find((p) => p.id === priceSet.id)!
    })

    return Array.isArray(data) ? orderedPriceSets : orderedPriceSets[0]
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

    const dbPrices = await this.list(
      { id: input.map((d) => d.priceSetId) },
      { relations: ["prices"] },
      sharedContext
    )

    const orderedPriceSets = input.map((inputItem) => {
      return dbPrices.find((p) => p.id === inputItem.priceSetId)!
    })

    return Array.isArray(data) ? orderedPriceSets : orderedPriceSets[0]
  }

  @InjectTransactionManager("baseRepository_")
  async removeRules(
    data: PricingTypes.RemovePriceSetRulesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    const priceSets = await this.priceSetService_.list(
      { id: data.map((d) => d.id) },
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
      { price_set_id: priceSetIds, rule_type_id: ruleTypeIds },
      { take: null },
      sharedContext
    )

    const priceRules = await this.priceRuleService_.list(
      { price_set_id: priceSetIds, rule_type_id: ruleTypeIds },
      { select: ["price"], take: null },
      sharedContext
    )

    await this.priceSetRuleTypeService_.delete(
      priceSetRuleTypes.map((psrt) => psrt.id),
      sharedContext
    )

    await this.priceService_.delete(
      priceRules.map((pr) => pr.price.id),
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async createPriceLists(
    data: PricingTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.createPriceLists_(data, sharedContext)

    return await this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists
    )
  }

  @InjectTransactionManager("baseRepository_")
  async updatePriceLists(
    data: PricingTypes.UpdatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.updatePriceLists_(data, sharedContext)

    return await this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
      priceLists
    )
  }

  @InjectManager("baseRepository_")
  async updatePriceListPrices(
    data: PricingTypes.UpdatePriceListPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceDTO[]> {
    const prices = await this.updatePriceListPrices_(data, sharedContext)

    return await this.baseRepository_.serialize<PricingTypes.PriceDTO[]>(prices)
  }

  @InjectManager("baseRepository_")
  async removePrices(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.removePrices_(ids, sharedContext)
  }

  @InjectManager("baseRepository_")
  async addPriceListPrices(
    data: PricingTypes.AddPriceListPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceDTO[]> {
    const prices = await this.addPriceListPrices_(data, sharedContext)

    return await this.baseRepository_.serialize<PricingTypes.PriceDTO[]>(prices)
  }

  @InjectManager("baseRepository_")
  async setPriceListRules(
    data: PricingTypes.SetPriceListRulesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const [priceList] = await this.setPriceListRules_([data], sharedContext)

    return await this.baseRepository_.serialize<PricingTypes.PriceListDTO>(
      priceList
    )
  }

  @InjectManager("baseRepository_")
  async removePriceListRules(
    data: PricingTypes.RemovePriceListRulesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const [priceList] = await this.removePriceListRules_([data], sharedContext)

    return await this.baseRepository_.serialize<PricingTypes.PriceListDTO>(
      priceList
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: PricingTypes.CreatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]

    const ruleAttributes = deduplicate(
      data.map((d) => d.rules?.map((r) => r.rule_attribute) ?? []).flat()
    )

    const ruleTypes = await this.ruleTypeService_.list(
      { rule_attribute: ruleAttributes },
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

    const ruleSetRuleTypeToCreateMap: Map<string, TPriceSetRuleType> = new Map()

    const toCreate = input.map((inputData) => {
      const id = generateEntityId(
        (inputData as unknown as TPriceSet).id,
        PriceSetIdPrefix
      )

      const { prices, rules = [], ...rest } = inputData

      let pricesData: CreatePricesDTO[] = []

      rules.forEach((rule) => {
        const priceSetRuleType = {
          rule_type_id: ruleTypeMap.get(rule.rule_attribute).id,
          price_set_id: id,
        } as TPriceSetRuleType

        ruleSetRuleTypeToCreateMap.set(
          JSON.stringify(priceSetRuleType),
          priceSetRuleType
        )
      })

      if (inputData.prices) {
        pricesData = inputData.prices.map((price) => {
          let { rules: priceRules = {}, ...rest } = price
          const cleanRules = priceRules ? removeNullish(priceRules) : {}
          const numberOfRules = Object.keys(cleanRules).length

          const rulesDataMap = new Map()

          Object.entries(priceRules).map(([attribute, value]) => {
            const rule = {
              price_set_id: id,
              rule_type_id: ruleTypeMap.get(attribute).id,
              value,
            }
            rulesDataMap.set(JSON.stringify(rule), rule)

            const priceSetRuleType = {
              rule_type_id: ruleTypeMap.get(attribute).id,
              price_set_id: id,
            } as TPriceSetRuleType

            ruleSetRuleTypeToCreateMap.set(
              JSON.stringify(priceSetRuleType),
              priceSetRuleType
            )
          })

          return {
            ...rest,
            title: "", // TODO: accept title
            rules_count: numberOfRules,
            price_rules: Array.from(rulesDataMap.values()),
          }
        })
      }

      return {
        ...rest,
        id,
        prices: pricesData,
      }
    })

    // Bulk create price sets
    const createdPriceSets = await this.priceSetService_.create(
      toCreate,
      sharedContext
    )

    if (ruleSetRuleTypeToCreateMap.size) {
      await this.priceSetRuleTypeService_.create(
        Array.from(ruleSetRuleTypeToCreateMap.values()),
        sharedContext
      )
    }

    return createdPriceSets
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
          .map((data) => data.rules.map((r) => r.attribute))
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

    inputs.forEach((data) => {
      for (const rule of data.rules) {
        if (priceSetRuleTypeMap.get(data.priceSetId)!.has(rule.attribute)) {
          continue
        }

        priceSetRuleTypesCreate.push({
          rule_type_id: ruleTypeMap.get(rule.attribute)!.id,
          price_set_id: priceSetMap.get(data.priceSetId)!.id,
        })
      }
    })

    await this.priceSetRuleTypeService_.create(
      priceSetRuleTypesCreate,
      sharedContext
    )

    return priceSets
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

    const pricesToCreate: PricingTypes.CreatePriceDTO[] = input.flatMap(
      ({ priceSetId, prices }) =>
        prices.map((price) => {
          const numberOfRules = Object.entries(price?.rules ?? {}).length

          const priceRules = Object.entries(price.rules ?? {}).map(
            ([attribute, value]) => ({
              rule_type_id: ruleTypeMap.get(priceSetId)!.get(attribute)!.id,
              price_set_id: priceSetId,
              value,
            })
          )

          return {
            ...price,
            price_set_id: priceSetId,
            title: "test", // TODO: accept title
            rules_count: numberOfRules,
            priceRules,
          }
        })
    )

    await this.priceService_.create(pricesToCreate, sharedContext)
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
      { take: null },
      sharedContext
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

    const priceListsToCreate: PricingTypes.CreatePriceListDTO[] = data.map(
      (priceListData) => {
        const id = generateEntityId(
          (priceListData as unknown as TPriceList).id,
          PriceListIdPrefix
        )

        const { prices = [], rules = {}, ...rest } = priceListData

        validatePriceListDates(priceListData)

        const priceListRules = Object.entries(rules).map(
          ([attribute, value]) => {
            const ruleType = ruleTypeMap.get(attribute)!
            return {
              price_list_id: id,
              rule_type_id: ruleType.id,
              price_list_rule_values: value.map((v) => ({ value: v })),
            }
          }
        )

        const pricesData = prices.map((price) => {
          const priceRules = Object.entries(price.rules ?? {}).map(
            ([ruleAttribute, ruleValue]) => {
              return {
                price_set_id: price.price_set_id,
                rule_type_id: ruleTypeMap.get(ruleAttribute)!?.id,
                value: ruleValue,
              }
            }
          )

          return {
            price_list_id: id,
            title: "test",
            rules_count: Object.keys(price.rules ?? {}).length,
            price_rules: priceRules,
            ...price,
          }
        })

        return {
          id,
          ...rest,
          rules_count: Object.keys(rules).length,
          price_list_rules: priceListRules,
          prices: pricesData,
        }
      }
    )

    return await this.priceListService_.create(
      priceListsToCreate,
      sharedContext
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
      { id: priceListRuleIds },
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
      { rule_attribute: ruleAttributes },
      { take: null },
      sharedContext
    )

    const ruleTypeMap: Map<string, RuleTypeDTO> = new Map(
      ruleTypes.map((rt) => [rt.rule_attribute, rt])
    )

    for (const priceListData of data) {
      const { rules, ...priceListOnlyData } = priceListData

      const updatePriceListData: any = {
        ...priceListOnlyData,
      }

      validatePriceListDates(updatePriceListData)

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
            [{ name: ruleAttribute, rule_attribute: ruleAttribute }],
            sharedContext
          )

          ruleTypeMap.set(ruleAttribute, ruleType)
        }

        const [priceListRule] = await this.priceListRuleService_.create(
          [
            {
              price_list_id: updatedPriceList.id,
              rule_type_id: ruleType?.id,
            },
          ],
          sharedContext
        )

        for (const ruleValue of ruleValues) {
          await this.priceListRuleValueService_.create(
            [{ price_list_rule_id: priceListRule.id, value: ruleValue }],
            sharedContext
          )
        }
      }
    }

    return updatedPriceLists
  }

  @InjectTransactionManager("baseRepository_")
  protected async updatePriceListPrices_(
    data: PricingTypes.UpdatePriceListPricesDTO[],
    sharedContext: Context = {}
  ): Promise<TPrice[]> {
    const ruleTypeAttributes: string[] = []
    const priceListIds: string[] = []
    const priceIds: string[] = []
    const priceSetIds = data
      .map((d) => d.prices.map((price) => price.price_set_id))
      .flat()

    for (const priceListData of data) {
      priceListIds.push(priceListData.price_list_id)

      for (const price of priceListData.prices) {
        priceIds.push(price.id)
        ruleTypeAttributes.push(...Object.keys(price.rules || {}))
      }
    }

    const prices = await this.listPrices(
      { id: priceIds },
      { take: null, relations: ["price_rules"] },
      sharedContext
    )

    const priceMap: Map<string, PricingTypes.PriceDTO> = new Map(
      prices.map((price) => [price.id, price])
    )

    const ruleTypes = await this.listRuleTypes(
      { rule_attribute: ruleTypeAttributes },
      { take: null },
      sharedContext
    )

    const ruleTypeMap: Map<string, RuleTypeDTO> = new Map(
      ruleTypes.map((rt) => [rt.rule_attribute, rt])
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
        for (const ruleAttribute of Object.keys(price.rules ?? {})) {
          if (
            !priceSetRuleTypeMap.get(price.price_set_id)?.has(ruleAttribute)
          ) {
            ruleTypeErrors.push(
              `rule_attribute "${ruleAttribute}" in price set ${price.price_set_id}`
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

    const priceLists = await this.listPriceLists(
      { id: priceListIds },
      { take: null },
      sharedContext
    )

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))

    const pricesToUpdate: Partial<TPrice>[] = []
    const priceRuleIdsToDelete: string[] = []
    const priceRulesToCreate: CreatePriceRuleDTO[] = []

    for (const { price_list_id: priceListId, prices } of data) {
      const priceList = priceListMap.get(priceListId)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${priceListId} not found`
        )
      }

      for (const priceData of prices) {
        const { rules = {}, price_set_id, ...rest } = priceData
        const price = priceMap.get(rest.id)!
        const priceRules = price.price_rules!

        priceRulesToCreate.push(
          ...Object.entries(rules).map(([ruleAttribute, ruleValue]) => ({
            price_set_id,
            rule_type_id: ruleTypeMap.get(ruleAttribute)!.id,
            value: ruleValue,
            price_id: price.id,
          }))
        )

        pricesToUpdate.push({
          ...rest,
          rules_count: Object.keys(rules).length,
        } as unknown as TPrice)

        priceRuleIdsToDelete.push(...priceRules.map((pr) => pr.id))
      }
    }

    const [_deletedPriceRule, _createdPriceRule, updatedPrices] =
      await promiseAll([
        this.priceRuleService_.delete(priceRuleIdsToDelete),
        this.priceRuleService_.create(priceRulesToCreate),
        this.priceService_.update(pricesToUpdate),
      ])

    return updatedPrices
  }

  @InjectTransactionManager("baseRepository_")
  protected async removePrices_(
    ids: string[],
    sharedContext: Context = {}
  ): Promise<void> {
    await this.priceService_.delete(ids, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async addPriceListPrices_(
    data: PricingTypes.AddPriceListPricesDTO[],
    sharedContext: Context = {}
  ): Promise<TPrice[]> {
    const ruleTypeAttributes: string[] = []
    const priceListIds: string[] = []
    const priceSetIds: string[] = []

    for (const priceListData of data) {
      priceListIds.push(priceListData.price_list_id)

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

    const pricesToCreate: Partial<TPrice>[] = []

    for (const { price_list_id: priceListId, prices } of data) {
      const priceList = priceListMap.get(priceListId)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${priceListId} not found`
        )
      }

      const priceListPricesToCreate = prices.map((priceData) => {
        const priceRules = priceData.rules || {}
        const noOfRules = Object.keys(priceRules).length

        const priceRulesToCreate = Object.entries(priceRules).map(
          ([ruleAttribute, ruleValue]) => {
            return {
              price_set_id: priceData.price_set_id,
              rule_type_id: ruleTypeMap.get(ruleAttribute)!?.id,
              value: ruleValue,
            }
          }
        )

        return {
          ...priceData,
          price_set_id: priceData.price_set_id,
          title: "test",
          price_list_id: priceList.id,
          rules_count: noOfRules,
          price_rules: priceRulesToCreate,
        } as unknown as TPrice
      })

      pricesToCreate.push(...priceListPricesToCreate)
    }

    return await this.priceService_.create(pricesToCreate, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  protected async setPriceListRules_(
    data: PricingTypes.SetPriceListRulesDTO[],
    sharedContext: Context = {}
  ): Promise<TPriceList[]> {
    // TODO: re think this method

    const priceLists = await this.priceListService_.list(
      { id: data.map((d) => d.price_list_id) },
      { relations: ["price_list_rules", "price_list_rules.rule_type"] },
      sharedContext
    )

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))
    const ruleTypes = await this.listRuleTypes(
      { rule_attribute: data.map((d) => Object.keys(d.rules)).flat() },
      { take: null }
    )

    const ruleTypeMap = new Map(ruleTypes.map((rt) => [rt.rule_attribute, rt]))

    const ruleIdsToUpdate: string[] = []
    const rulesToCreate: CreatePriceListRuleDTO[] = []
    const priceRuleValues = new Map<string, Map<string, string[]>>()

    for (const { price_list_id: priceListId, rules } of data) {
      const priceList = priceListMap.get(priceListId)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${priceListId} not found`
        )
      }

      const priceListRulesMap: Map<string, PriceListRule> = new Map(
        priceList.price_list_rules.map((p) => [p.rule_type.rule_attribute, p])
      )

      const priceListRuleValues = new Map<string, string[]>()

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
            rule_type_id: ruleType.id,
            price_list_id: priceListId,
          })
        } else {
          ruleIdsToUpdate.push(rule.id)
        }
      })

      priceRuleValues.set(priceListId, priceListRuleValues)
    }

    const [createdRules, priceListValuesToDelete] = await promiseAll([
      this.priceListRuleService_.create(rulesToCreate),
      this.priceListRuleValueService_.list(
        { price_list_rule_id: ruleIdsToUpdate },
        { take: null }
      ),
    ])

    const priceListRuleValuesToCreate: unknown[] = []

    for (const { id, price_list_id, rule_type_id } of createdRules) {
      const ruleValues = priceRuleValues.get(price_list_id)

      if (!ruleValues) {
        continue
      }

      const values = ruleValues.get(rule_type_id)

      if (!values) {
        continue
      }

      values.forEach((v) => {
        priceListRuleValuesToCreate.push({
          price_list_rule_id: id,
          value: v,
        })
      })
    }

    await promiseAll([
      this.priceListRuleValueService_.delete(
        priceListValuesToDelete.map((p) => p.id),
        sharedContext
      ),
      this.priceListRuleValueService_.create(
        priceListRuleValuesToCreate,
        sharedContext
      ),
    ])

    return priceLists
  }

  @InjectTransactionManager("baseRepository_")
  protected async removePriceListRules_(
    data: PricingTypes.RemovePriceListRulesDTO[],
    sharedContext: Context = {}
  ): Promise<TPriceList[]> {
    const priceLists = await this.priceListService_.list(
      { id: data.map((d) => d.price_list_id) },
      { relations: ["price_list_rules", "price_list_rules.rule_type"] },
      sharedContext
    )

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))
    const idsToDelete: string[] = []

    for (const { price_list_id: priceListId, rules } of data) {
      const priceList = priceListMap.get(priceListId)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${priceListId} not found`
        )
      }

      const priceListRulesMap: Map<string, PriceListRule> = new Map(
        priceList.price_list_rules.map((p) => [p.rule_type.rule_attribute, p])
      )

      rules.map(async (rule_attribute) => {
        const rule = priceListRulesMap.get(rule_attribute)

        if (rule) {
          idsToDelete.push(rule.id)
        }
      })
    }

    await this.priceListRuleService_.delete(idsToDelete)

    return priceLists
  }
}
