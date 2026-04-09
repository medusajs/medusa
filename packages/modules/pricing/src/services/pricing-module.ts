import {
  AddPricesDTO,
  Context,
  CreatePricePreferenceDTO,
  CreatePriceRuleDTO,
  CreatePricesDTO,
  CreatePriceSetDTO,
  DAL,
  FindConfig,
  InferEntityType,
  InternalModuleDeclaration,
  MedusaContainer,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  PricePreferenceDTO,
  PriceSetDTO,
  PricingContext,
  PricingFilters,
  PricingRepositoryService,
  PricingRuleOperatorValues,
  PricingTypes,
  UpsertPricePreferenceDTO,
  UpsertPriceSetDTO,
} from "@medusajs/framework/types"
import {
  arrayDifference,
  deduplicate,
  EmitEvents,
  GetIsoStringFromDate,
  groupBy,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isPresent,
  isString,
  MathBN,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  PriceListType,
  PricingRuleOperator,
  promiseAll,
  removeNullish,
} from "@medusajs/framework/utils"

import {
  Price,
  PriceList,
  PriceListRule,
  PricePreference,
  PriceRule,
  PriceSet,
} from "@models"

import { Collection } from "@medusajs/framework/mikro-orm/core"
import { ServiceTypes } from "@types"
import { validatePriceListDates } from "@utils"
import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  pricingRepository: PricingRepositoryService
  priceSetService: ModulesSdkTypes.IMedusaInternalService<any>
  priceRuleService: ModulesSdkTypes.IMedusaInternalService<any>
  priceService: ModulesSdkTypes.IMedusaInternalService<any>
  priceListService: ModulesSdkTypes.IMedusaInternalService<any>
  pricePreferenceService: ModulesSdkTypes.IMedusaInternalService<any>
  priceListRuleService: ModulesSdkTypes.IMedusaInternalService<any>
}

const generateMethodForModels = {
  PriceSet,
  PriceList,
  PriceListRule,
  PriceRule,
  Price,
  PricePreference,
}

const BaseClass = ModulesSdkUtils.MedusaService<{
  PriceSet: { dto: PricingTypes.PriceSetDTO }
  Price: { dto: PricingTypes.PriceDTO }
  PriceRule: {
    dto: PricingTypes.PriceRuleDTO
    create: PricingTypes.CreatePriceRuleDTO
    update: PricingTypes.UpdatePriceRuleDTO
  }
  PriceList: { dto: PricingTypes.PriceListDTO }
  PriceListRule: { dto: PricingTypes.PriceListRuleDTO }
  // PricePreference: { dto: PricingTypes.PricePreferenceDTO }
  PricePreference: { dto: any }
}>(generateMethodForModels)

export default class PricingModuleService
  extends BaseClass
  implements PricingTypes.IPricingModuleService
{
  protected readonly container_: MedusaContainer
  protected baseRepository_: DAL.RepositoryService
  protected readonly pricingRepository_: PricingRepositoryService & {
    clearAvailableAttributes?: () => Promise<void>
  }
  protected readonly priceSetService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof PriceSet>
  >
  protected readonly priceRuleService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof PriceRule>
  >
  protected readonly priceService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Price>
  >
  protected readonly priceListService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof PriceList>
  >
  protected readonly priceListRuleService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof PriceListRule>
  >
  protected readonly pricePreferenceService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof PricePreference>
  >

  constructor(
    {
      baseRepository,
      pricingRepository,
      priceSetService,
      priceRuleService,
      priceService,
      pricePreferenceService,
      priceListService,
      priceListRuleService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.container_ = arguments[0]
    this.baseRepository_ = baseRepository
    this.pricingRepository_ = pricingRepository
    this.priceSetService_ = priceSetService
    this.priceRuleService_ = priceRuleService
    this.priceService_ = priceService
    this.pricePreferenceService_ = pricePreferenceService
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

  @InjectTransactionManager()
  @EmitEvents()
  // @ts-expect-error
  async createPriceRules(
    ...args: Parameters<PricingTypes.IPricingModuleService["createPriceRules"]>
  ): Promise<PricingTypes.PriceRuleDTO | PricingTypes.PriceRuleDTO[]> {
    try {
      return await super.createPriceRules(...args)
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectTransactionManager()
  @EmitEvents()
  // @ts-expect-error
  async updatePriceRules(
    ...args: Parameters<PricingTypes.IPricingModuleService["updatePriceRules"]>
  ): Promise<PricingTypes.PriceRuleDTO | PricingTypes.PriceRuleDTO[]> {
    try {
      return await super.updatePriceRules(...args)
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectTransactionManager()
  @EmitEvents()
  // @ts-expect-error
  async createPriceListRules(
    ...args: any[]
  ): Promise<PricingTypes.PriceListRuleDTO | PricingTypes.PriceListRuleDTO[]> {
    try {
      // @ts-ignore
      return await super.createPriceListRules(...args)
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectTransactionManager()
  @EmitEvents()
  // @ts-expect-error
  async updatePriceListRules(
    ...args: any[]
  ): Promise<PricingTypes.PriceListRuleDTO | PricingTypes.PriceListRuleDTO[]> {
    try {
      // @ts-ignore
      return await super.updatePriceListRules(...args)
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectManager()
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

  @InjectManager()
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

    return await this.baseRepository_.serialize<PriceSetDTO[]>(priceSets)
  }

  @InjectManager()
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
      const serializedPriceSets = await this.baseRepository_.serialize<
        PriceSetDTO[]
      >(priceSets)
      return [serializedPriceSets, count]
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

    const serializedPriceSets = await this.baseRepository_.serialize<
      PriceSetDTO[]
    >(priceSets)

    return [serializedPriceSets, count]
  }

  @InjectManager()
  // @ts-expect-error
  async listPriceRules(
    filters: PricingTypes.FilterablePriceRuleProps,
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    sharedContext?: Context
  ): Promise<PricingTypes.PriceRuleDTO[]> {
    const priceRules = await this.listPriceRules_(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PricingTypes.PriceRuleDTO[]>(
      priceRules
    )
  }

  protected async listPriceRules_(
    filters: PricingTypes.FilterablePriceRuleProps,
    config: FindConfig<PricingTypes.PriceRuleDTO> = {},
    sharedContext?: Context
  ): Promise<InferEntityType<typeof PriceRule>[]> {
    return await this.priceRuleService_.list(filters, config, sharedContext)
  }

  @InjectManager()
  // @ts-expect-error
  async listPricePreferences(
    filters: PricingTypes.FilterablePricePreferenceProps,
    config: FindConfig<PricingTypes.PricePreferenceDTO> = {},
    sharedContext?: Context
  ): Promise<PricingTypes.PricePreferenceDTO[]> {
    const pricePreferences = await this.listPricePreferences_(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<
      PricingTypes.PricePreferenceDTO[]
    >(pricePreferences)
  }

  protected async listPricePreferences_(
    filters: PricingTypes.FilterablePricePreferenceProps,
    config: FindConfig<PricingTypes.PricePreferenceDTO> = {},
    sharedContext?: Context
  ): Promise<InferEntityType<typeof PricePreference>[]> {
    return await this.pricePreferenceService_.list(
      filters,
      config,
      sharedContext
    )
  }

  @InjectManager()
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
    const priceIds: string[] = []
    pricesSetPricesMap.forEach(
      (prices: PricingTypes.CalculatedPriceSetDTO[], key) => {
        const priceListPrice = prices.find((p) => p.price_list_id)
        const defaultPrice = prices?.find((p) => !p.price_list_id)
        if (!prices.length || (!priceListPrice && !defaultPrice)) {
          pricesSetPricesMap.delete(key)
          return
        }

        let calculatedPrice: PricingTypes.CalculatedPriceSetDTO | undefined =
          defaultPrice
        let originalPrice: PricingTypes.CalculatedPriceSetDTO | undefined =
          defaultPrice

        /**
         * When deciding which price to use we follow the following logic:
         * - If the price list is of type OVERRIDE, we always use the price list price.
         *   - If there are multiple price list prices of type OVERRIDE, we use the one with the lowest amount.
         * - If the price list is of type SALE, we use the lowest price between the price list price and the default price
         */
        if (priceListPrice) {
          switch (priceListPrice.price_list_type) {
            case PriceListType.OVERRIDE:
              calculatedPrice = priceListPrice
              originalPrice = priceListPrice
              break
            case PriceListType.SALE: {
              let lowestPrice = priceListPrice

              if (defaultPrice?.amount && priceListPrice.amount) {
                lowestPrice = MathBN.lte(
                  priceListPrice.amount,
                  defaultPrice.amount
                )
                  ? priceListPrice
                  : defaultPrice
              }

              calculatedPrice = lowestPrice
              break
            }
          }
        }

        pricesSetPricesMap.set(key, { calculatedPrice, originalPrice })
        priceIds.push(
          ...(deduplicate(
            [calculatedPrice?.id, originalPrice?.id].filter(Boolean)
          ) as string[])
        )
      }
    )

    // We use the price rules to get the right preferences for the price
    const priceRulesForPrices = await this.listPriceRules(
      { price_id: priceIds },
      {},
      sharedContext
    )

    const priceRulesPriceMap = groupBy(priceRulesForPrices, "price_id")

    // Note: For now the preferences are intentionally kept very simple and explicit - they use either the region or currency,
    // so we hard-code those as the possible filters here. This can be made more flexible if needed later on.
    const preferenceContext = Object.entries(
      pricingContext.context ?? {}
    ).filter(([key, val]) => {
      return key === "region_id" || key === "currency_code"
    })
    let pricingPreferences: InferEntityType<typeof PricePreference>[] = []
    if (preferenceContext.length) {
      const preferenceFilters = preferenceContext.length
        ? {
            $or: preferenceContext.map(([key, val]) => ({
              attribute: key,
              value: val,
            })),
          }
        : {}
      pricingPreferences = await this.listPricePreferences_(
        preferenceFilters as PricingTypes.FilterablePricePreferenceProps,
        {},
        sharedContext
      )
    }

    const calculatedPrices: PricingTypes.CalculatedPriceSet[] = []

    for (const priceSetId of pricingFilters.id) {
      const prices = pricesSetPricesMap.get(priceSetId)
      if (!prices) {
        continue
      }

      const {
        calculatedPrice,
        originalPrice,
      }: {
        calculatedPrice: PricingTypes.CalculatedPriceSetDTO
        originalPrice: PricingTypes.CalculatedPriceSetDTO | undefined
      } = prices

      const calculatedPrice_: PricingTypes.CalculatedPriceSet = {
        id: priceSetId,
        is_calculated_price_price_list: !!calculatedPrice?.price_list_id,
        is_calculated_price_tax_inclusive: isTaxInclusive(
          priceRulesPriceMap.get(calculatedPrice.id),
          pricingPreferences,
          calculatedPrice.currency_code!,
          pricingContext.context?.region_id as string
        ),
        calculated_amount: isPresent(calculatedPrice?.amount)
          ? parseFloat(calculatedPrice?.amount as string)
          : null,
        raw_calculated_amount: calculatedPrice?.raw_amount || null,

        is_original_price_price_list: !!originalPrice?.price_list_id,
        is_original_price_tax_inclusive: originalPrice?.id
          ? isTaxInclusive(
              priceRulesPriceMap.get(originalPrice.id),
              pricingPreferences,
              originalPrice.currency_code || calculatedPrice.currency_code!,
              pricingContext.context?.region_id as string
            )
          : false,
        original_amount: isPresent(originalPrice?.amount)
          ? parseFloat(originalPrice?.amount as string)
          : null,
        raw_original_amount: originalPrice?.raw_amount || null,

        currency_code: calculatedPrice?.currency_code || null,

        calculated_price: {
          id: calculatedPrice?.id || null,
          price_list_id: calculatedPrice?.price_list_id || null,
          price_list_type: calculatedPrice?.price_list_type || null,
          min_quantity: parseFloat(calculatedPrice?.min_quantity || "") || null,
          max_quantity: parseFloat(calculatedPrice?.max_quantity || "") || null,
        },

        original_price: {
          id: originalPrice?.id || null,
          price_list_id: originalPrice?.price_list_id || null,
          price_list_type: originalPrice?.price_list_type || null,
          min_quantity: parseFloat(originalPrice?.min_quantity || "") || null,
          max_quantity: parseFloat(originalPrice?.max_quantity || "") || null,
        },
      }

      calculatedPrices.push(calculatedPrice_)
    }

    return calculatedPrices
  }

  // @ts-expect-error
  async createPriceSets(
    data: PricingTypes.CreatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

  // @ts-expect-error
  async createPriceSets(
    data: PricingTypes.CreatePriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

    try {
      return await this.baseRepository_.serialize<PriceSetDTO[] | PriceSetDTO>(
        Array.isArray(data) ? results : results[0]
      )
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  async upsertPriceSets(
    data: UpsertPriceSetDTO[],
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>
  async upsertPriceSets(
    data: UpsertPriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>

  @InjectManager()
  @EmitEvents()
  async upsertPriceSets(
    data: UpsertPriceSetDTO | UpsertPriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PriceSetDTO | PriceSetDTO[]> {
    const result = await this.upsertPriceSets_(data, sharedContext)

    try {
      return await this.baseRepository_.serialize<PriceSetDTO[] | PriceSetDTO>(
        Array.isArray(data) ? result : result[0]
      )
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectTransactionManager()
  protected async upsertPriceSets_(
    data: UpsertPriceSetDTO | UpsertPriceSetDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof PriceSet>[]> {
    const input = Array.isArray(data) ? data : [data]

    const forUpdate = input.filter(
      (priceSet): priceSet is ServiceTypes.UpdatePriceSetInput => !!priceSet.id
    )
    const forCreate = input.filter(
      (priceSet): priceSet is CreatePriceSetDTO => !priceSet.id
    )

    const operations: Promise<InferEntityType<typeof PriceSet>[]>[] = []

    if (forCreate.length) {
      operations.push(this.createPriceSets_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.updatePriceSets_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()

    return result
  }

  // @ts-expect-error
  async updatePriceSets(
    id: string,
    data: PricingTypes.UpdatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO>
  // @ts-expect-error
  async updatePriceSets(
    selector: PricingTypes.FilterablePriceSetProps,
    data: PricingTypes.UpdatePriceSetDTO,
    sharedContext?: Context
  ): Promise<PriceSetDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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

    const serializedUpdateResult = await this.baseRepository_.serialize<
      PriceSetDTO[] | PriceSetDTO
    >(isString(idOrSelector) ? updateResult[0] : updateResult)

    try {
      return serializedUpdateResult
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectTransactionManager()
  protected async updatePriceSets_(
    data: ServiceTypes.UpdatePriceSetInput[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof PriceSet>[]> {
    const normalizedData = await this.normalizeUpdateData(data)

    const priceSetIds = normalizedData.map(({ id }) => id)
    const existingPrices = await this.priceService_.list(
      {
        price_set_id: priceSetIds,
        price_list_id: null,
      },
      {
        relations: ["price_rules"],
        take: null,
      },
      sharedContext
    )

    const existingPricesMap = new Map<string, InferEntityType<typeof Price>>(
      existingPrices.map((p) => [p.id, p])
    )

    const prices = normalizedData.flatMap((priceSet) => priceSet.prices || [])

    const pricesToCreate = prices.filter(
      (price) => !price.id || !existingPricesMap.has(price.id)
    )
    const pricesToUpdate = prices.filter(
      (price) => price.id && existingPricesMap.has(price.id)
    )

    const incomingPriceIds = new Set(prices.map((p) => p.id).filter(Boolean))
    const pricesToDelete = existingPrices
      .filter((existingPrice) => !incomingPriceIds.has(existingPrice.id))
      .map((p) => p.id)

    let createdPrices: InferEntityType<typeof Price>[] = []
    let updatedPrices: InferEntityType<typeof Price>[] = []

    if (pricesToCreate.length > 0) {
      createdPrices = await this.priceService_.create(
        pricesToCreate.map((price) => {
          price.price_rules ??= []
          return price
        }),
        sharedContext
      )
    }

    if (pricesToUpdate.length > 0) {
      // Handle price rules for updated prices
      for (const priceToUpdate of pricesToUpdate) {
        const existingPrice = existingPricesMap.get(priceToUpdate.id!)

        if (priceToUpdate.price_rules?.length) {
          const existingPriceRules = existingPrice?.price_rules || []

          // Separate price rules for create, update, delete
          const priceRulesToCreate = priceToUpdate.price_rules.filter(
            (rule) => !("id" in rule)
          )
          const priceRulesToUpdate = priceToUpdate.price_rules.filter(
            (rule) => "id" in rule
          )

          const incomingPriceRuleIds = new Set(
            priceToUpdate.price_rules
              .map((r) => "id" in r && r.id)
              .filter(Boolean)
          )
          const priceRulesToDelete = existingPriceRules
            .filter(
              (existingRule) => !incomingPriceRuleIds.has(existingRule.id)
            )
            .map((r) => r.id)

          let createdPriceRules: InferEntityType<typeof PriceRule>[] = []
          let updatedPriceRules: InferEntityType<typeof PriceRule>[] = []

          // Bulk operations for price rules
          if (priceRulesToCreate.length > 0) {
            createdPriceRules = await this.priceRuleService_.create(
              priceRulesToCreate.map((rule) => ({
                ...rule,
                price_id: priceToUpdate.id,
              })),
              sharedContext
            )
          }

          if (priceRulesToUpdate.length > 0) {
            updatedPriceRules = await this.priceRuleService_.update(
              priceRulesToUpdate,
              sharedContext
            )
          }

          if (priceRulesToDelete.length > 0) {
            await this.priceRuleService_.delete(
              priceRulesToDelete,
              sharedContext
            )
          }

          const upsertedPriceRules = [
            ...createdPriceRules,
            ...updatedPriceRules,
          ]

          priceToUpdate.price_rules = upsertedPriceRules
          ;(priceToUpdate as InferEntityType<typeof Price>).rules_count =
            upsertedPriceRules.length
        } else if (
          // In the case price_rules is provided but without any rules, we delete the existing rules
          isDefined(priceToUpdate.price_rules) &&
          priceToUpdate.price_rules.length === 0
        ) {
          const priceRuleToDelete = existingPrice?.price_rules?.map((r) => r.id)

          if (priceRuleToDelete?.length) {
            await this.priceRuleService_.delete(
              priceRuleToDelete,
              sharedContext
            )
          }

          ;(priceToUpdate as InferEntityType<typeof Price>).rules_count = 0
        } else {
          // @ts-expect-error - we want to delete the rules_count property in any case even if provided by mistake
          delete (priceToUpdate as InferEntityType<typeof Price>).rules_count
        }
        // We don't want to persist the price_rules in the database through the price service as it would not work
        delete priceToUpdate.price_rules
      }

      updatedPrices = await this.priceService_.update(
        pricesToUpdate,
        sharedContext
      )
    }

    if (pricesToDelete.length > 0) {
      await this.priceService_.delete(pricesToDelete, sharedContext)
    }

    const priceSets = await this.priceSetService_.list(
      { id: normalizedData.map(({ id }) => id) },
      {
        relations: ["prices", "prices.price_rules"],
      },
      sharedContext
    )

    const upsertedPricesMap = new Map<string, InferEntityType<typeof Price>[]>()

    const upsertedPrices = [...createdPrices, ...updatedPrices]
    upsertedPrices.forEach((price) => {
      upsertedPricesMap.set(price.price_set_id, [
        ...(upsertedPricesMap.get(price.price_set_id) || []),
        price,
      ])
    })

    // re assign the prices to the price sets to not have to refetch after the transaction and keep the bahaviour the same as expected. If the user needs more data, he can still re list the price set with the expected fields and relations that he needs

    priceSets.forEach((ps) => {
      ps.prices = upsertedPricesMap.get(ps.id) || []
    })

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
    Array.from(existingPrices ?? []).forEach((price) => {
      existingPricesMap.set(hashPrice(price), price)
    })

    const ruleOperatorsSet = new Set<PricingRuleOperatorValues>(
      Object.values(PricingRuleOperator)
    )
    const validOperatorsList = Array.from(ruleOperatorsSet).join(", ")
    const invalidOperatorError = `operator should be one of ${validOperatorsList}`

    data?.forEach((price) => {
      const cleanRules = price.rules ? removeNullish(price.rules) : {}

      const rules = Object.entries(cleanRules).flatMap(([attribute, value]) => {
        if (Array.isArray(value)) {
          return value.map((customRule) => {
            if (!ruleOperatorsSet.has(customRule.operator)) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                invalidOperatorError
              )
            }

            if (typeof customRule.value !== "number") {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `value should be a number`
              )
            }

            return {
              attribute,
              operator: customRule.operator,
              // TODO: we throw above if value is not a number, but the model expect the value to be a string
              value: customRule.value.toString(),
            }
          })
        }

        return {
          attribute,
          value,
        }
      })

      const entry = price as ServiceTypes.UpsertPriceDTO

      const hasRulesInput = isPresent(price.rules)
      entry.price_list_id = priceListId
      if (hasRulesInput) {
        entry.price_rules = rules
        entry.rules_count = rules.length
        delete (entry as CreatePricesDTO).rules
      }

      const entryHash = hashPrice(entry)

      // We want to keep the existing rules as they might already have ids, but any other data should come from the updated input
      const existing = existingPricesMap.get(entryHash)

      if (existing) {
        entry.id = existing.id ?? entry.id
        entry.price_rules = existing.price_rules ?? entry.price_rules
      }

      pricesToUpsert.set(entryHash, entry)
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

  @InjectManager()
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

    const serializedOrderedPriceSets = await this.baseRepository_.serialize<
      PricingTypes.PriceSetDTO[]
    >(Array.isArray(data) ? orderedPriceSets : orderedPriceSets[0])

    try {
      return serializedOrderedPriceSets
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectManager()
  @EmitEvents()
  // @ts-ignore
  async createPriceLists(
    data: PricingTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.createPriceLists_(data, sharedContext)

    try {
      return await this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
        priceLists
      )
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectManager()
  @EmitEvents()
  // @ts-ignore
  async updatePriceLists(
    data: PricingTypes.UpdatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO[]> {
    const priceLists = await this.updatePriceLists_(data, sharedContext)

    try {
      return await this.baseRepository_.serialize<PricingTypes.PriceListDTO[]>(
        priceLists
      )
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectManager()
  @EmitEvents()
  async updatePriceListPrices(
    data: PricingTypes.UpdatePriceListPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceDTO[]> {
    const prices = await this.updatePriceListPrices_(data, sharedContext)

    try {
      return await this.baseRepository_.serialize<PricingTypes.PriceDTO[]>(
        prices
      )
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectManager()
  @EmitEvents()
  async removePrices(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    try {
      await this.removePrices_(ids, sharedContext)
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectManager()
  @EmitEvents()
  async addPriceListPrices(
    data: PricingTypes.AddPriceListPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceDTO[]> {
    const prices = await this.addPriceListPrices_(data, sharedContext)

    try {
      return await this.baseRepository_.serialize<PricingTypes.PriceDTO[]>(
        prices
      )
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectManager()
  @EmitEvents()
  async setPriceListRules(
    data: PricingTypes.SetPriceListRulesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const [priceList] = await this.setPriceListRules_([data], sharedContext)

    try {
      return await this.baseRepository_.serialize<PricingTypes.PriceListDTO>(
        priceList
      )
    } finally {
      this.pricingRepository_.clearAvailableAttributes?.()
    }
  }

  @InjectManager()
  @EmitEvents()
  async removePriceListRules(
    data: PricingTypes.RemovePriceListRulesDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricingTypes.PriceListDTO> {
    const [priceList] = await this.removePriceListRules_([data], sharedContext)

    return await this.baseRepository_.serialize<PricingTypes.PriceListDTO>(
      priceList
    )
  }

  // @ts-expect-error
  async createPricePreferences(
    data: PricingTypes.CreatePricePreferenceDTO,
    sharedContext?: Context
  ): Promise<PricePreferenceDTO>
  async createPricePreferences(
    data: PricingTypes.CreatePricePreferenceDTO[],
    sharedContext?: Context
  ): Promise<PricePreferenceDTO[]>

  @InjectManager()
  @EmitEvents()
  async createPricePreferences(
    data:
      | PricingTypes.CreatePricePreferenceDTO
      | PricingTypes.CreatePricePreferenceDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricePreferenceDTO | PricePreferenceDTO[]> {
    const normalized = Array.isArray(data) ? data : [data]
    const preferences = await this.createPricePreferences_(
      normalized,
      sharedContext
    )

    const serialized = await this.baseRepository_.serialize<
      PricePreferenceDTO[]
    >(preferences)
    return Array.isArray(data) ? serialized : serialized[0]
  }

  async upsertPricePreferences(
    data: UpsertPricePreferenceDTO[],
    sharedContext?: Context
  ): Promise<PricePreferenceDTO[]>
  async upsertPricePreferences(
    data: UpsertPricePreferenceDTO,
    sharedContext?: Context
  ): Promise<PricePreferenceDTO>

  @InjectManager()
  @EmitEvents()
  async upsertPricePreferences(
    data: UpsertPricePreferenceDTO | UpsertPricePreferenceDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricePreferenceDTO | PricePreferenceDTO[]> {
    const result = await this.upsertPricePreferences_(data, sharedContext)

    return await this.baseRepository_.serialize<
      PricePreferenceDTO[] | PricePreferenceDTO
    >(Array.isArray(data) ? result : result[0])
  }

  @InjectTransactionManager()
  protected async upsertPricePreferences_(
    data: UpsertPricePreferenceDTO | UpsertPricePreferenceDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof PricePreference>[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (
        pricePreference
      ): pricePreference is ServiceTypes.UpdatePricePreferenceInput =>
        !!pricePreference.id
    )
    const forCreate = input.filter(
      (pricePreference): pricePreference is CreatePricePreferenceDTO =>
        !pricePreference.id
    )

    const operations: Promise<InferEntityType<typeof PricePreference>[]>[] = []

    if (forCreate.length) {
      operations.push(this.createPricePreferences_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.updatePricePreferences_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()

    return result
  }

  // @ts-expect-error
  async updatePricePreferences(
    id: string,
    data: PricingTypes.UpdatePricePreferenceDTO,
    sharedContext?: Context
  ): Promise<PricePreferenceDTO>
  // @ts-expect-error
  async updatePricePreferences(
    selector: PricingTypes.FilterablePricePreferenceProps,
    data: PricingTypes.UpdatePricePreferenceDTO,
    sharedContext?: Context
  ): Promise<PricePreferenceDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updatePricePreferences(
    idOrSelector: string | PricingTypes.FilterablePricePreferenceProps,
    data: PricingTypes.UpdatePricePreferenceDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PricePreferenceDTO | PricePreferenceDTO[]> {
    let normalizedInput: ServiceTypes.UpdatePricePreferenceInput[] = []
    if (isString(idOrSelector)) {
      // Check if the ID exists, it will throw if not.
      await this.pricePreferenceService_.retrieve(
        idOrSelector,
        {},
        sharedContext
      )
      normalizedInput = [{ id: idOrSelector, ...data }]
    } else {
      const pricePreferences = await this.pricePreferenceService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      normalizedInput = pricePreferences.map((pricePreference) => ({
        id: pricePreference.id,
        ...data,
      }))
    }

    const updateResult = await this.updatePricePreferences_(
      normalizedInput,
      sharedContext
    )

    const pricePreferences = await this.baseRepository_.serialize<
      PricePreferenceDTO[] | PricePreferenceDTO
    >(updateResult)

    return isString(idOrSelector) ? pricePreferences[0] : pricePreferences
  }

  @InjectTransactionManager()
  protected async createPricePreferences_(
    data: PricingTypes.CreatePricePreferenceDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const preferences = await this.pricePreferenceService_.create(
      data.map((d) => ({
        ...d,
        is_tax_inclusive: d.is_tax_inclusive ?? false,
      })),
      sharedContext
    )

    return preferences
  }

  @InjectTransactionManager()
  protected async updatePricePreferences_(
    data: PricingTypes.UpdatePricePreferenceDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const preferences = await this.pricePreferenceService_.update(
      data,
      sharedContext
    )

    return preferences
  }

  @InjectTransactionManager()
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
    const priceSets = await this.priceSetService_.create(
      toCreate,
      sharedContext
    )

    return priceSets
  }

  @InjectTransactionManager()
  protected async addPrices_(
    input: AddPricesDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const prices = input.flatMap((data) => {
      return data.prices.map((price) => {
        ;(price as PricingTypes.PriceDTO).price_set_id = data.priceSetId
        return price
      })
    })

    const priceConstraints =
      buildPreNormalizationPriceConstraintsFromData(prices)

    const [priceSets, priceSetPrices] = await promiseAll([
      this.listPriceSets(
        { id: input.map((d) => d.priceSetId) },
        {},
        sharedContext
      ),
      this.priceService_.list(
        priceConstraints,
        { relations: ["price_rules"] },
        sharedContext
      ),
    ])

    const existingPrices = priceSetPrices as unknown as PricingTypes.PriceDTO[]

    const pricesToUpsert = input
      .flatMap((addPrice) =>
        this.normalizePrices(addPrice.prices, existingPrices)
      )
      .filter(Boolean) as ServiceTypes.UpsertPriceDTO[]

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

    const { entities } = await this.priceService_.upsertWithReplace(
      pricesToUpsert,
      { relations: ["price_rules"] },
      sharedContext
    )

    return entities
  }

  @InjectTransactionManager()
  protected async createPriceLists_(
    data: PricingTypes.CreatePriceListDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const normalized = this.normalizePriceListDate(data)

    const priceListsToCreate: ServiceTypes.CreatePriceListDTO[] =
      normalized.map((priceListData) => {
        const entry = {
          ...priceListData,
          rules: undefined,
        } as ServiceTypes.CreatePriceListDTO

        if (priceListData.prices) {
          entry.prices = this.normalizePrices(
            priceListData.prices,
            []
          ) as ServiceTypes.UpsertPriceDTO[]
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
      })

    const priceLists = await this.priceListService_.create(
      priceListsToCreate,
      sharedContext
    )

    return priceLists
  }

  @InjectTransactionManager()
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
        const entry: Partial<ServiceTypes.CreatePriceListDTO> = {
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

  @InjectTransactionManager()
  protected async updatePriceListPrices_(
    data: PricingTypes.UpdatePriceListPricesDTO[],
    sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Price>[]> {
    const priceListIds = data.map((p) => p.price_list_id)
    const prices = data.flatMap((p) => p.prices)

    const priceConstraints = buildPreNormalizationPriceConstraintsFromData(
      prices,
      priceListIds
    )

    const [priceLists, priceListPrices] = await promiseAll([
      this.priceListService_.list({ id: priceListIds }, {}, sharedContext),
      this.priceService_.list(
        priceConstraints,
        { relations: ["price_rules"] },
        sharedContext
      ),
    ])

    const existingPrices = priceListPrices as unknown as PricingTypes.PriceDTO[]

    const pricesToUpsert = data
      .flatMap((addPrice) =>
        this.normalizePrices(
          addPrice.prices as ServiceTypes.UpsertPriceDTO[],
          existingPrices,
          addPrice.price_list_id
        )
      )
      .filter(Boolean) as ServiceTypes.UpsertPriceDTO[]

    const priceListMap = new Map(priceLists.map((p) => [p.id, p]))

    for (const { price_list_id: priceListId } of data) {
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

  @InjectTransactionManager()
  protected async removePrices_(
    ids: string[],
    sharedContext: Context = {}
  ): Promise<void> {
    await this.priceService_.delete(ids, sharedContext)
  }

  @InjectTransactionManager()
  protected async addPriceListPrices_(
    data: PricingTypes.AddPriceListPricesDTO[],
    sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Price>[]> {
    const priceListIds = data.map((p) => p.price_list_id)
    const prices = data.flatMap((p) => p.prices)

    const priceConstraints = buildPreNormalizationPriceConstraintsFromData(
      prices,
      priceListIds
    )
    const [priceLists, priceListPrices] = await promiseAll([
      this.priceListService_.list({ id: priceListIds }, {}, sharedContext),
      this.priceService_.list(
        priceConstraints,
        { relations: ["price_rules"] },
        sharedContext
      ),
    ])

    const existingPrices = priceListPrices as unknown as PricingTypes.PriceDTO[]

    const pricesToUpsert = data
      .flatMap((addPrice) =>
        this.normalizePrices(
          addPrice.prices,
          existingPrices,
          addPrice.price_list_id
        )
      )
      .filter(Boolean) as ServiceTypes.UpsertPriceDTO[]

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

    const { entities } = await this.priceService_.upsertWithReplace(
      pricesToUpsert,
      { relations: ["price_rules"] },
      sharedContext
    )

    return entities
  }

  @InjectTransactionManager()
  protected async setPriceListRules_(
    data: PricingTypes.SetPriceListRulesDTO[],
    sharedContext: Context = {}
  ): Promise<InferEntityType<typeof PriceList>[]> {
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
        const priceListRules =
          priceList.price_list_rules as unknown as Collection<
            InferEntityType<typeof PriceListRule>
          >
        const allRules = new Map(
          priceListRules.toArray().map((r) => [r.attribute, r.value])
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

  @InjectTransactionManager()
  protected async removePriceListRules_(
    data: PricingTypes.RemovePriceListRulesDTO[],
    sharedContext: Context = {}
  ): Promise<InferEntityType<typeof PriceList>[]> {
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
        const priceListRules =
          priceList.price_list_rules as unknown as Collection<
            InferEntityType<typeof PriceListRule>
          >

        const allRules = new Map(
          priceListRules.toArray().map((r) => [r.attribute, r.value])
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
      | ServiceTypes.CreatePriceListDTO
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

const isTaxInclusive = (
  priceRules: InferEntityType<typeof PriceRule>[],
  preferences: InferEntityType<typeof PricePreference>[],
  currencyCode: string,
  regionId?: string
) => {
  const regionRule = priceRules?.find(
    (rule) => rule.attribute === "region_id" && rule.value === regionId
  )

  const regionPreference = preferences.find(
    (p) => p.attribute === "region_id" && p.value === regionId
  )

  const currencyPreference = preferences.find(
    (p) => p.attribute === "currency_code" && p.value === currencyCode
  )

  if (regionRule && regionPreference) {
    return regionPreference.is_tax_inclusive
  }

  if (currencyPreference) {
    return currencyPreference.is_tax_inclusive
  }

  return false
}

const hashPrice = (
  price: PricingTypes.PriceDTO | PricingTypes.CreatePricesDTO
): string => {
  // Build hash using deterministic property order to avoid expensive sort operation
  // Using a direct string concatenation approach for better performance
  const parts: string[] = []

  if ("currency_code" in price) {
    parts.push(`cc:${price.currency_code ?? ""}`)
  }
  if ("price_set_id" in price) {
    parts.push(`ps:${price.price_set_id ?? ""}`)
  }
  if ("price_list_id" in price) {
    parts.push(`pl:${price.price_list_id ?? ""}`)
  }
  if ("min_quantity" in price) {
    parts.push(`min:${price.min_quantity ?? ""}`)
  }
  if ("max_quantity" in price) {
    parts.push(`max:${price.max_quantity ?? ""}`)
  }

  // Add price rules in a deterministic way if present
  if ("price_rules" in price && price.price_rules) {
    const sortedRules = price.price_rules.map(
      (pr) => `${pr.attribute}=${pr.value}`
    )
    if (sortedRules.length) {
      parts.push(`rules:${sortedRules.join(",")}`)
    }
  }

  return parts.sort().join("|")
}

/**
 * Build targeted database constraints to fetch only prices that could match the incoming data.
 * Uses the same properties as hashPrice to ensure consistency.
 */
const buildPreNormalizationPriceConstraintsFromData = (
  prices: (
    | PricingTypes.CreatePricesDTO
    | ServiceTypes.UpsertPriceDTO
    | PricingTypes.UpdatePriceListPriceDTO
  )[],
  priceListIds?: string | string[]
): any => {
  // Separate prices with explicit IDs from those without
  const pricesWithIds = prices.filter((p) => p.id).map((p) => p.id)

  // Build unique constraints based on hash properties
  const constraintSet = new Set<string>()
  const constraints: any[] = []

  for (const price of prices) {
    // Skip if price has explicit ID (will be queried separately)
    if (price.id) continue

    const constraint: any = {}

    if (price.currency_code !== undefined) {
      constraint.currency_code = price.currency_code
    }
    if ("price_set_id" in price && price.price_set_id !== undefined) {
      constraint.price_set_id = price.price_set_id
    }
    if ("price_list_id" in price && price.price_list_id !== undefined) {
      constraint.price_list_id = price.price_list_id
    }
    if (price.min_quantity !== undefined) {
      constraint.min_quantity = price.min_quantity
    }
    if (price.max_quantity !== undefined) {
      constraint.max_quantity = price.max_quantity
    }

    // Use hash to deduplicate constraints
    const constraintHash = JSON.stringify(constraint)
    if (!constraintSet.has(constraintHash)) {
      constraintSet.add(constraintHash)
      constraints.push(constraint)
    }
  }

  // Build final query
  const query: any = {}

  if (priceListIds) {
    if (Array.isArray(priceListIds) && priceListIds.length > 0) {
      query.price_list_id = {
        $in: priceListIds,
      }
    } else {
      query.price_list_id = priceListIds
    }
  }

  // Combine ID-based and property-based constraints
  if (pricesWithIds.length && constraints.length) {
    query.$or = [{ id: pricesWithIds }, ...constraints]
  } else if (pricesWithIds.length) {
    query.id = pricesWithIds
  } else if (constraints.length) {
    if (constraints.length === 1) {
      Object.assign(query, constraints[0])
    } else {
      query.$or = constraints
    }
  }

  return query
}
