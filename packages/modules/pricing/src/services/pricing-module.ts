import {
  AddPricesDTO,
  Context,
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
  UpsertPriceSetDTO,
} from "@medusajs/types"
import {
  arrayDifference,
  EmitEvents,
  GetIsoStringFromDate,
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
  simpleHash,
} from "@medusajs/utils"

import { Price, PriceList, PriceListRule, PriceRule, PriceSet } from "@models"

import { ServiceTypes } from "@types"
import { eventBuilders, validatePriceListDates } from "@utils"
import { joinerConfig } from "../joiner-config"
import { CreatePriceListDTO, UpsertPriceDTO } from "src/types/services"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  pricingRepository: PricingRepositoryService
  priceSetService: ModulesSdkTypes.IMedusaInternalService<any>
  priceRuleService: ModulesSdkTypes.IMedusaInternalService<any>
  priceService: ModulesSdkTypes.IMedusaInternalService<any>
  priceListService: ModulesSdkTypes.IMedusaInternalService<any>
  priceListRuleService: ModulesSdkTypes.IMedusaInternalService<any>
}

const generateMethodForModels = {
  PriceSet,
  PriceList,
  PriceListRule,
  PriceRule,
  Price,
}

export default class PricingModuleService
  extends ModulesSdkUtils.MedusaService<{
    PriceSet: { dto: PricingTypes.PriceSetDTO }
    Price: { dto: PricingTypes.PriceDTO }
    PriceRule: {
      dto: PricingTypes.PriceRuleDTO
      create: PricingTypes.CreatePriceRuleDTO
      update: PricingTypes.UpdatePriceRuleDTO
    }
    PriceList: { dto: PricingTypes.PriceListDTO }
    PriceListRule: { dto: PricingTypes.PriceListRuleDTO }
  }>(generateMethodForModels)
  implements PricingTypes.IPricingModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected readonly pricingRepository_: PricingRepositoryService
  protected readonly priceSetService_: ModulesSdkTypes.IMedusaInternalService<PriceSet>
  protected readonly priceRuleService_: ModulesSdkTypes.IMedusaInternalService<PriceRule>
  protected readonly priceService_: ModulesSdkTypes.IMedusaInternalService<Price>
  protected readonly priceListService_: ModulesSdkTypes.IMedusaInternalService<PriceList>
  protected readonly priceListRuleService_: ModulesSdkTypes.IMedusaInternalService<PriceListRule>

  constructor(
    {
      baseRepository,
      pricingRepository,
      priceSetService,
      priceRuleService,
      priceService,
      priceListService,
      priceListRuleService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.pricingRepository_ = pricingRepository
    this.priceSetService_ = priceSetService
    this.priceRuleService_ = priceRuleService
    this.priceService_ = priceService
    this.priceListService_ = priceListService
    this.priceListRuleService_ = priceListRuleService
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
  // @ts-expect-error
  async retrievePriceSet(
    id: string,
    config?: FindConfig<PriceSetDTO> | undefined,
    sharedContext?: Context | undefined
  ): Promise<PriceSetDTO> {
    const priceSet = await this.priceSetService_.retrieve(
      id,
      this.normalizePriceSetConfig(config),
      sharedContext
    )

    return await this.baseRepository_.serialize<PriceSetDTO>(priceSet)
  }

  @InjectManager("baseRepository_")
  // @ts-expect-error
  async listPriceSets(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO[]> {
    const normalizedConfig = this.normalizePriceSetConfig(config)
    const pricingContext = this.setupCalculatedPriceConfig_(
      filters,
      normalizedConfig
    )

    const priceSets = await super.listPriceSets(
      filters,
      normalizedConfig,
      sharedContext
    )
    if (!pricingContext || !priceSets.length) {
      return priceSets
    }

    const calculatedPrices = await this.calculatePrices(
      { id: priceSets.map((p) => p.id) },
      { context: pricingContext },
      sharedContext
    )

    const calculatedPricesMap = new Map()
    for (const calculatedPrice of calculatedPrices) {
      calculatedPricesMap.set(calculatedPrice.id, calculatedPrice)
    }

    for (const priceSet of priceSets) {
      const calculatedPrice = calculatedPricesMap.get(priceSet.id)
      priceSet.calculated_price = calculatedPrice ?? null
    }

    return priceSets
  }

  @InjectManager("baseRepository_")
  // @ts-expect-error
  async listAndCountPriceSets(
    filters: PricingTypes.FilterablePriceSetProps = {},
    config: FindConfig<PricingTypes.PriceSetDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[PriceSetDTO[], number]> {
    const normalizedConfig = this.normalizePriceSetConfig(config)
    const pricingContext = this.setupCalculatedPriceConfig_(
      filters,
      normalizedConfig
    )

    const [priceSets, count] = await super.listAndCountPriceSets(
      filters,
      normalizedConfig,
      sharedContext
    )
    if (!pricingContext || !priceSets.length) {
      return [priceSets, count]
    }

    const calculatedPrices = await this.calculatePrices(
      { id: priceSets.map((p) => p.id) },
      { context: pricingContext },
      sharedContext
    )

    const calculatedPricesMap = new Map()
    for (const calculatedPrice of calculatedPrices) {
      calculatedPricesMap.set(calculatedPrice.id, calculatedPrice)
    }

    for (const priceSet of priceSets) {
      const calculatedPrice = calculatedPricesMap.get(priceSet.id)
      priceSet.calculated_price = calculatedPrice ?? null
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
      pricingFilters.id
        .map((priceSetId: string): PricingTypes.CalculatedPriceSet | null => {
          // This is where we select prices, for now we just do a first match based on the database results
          // which is prioritized by rules_count first for exact match and then deafult_priority of the rule_type

          // TODO: inject custom price selection here

          const prices = pricesSetPricesMap.get(priceSetId) || []
          if (!prices.length) {
            return null
          }

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
        })
        .filter(Boolean) as PricingTypes.CalculatedPriceSet[]

    return JSON.parse(JSON.stringify(calculatedPrices))
  }

  // @ts-expect-error
  async createPriceSets(
    data: PricingTypes.CreatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

  async createPriceSets(
    data: PricingTypes.CreatePriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createPriceSets(
    data: PricingTypes.CreatePriceSetDTO | PricingTypes.CreatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO | PriceSetDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const priceSets = await this.createPriceSets_(input, sharedContext)

    // TODO: Remove the need to refetch the data here
    const dbPriceSets = await this.listPriceSets(
      { id: priceSets.map((p) => p.id) },
      this.normalizePriceSetConfig({
        relations: ["prices", "prices.price_rules"],
      }),
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

  async upsertPriceSets(
    data: UpsertPriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>
  async upsertPriceSets(
    data: UpsertPriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

  @InjectManager("baseRepository_")
  async upsertPriceSets(
    data: UpsertPriceSetDTO | UpsertPriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO | PriceSetDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (priceSet): priceSet is ServiceTypes.UpdatePriceSetInput => !!priceSet.id
    )
    const forCreate = input.filter(
      (priceSet): priceSet is CreatePriceSetDTO => !priceSet.id
    )

    const operations: Promise<PriceSet[]>[] = []

    if (forCreate.length) {
      operations.push(this.createPriceSets_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.updatePriceSets_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()
    return await this.baseRepository_.serialize<PriceSetDTO[] | PriceSetDTO>(
      Array.isArray(data) ? result : result[0]
    )
  }

  // @ts-expect-error
  async updatePriceSets(
    id: string,
    data: PricingTypes.UpdatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>
  async updatePriceSets(
    selector: PricingTypes.FilterablePriceSetProps,
    data: PricingTypes.UpdatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  @InjectManager("baseRepository_")
  async updatePriceSets(
    idOrSelector: string | PricingTypes.FilterablePriceSetProps,
    data: PricingTypes.UpdatePriceSetDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO | PriceSetDTO[]> {
    let normalizedInput: ServiceTypes.UpdatePriceSetInput[] = []
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

    const updateResult = await this.updatePriceSets_(
      normalizedInput,
      sharedContext
    )
    const priceSets = await this.baseRepository_.serialize<
      PriceSetDTO[] | PriceSetDTO
    >(updateResult)

    return isString(idOrSelector) ? priceSets[0] : priceSets
  }

  @InjectTransactionManager("baseRepository_")
  protected async updatePriceSets_(
    data: ServiceTypes.UpdatePriceSetInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSet[]> {
    // TODO: Since money IDs are rarely passed, this will delete all previous data and insert new entries.
    // We can make the `insert` inside upsertWithReplace do an `upsert` instead to avoid this
    const normalizedData = await this.normalizeUpdateData(data)

    const prices = normalizedData.flatMap((priceSet) => priceSet.prices || [])
    const { entities: upsertedPrices } =
      await this.priceService_.upsertWithReplace(
        prices,
        { relations: ["price_rules"] },
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

  private async normalizeUpdateData(data: ServiceTypes.UpdatePriceSetInput[]) {
    return data.map((priceSet) => {
      return {
        ...priceSet,
        prices: this.normalizePrices(
          priceSet.prices?.map((p) => ({ ...p, price_set_id: priceSet.id })),
          []
        ),
      }
    })
  }

  private normalizePrices(
    data: CreatePricesDTO[] | undefined,
    existingPrices: PricingTypes.PriceDTO[],
    priceListId?: string | undefined
  ) {
    const pricesToUpsert = new Map<
      string,
      CreatePricesDTO & { price_rules?: CreatePriceRuleDTO[] }
    >()
    const existingPricesMap = new Map<string, PricingTypes.PriceDTO>()
    existingPrices?.forEach((price) => {
      existingPricesMap.set(hashPrice(price), price)
    })

    data?.forEach((price) => {
      const cleanRules = price.rules ? removeNullish(price.rules) : {}
      const ruleEntries = Object.entries(cleanRules)
      const rules = ruleEntries.map(([attribute, value]) => {
        return {
          attribute,
          value,
        }
      })

      const hasRulesInput = isPresent(price.rules)
      const entry = {
        ...price,
        price_list_id: priceListId,
        price_rules: hasRulesInput ? rules : undefined,
        rules_count: hasRulesInput ? ruleEntries.length : undefined,
      } as UpsertPriceDTO
      delete (entry as CreatePricesDTO).rules

      const entryHash = hashPrice(entry)

      // We want to keep the existing rules as they might already have ids, but any other data should come from the updated input
      const existing = existingPricesMap.get(entryHash)
      pricesToUpsert.set(entryHash, {
        ...entry,
        id: existing?.id ?? entry.id,
        price_rules: existing?.price_rules ?? entry.price_rules,
      })

      return entry
    })

    return Array.from(pricesToUpsert.values())
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
  @EmitEvents()
  async addPrices(
    data: AddPricesDTO | AddPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceSetDTO[] | PricingTypes.PriceSetDTO> {
    const input = Array.isArray(data) ? data : [data]

    await this.addPrices_(input, sharedContext)

    const dbPrices = await this.listPriceSets(
      { id: input.map((d) => d.priceSetId) },
      { relations: ["prices"] },
      sharedContext
    )

    const orderedPriceSets = input.map((inputItem) => {
      return dbPrices.find((p) => p.id === inputItem.priceSetId)!
    })

    return Array.isArray(data) ? orderedPriceSets : orderedPriceSets[0]
  }

  @InjectManager("baseRepository_")
  @EmitEvents()
  // @ts-ignore
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
  // @ts-ignore
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
  @EmitEvents()
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
  protected async createPriceSets_(
    data: PricingTypes.CreatePriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]

    const toCreate = input.map((inputData) => {
      const entry = {
        ...inputData,
        prices: this.normalizePrices(inputData.prices, []),
      }
      return entry
    })

    // Bulk create price sets
    const createdPriceSets = await this.priceSetService_.create(
      toCreate,
      sharedContext
    )

    const eventsData = createdPriceSets.reduce(
      (eventsData, priceSet) => {
        eventsData.priceSets.push({
          id: priceSet.id,
        })

        priceSet.prices.map((price) => {
          eventsData.prices.push({
            id: price.id,
          })
          price.price_rules.map((priceRule) => {
            eventsData.priceRules.push({
              id: priceRule.id,
            })
          })
        })

        return eventsData
      },
      {
        priceSets: [],
        priceRules: [],
        prices: [],
      } as {
        priceSets: { id: string }[]
        priceRules: { id: string }[]
        prices: { id: string }[]
      }
    )

    eventBuilders.createdPriceSet({
      data: eventsData.priceSets,
      sharedContext,
    })
    eventBuilders.createdPrice({
      data: eventsData.prices,
      sharedContext,
    })
    eventBuilders.createdPriceRule({
      data: eventsData.priceRules,
      sharedContext,
    })

    return createdPriceSets
  }

  @InjectTransactionManager("baseRepository_")
  protected async addPrices_(
    input: AddPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const priceSets = await this.listPriceSets(
      { id: input.map((d) => d.priceSetId) },
      { take: null, relations: ["prices", "prices.price_rules"] },
      sharedContext
    )

    const existingPrices = priceSets
      .map((p) => p.prices)
      .flat() as PricingTypes.PriceDTO[]

    const pricesToUpsert = input
      .map((addPrice) =>
        this.normalizePrices(
          addPrice.prices?.map((p) => ({
            ...p,
            price_set_id: addPrice.priceSetId,
          })),
          existingPrices
        )
      )
      .filter(Boolean)
      .flat() as UpsertPriceDTO[]

    const priceSetMap = new Map<string, PriceSetDTO>(
      priceSets.map((p) => [p.id, p])
    )
    pricesToUpsert.forEach((price) => {
      const priceSet = priceSetMap.get(price.price_set_id)

      if (!priceSet) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price set with id: ${price.price_set_id} not found`
        )
      }
    })

    const { entities, performedActions } =
      await this.priceService_.upsertWithReplace(
        pricesToUpsert,
        { relations: ["price_rules"] },
        sharedContext
      )
    eventBuilders.createdPrice({
      data: performedActions.created[Price.name] ?? [],
      sharedContext,
    })
    eventBuilders.updatedPrice({
      data: performedActions.updated[Price.name] ?? [],
      sharedContext,
    })
    eventBuilders.deletedPrice({
      data: performedActions.deleted[Price.name] ?? [],
      sharedContext,
    })

    eventBuilders.createdPriceRule({
      data: performedActions.created[PriceRule.name] ?? [],
      sharedContext,
    })
    eventBuilders.updatedPriceRule({
      data: performedActions.updated[PriceRule.name] ?? [],
      sharedContext,
    })
    eventBuilders.deletedPriceRule({
      data: performedActions.deleted[PriceRule.name] ?? [],
      sharedContext,
    })

    return entities
  }

  @InjectTransactionManager("baseRepository_")
  protected async createPriceLists_(
    data: PricingTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const normalized = this.normalizePriceListDate(data)

    const priceListsToCreate: CreatePriceListDTO[] = normalized.map(
      (priceListData) => {
        const entry = {
          ...priceListData,
          rules: undefined,
        } as CreatePriceListDTO

        if (priceListData.prices) {
          entry.prices = this.normalizePrices(
            priceListData.prices,
            []
          ) as UpsertPriceDTO[]
        }

        if (priceListData.rules) {
          const cleanRules = priceListData.rules
            ? removeNullish(priceListData.rules)
            : {}
          const rules = Object.entries(cleanRules)
          const numberOfRules = rules.length

          const rulesDataMap = new Map()
          rules.map(([attribute, value]) => {
            const rule = {
              attribute,
              value,
            }
            rulesDataMap.set(JSON.stringify(rule), rule)
          })

          entry.price_list_rules = Array.from(rulesDataMap.values())
          entry.rules_count = numberOfRules
        }

        return entry
      }
    )

    const priceLists = await this.priceListService_.create(
      priceListsToCreate,
      sharedContext
    )

    /**
     * Preparing data for emitting events
     */
    const eventsData = priceLists.reduce(
      (eventsData, priceList) => {
        eventsData.priceList.push({
          id: priceList.id,
        })

        priceList.price_list_rules.map((listRule) => {
          eventsData.priceListRules.push({
            id: listRule.id,
          })
        })

        priceList.prices.map((price) => {
          eventsData.prices.push({
            id: price.id,
          })
          price.price_rules.map((priceRule) => {
            eventsData.priceRules.push({
              id: priceRule.id,
            })
          })
        })

        return eventsData
      },
      {
        priceList: [],
        priceListRules: [],
        priceRules: [],
        prices: [],
      } as {
        priceList: { id: string }[]
        priceListRules: { id: string }[]
        priceRules: { id: string }[]
        prices: { id: string }[]
      }
    )

    /**
     * Emitting events for all created entities
     */
    eventBuilders.createdPriceList({
      data: eventsData.priceList,
      sharedContext,
    })
    eventBuilders.createdPriceListRule({
      data: eventsData.priceListRules,
      sharedContext,
    })
    eventBuilders.createdPrice({
      data: eventsData.prices,
      sharedContext,
    })
    eventBuilders.createdPriceRule({
      data: eventsData.priceRules,
      sharedContext,
    })

    return priceLists
  }

  @InjectTransactionManager("baseRepository_")
  protected async updatePriceLists_(
    data: PricingTypes.UpdatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const existingPriceLists = await this.priceListService_.list(
      { id: data.map((d) => d.id) },
      {},
      sharedContext
    )

    if (existingPriceLists.length !== data.length) {
      const diff = arrayDifference(
        data.map((d) => d.id),
        existingPriceLists.map((p) => p.id)
      )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Price lists with ids: '${diff.join(", ")}' not found`
      )
    }

    const normalizedData = this.normalizePriceListDate(data).map(
      (priceList) => {
        const entry: Partial<CreatePriceListDTO> = {
          ...priceList,
          rules: undefined,
          price_list_rules: undefined,
        }

        if (typeof priceList.rules === "object") {
          const cleanRules = priceList.rules
            ? removeNullish(priceList.rules)
            : {}
          const rules = Object.entries(cleanRules)
          const numberOfRules = rules.length

          const rulesDataMap = new Map()
          rules.map(([attribute, value]) => {
            const rule = {
              attribute,
              value,
            }
            rulesDataMap.set(JSON.stringify(rule), rule)
          })

          entry.price_list_rules = Array.from(rulesDataMap.values())
          entry.rules_count = numberOfRules
        }

        return entry
      }
    )

    const { entities } = await this.priceListService_.upsertWithReplace(
      normalizedData,
      {
        relations: ["price_list_rules"],
      }
    )

    return entities
  }

  @InjectTransactionManager("baseRepository_")
  protected async updatePriceListPrices_(
    data: PricingTypes.UpdatePriceListPricesDTO[],
    sharedContext: Context = {}
  ): Promise<Price[]> {
    const priceLists = await this.listPriceLists(
      { id: data.map((p) => p.price_list_id) },
      { take: null, relations: ["prices", "prices.price_rules"] },
      sharedContext
    )

    const existingPrices = priceLists
      .map((p) => p.prices ?? [])
      .flat() as PricingTypes.PriceDTO[]

    const pricesToUpsert = data
      .map((addPrice) =>
        this.normalizePrices(
          addPrice.prices as UpsertPriceDTO[],
          existingPrices,
          addPrice.price_list_id
        )
      )
      .filter(Boolean)
      .flat() as UpsertPriceDTO[]

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))

    for (const { price_list_id: priceListId, prices } of data) {
      const priceList = priceListMap.get(priceListId)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${priceListId} not found`
        )
      }
    }

    const { entities } = await this.priceService_.upsertWithReplace(
      pricesToUpsert,
      { relations: ["price_rules"] },
      sharedContext
    )

    return entities
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
  ): Promise<Price[]> {
    const priceLists = await this.listPriceLists(
      { id: data.map((p) => p.price_list_id) },
      { take: null, relations: ["prices", "prices.price_rules"] },
      sharedContext
    )

    const existingPrices = priceLists
      .map((p) => p.prices ?? [])
      .flat() as PricingTypes.PriceDTO[]

    const pricesToUpsert = data
      .map((addPrice) =>
        this.normalizePrices(
          addPrice.prices,
          existingPrices,
          addPrice.price_list_id
        )
      )
      .filter(Boolean)
      .flat() as UpsertPriceDTO[]

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))
    pricesToUpsert.forEach((price) => {
      const priceList = priceListMap.get(price.price_list_id!)

      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Price list with id: ${price.price_list_id} not found`
        )
      }
    })

    const { entities, performedActions } =
      await this.priceService_.upsertWithReplace(
        pricesToUpsert,
        { relations: ["price_rules"] },
        sharedContext
      )

    eventBuilders.createdPrice({
      data: performedActions.created[Price.name] ?? [],
      sharedContext,
    })
    eventBuilders.updatedPrice({
      data: performedActions.updated[Price.name] ?? [],
      sharedContext,
    })
    eventBuilders.deletedPrice({
      data: performedActions.deleted[Price.name] ?? [],
      sharedContext,
    })

    eventBuilders.createdPriceRule({
      data: performedActions.created[PriceRule.name] ?? [],
      sharedContext,
    })
    eventBuilders.updatedPriceRule({
      data: performedActions.updated[PriceRule.name] ?? [],
      sharedContext,
    })
    eventBuilders.deletedPriceRule({
      data: performedActions.deleted[PriceRule.name] ?? [],
      sharedContext,
    })

    return entities
  }

  @InjectTransactionManager("baseRepository_")
  protected async setPriceListRules_(
    data: PricingTypes.SetPriceListRulesDTO[],
    sharedContext: Context = {}
  ): Promise<PriceList[]> {
    // TODO: re think this method
    const priceLists = await this.priceListService_.list(
      { id: data.map((d) => d.price_list_id) },
      {
        relations: ["price_list_rules"],
      },
      sharedContext
    )

    const rulesMap = new Map()
    data.forEach((rule) => {
      if (!rulesMap.has(rule.price_list_id)) {
        rulesMap.set(rule.price_list_id, [])
      }

      Object.entries(rule.rules).forEach(([key, value]) => {
        rulesMap.get(rule.price_list_id).push([key, value])
      })
    })

    const priceListsUpsert = priceLists
      .map((priceList) => {
        const allRules = new Map(
          priceList.price_list_rules
            .toArray()
            .map((r) => [r.attribute, r.value])
        )

        const rules = rulesMap.get(priceList.id)
        if (!rules?.length) {
          return
        }

        rules.forEach(([key, value]) => {
          allRules.set(key, value)
        })

        return {
          ...priceList,
          rules_count: allRules.size,
          price_list_rules: Array.from(allRules).map(([attribute, value]) => ({
            attribute,
            value,
          })),
        }
      })
      .filter(Boolean)

    const { entities } = await this.priceListService_.upsertWithReplace(
      priceListsUpsert,
      { relations: ["price_list_rules"] },
      sharedContext
    )

    return entities
  }

  @InjectTransactionManager("baseRepository_")
  protected async removePriceListRules_(
    data: PricingTypes.RemovePriceListRulesDTO[],
    sharedContext: Context = {}
  ): Promise<PriceList[]> {
    // TODO: re think this method
    const priceLists = await this.priceListService_.list(
      { id: data.map((d) => d.price_list_id) },
      {
        relations: ["price_list_rules"],
      },
      sharedContext
    )

    const rulesMap = new Map()
    data.forEach((rule) => {
      if (!rulesMap.has(rule.price_list_id)) {
        rulesMap.set(rule.price_list_id, [])
      }

      rule.rules.forEach((key) => {
        rulesMap.get(rule.price_list_id).push([key, undefined])
      })
    })

    const priceListsUpsert = priceLists
      .map((priceList) => {
        const allRules = new Map(
          priceList.price_list_rules
            .toArray()
            .map((r) => [r.attribute, r.value])
        )

        const rules = rulesMap.get(priceList.id)
        if (!rules?.length) {
          return
        }

        rules.forEach(([key, value]) => {
          allRules.set(key, value)
        })

        return {
          ...priceList,
          rules_count: allRules.size,
          price_list_rules: Array.from(allRules)
            .map(([attribute, value]) => ({
              attribute,
              value,
            }))
            .filter((r) => !!r.value),
        }
      })
      .filter(Boolean)

    const { entities } = await this.priceListService_.upsertWithReplace(
      priceListsUpsert,
      { relations: ["price_list_rules"] },
      sharedContext
    )

    return entities
  }

  protected normalizePriceListDate(
    data: (
      | ServiceTypes.UpdatePriceListDTO
      | ServiceTypes.CreatePriceListDTO
      | CreatePriceListDTO
    )[]
  ) {
    return data.map((priceListData: any) => {
      validatePriceListDates(priceListData)

      if (!!priceListData.starts_at) {
        priceListData.starts_at = GetIsoStringFromDate(priceListData.starts_at)
      }

      if (!!priceListData.ends_at) {
        priceListData.ends_at = GetIsoStringFromDate(priceListData.ends_at)
      }

      return priceListData
    })
  }

  protected normalizePriceSetConfig(
    config: FindConfig<PricingTypes.PriceSetDTO> | undefined
  ) {
    return {
      options: {
        populateWhere: { prices: { price_list_id: null } },
      },
      ...config,
    }
  }
}

const hashPrice = (
  price: PricingTypes.PriceDTO | PricingTypes.CreatePricesDTO
): string => {
  const data = Object.entries({
    currency_code: price.currency_code,
    price_set_id: "price_set_id" in price ? price.price_set_id ?? null : null,
    price_list_id:
      "price_list_id" in price ? price.price_list_id ?? null : null,
    min_quantity: price.min_quantity ? price.min_quantity.toString() : null,
    max_quantity: price.max_quantity ? price.max_quantity.toString() : null,
    ...("price_rules" in price
      ? price.price_rules?.reduce((agg, pr) => {
          agg[pr.attribute] = pr.value
          return agg
        }, {})
      : {}),
  }).sort(([a], [b]) => a.localeCompare(b))

  return simpleHash(JSON.stringify(data))
}
