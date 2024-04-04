import {
  Context,
  DAL,
  ITaxModuleService,
  ITaxProvider,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  TaxRegionDTO,
  TaxTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  isDefined,
  isString,
  promiseAll,
} from "@medusajs/utils"
import { TaxProvider, TaxRate, TaxRateRule, TaxRegion } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  taxRateService: ModulesSdkTypes.InternalModuleService<any>
  taxRegionService: ModulesSdkTypes.InternalModuleService<any>
  taxRateRuleService: ModulesSdkTypes.InternalModuleService<any>
  taxProviderService: ModulesSdkTypes.InternalModuleService<any>
  [key: `tp_${string}`]: ITaxProvider
}

const generateForModels = [TaxRegion, TaxRateRule, TaxProvider]

type ItemWithRates = {
  rates: TaxRate[]
  item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO
}

export default class TaxModuleService<
    TTaxRate extends TaxRate = TaxRate,
    TTaxRegion extends TaxRegion = TaxRegion,
    TTaxRateRule extends TaxRateRule = TaxRateRule,
    TTaxProvider extends TaxProvider = TaxProvider
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    TaxTypes.TaxRateDTO,
    {
      TaxRegion: { dto: TaxTypes.TaxRegionDTO }
      TaxRateRule: { dto: TaxTypes.TaxRateRuleDTO }
      TaxProvider: { dto: TaxTypes.TaxProviderDTO }
    }
  >(TaxRate, generateForModels, entityNameToLinkableKeysMap)
  implements ITaxModuleService
{
  protected readonly container_: InjectedDependencies
  protected baseRepository_: DAL.RepositoryService
  protected taxRateService_: ModulesSdkTypes.InternalModuleService<TTaxRate>
  protected taxRegionService_: ModulesSdkTypes.InternalModuleService<TTaxRegion>
  protected taxRateRuleService_: ModulesSdkTypes.InternalModuleService<TTaxRateRule>
  protected taxProviderService_: ModulesSdkTypes.InternalModuleService<TTaxProvider>

  constructor(
    {
      baseRepository,
      taxRateService,
      taxRegionService,
      taxRateRuleService,
      taxProviderService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.container_ = arguments[0]
    this.baseRepository_ = baseRepository
    this.taxRateService_ = taxRateService
    this.taxRegionService_ = taxRegionService
    this.taxRateRuleService_ = taxRateRuleService
    this.taxProviderService_ = taxProviderService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  async create(
    data: TaxTypes.CreateTaxRateDTO[],
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO[]>

  async create(
    data: TaxTypes.CreateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO>

  @InjectManager("baseRepository_")
  async create(
    data: TaxTypes.CreateTaxRateDTO[] | TaxTypes.CreateTaxRateDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TaxTypes.TaxRateDTO[] | TaxTypes.TaxRateDTO> {
    const input = Array.isArray(data) ? data : [data]
    const rates = await this.create_(input, sharedContext)
    return Array.isArray(data) ? rates : rates[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: TaxTypes.CreateTaxRateDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const [rules, rateData] = data.reduce(
      (acc, region) => {
        const { rules, ...rest } = region
        acc[0].push(rules)
        acc[1].push(rest)
        return acc
      },
      [[], []] as [
        (Omit<TaxTypes.CreateTaxRateRuleDTO, "tax_rate_id">[] | undefined)[],
        Partial<TaxTypes.CreateTaxRegionDTO>[]
      ]
    )

    const rates = await this.taxRateService_.create(rateData, sharedContext)
    const rulesToCreate = rates
      .reduce((acc, rate, i) => {
        const rateRules = rules[i]
        if (isDefined(rateRules)) {
          acc.push(
            rateRules.map((r) => {
              return {
                ...r,
                created_by: rate.created_by,
                tax_rate_id: rate.id,
              }
            })
          )
        }
        return acc
      }, [] as TaxTypes.CreateTaxRateRuleDTO[][])
      .flat()

    if (rulesToCreate.length > 0) {
      await this.taxRateRuleService_.create(rulesToCreate, sharedContext)
    }

    return await this.baseRepository_.serialize<TaxTypes.TaxRateDTO[]>(rates, {
      populate: true,
    })
  }

  async update(
    id: string,
    data: TaxTypes.UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO>
  async update(
    ids: string[],
    data: TaxTypes.UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO[]>
  async update(
    selector: TaxTypes.FilterableTaxRateProps,
    data: TaxTypes.UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO[]>

  @InjectManager("baseRepository_")
  async update(
    selector: string | string[] | TaxTypes.FilterableTaxRateProps,
    data: TaxTypes.UpdateTaxRateDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TaxTypes.TaxRateDTO | TaxTypes.TaxRateDTO[]> {
    const rates = await this.update_(selector, data, sharedContext)
    const serialized = await this.baseRepository_.serialize<
      TaxTypes.TaxRateDTO[]
    >(rates, { populate: true })
    return isString(selector) ? serialized[0] : serialized
  }

  @InjectTransactionManager("baseRepository_")
  protected async update_(
    idOrSelector: string | string[] | TaxTypes.FilterableTaxRateProps,
    data: TaxTypes.UpdateTaxRateDTO,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const selector =
      Array.isArray(idOrSelector) || isString(idOrSelector)
        ? { id: idOrSelector }
        : idOrSelector

    if (data.rules) {
      await this.setTaxRateRulesForTaxRates(
        idOrSelector,
        data.rules,
        data.updated_by,
        sharedContext
      )

      delete data.rules
    }

    return await this.taxRateService_.update({ selector, data }, sharedContext)
  }

  private async setTaxRateRulesForTaxRates(
    idOrSelector: string | string[] | TaxTypes.FilterableTaxRateProps,
    rules: Omit<TaxTypes.CreateTaxRateRuleDTO, "tax_rate_id">[],
    createdBy?: string,
    sharedContext: Context = {}
  ) {
    const selector =
      Array.isArray(idOrSelector) || isString(idOrSelector)
        ? { id: idOrSelector }
        : idOrSelector

    await this.taxRateRuleService_.softDelete(
      { tax_rate: selector },
      sharedContext
    )

    // TODO: this is a temporary solution seems like mikro-orm doesn't persist
    // the soft delete which results in the creation below breaking the unique
    // constraint
    await this.taxRateRuleService_.list(
      { tax_rate: selector },
      { select: ["id"] },
      sharedContext
    )

    if (rules.length === 0) {
      return
    }

    const rateIds = await this.getTaxRateIdsFromSelector(idOrSelector)
    const toCreate = rateIds
      .map((id) => {
        return rules.map((r) => {
          return {
            ...r,
            created_by: createdBy,
            tax_rate_id: id,
          }
        })
      })
      .flat()

    return await this.createTaxRateRules(toCreate, sharedContext)
  }

  private async getTaxRateIdsFromSelector(
    idOrSelector: string | string[] | TaxTypes.FilterableTaxRateProps,
    sharedContext: Context = {}
  ) {
    if (Array.isArray(idOrSelector)) {
      return idOrSelector
    }

    if (isString(idOrSelector)) {
      return [idOrSelector]
    }

    const rates = await this.taxRateService_.list(
      idOrSelector,
      { select: ["id"] },
      sharedContext
    )
    return rates.map((r) => r.id)
  }

  async upsert(
    data: TaxTypes.UpsertTaxRateDTO[],
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO[]>
  async upsert(
    data: TaxTypes.UpsertTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO>

  @InjectTransactionManager("baseRepository_")
  async upsert(
    data: TaxTypes.UpsertTaxRateDTO | TaxTypes.UpsertTaxRateDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TaxTypes.TaxRateDTO | TaxTypes.TaxRateDTO[]> {
    const result = await this.taxRateService_.upsert(data, sharedContext)
    const serialized = await this.baseRepository_.serialize<
      TaxTypes.TaxRateDTO[]
    >(result, { populate: true })
    return Array.isArray(data) ? serialized : serialized[0]
  }

  createTaxRegions(
    data: TaxTypes.CreateTaxRegionDTO,
    sharedContext?: Context
  ): Promise<TaxRegionDTO>

  createTaxRegions(
    data: TaxTypes.CreateTaxRegionDTO[],
    sharedContext?: Context
  ): Promise<TaxRegionDTO[]>

  @InjectManager("baseRepository_")
  async createTaxRegions(
    data: TaxTypes.CreateTaxRegionDTO | TaxTypes.CreateTaxRegionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]
    const result = await this.createTaxRegions_(input, sharedContext)
    return Array.isArray(data) ? result : result[0]
  }

  async createTaxRegions_(
    data: TaxTypes.CreateTaxRegionDTO[],
    sharedContext: Context = {}
  ) {
    const { defaultRates, regionData } =
      this.prepareTaxRegionInputForCreate(data)

    await this.verifyProvinceToCountryMatch(regionData, sharedContext)

    const regions = await this.taxRegionService_.create(
      regionData,
      sharedContext
    )

    const rates = regions
      .map((region, i) => {
        if (!defaultRates[i]) {
          return false
        }
        return {
          ...defaultRates[i],
          tax_region_id: region.id,
        }
      })
      .filter(Boolean) as TaxTypes.CreateTaxRateDTO[]

    if (rates.length !== 0) {
      await this.create(rates, sharedContext)
    }

    return await this.baseRepository_.serialize<TaxTypes.TaxRegionDTO[]>(
      regions,
      { populate: true }
    )
  }

  createTaxRateRules(
    data: TaxTypes.CreateTaxRateRuleDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateRuleDTO>
  createTaxRateRules(
    data: TaxTypes.CreateTaxRateRuleDTO[],
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateRuleDTO[]>

  @InjectManager("baseRepository_")
  async createTaxRateRules(
    data: TaxTypes.CreateTaxRateRuleDTO | TaxTypes.CreateTaxRateRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]
    const result = await this.createTaxRateRules_(input, sharedContext)
    return Array.isArray(data) ? result : result[0]
  }

  @InjectTransactionManager("baseRepository_")
  async createTaxRateRules_(
    data: TaxTypes.CreateTaxRateRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const rules = await this.taxRateRuleService_.create(data, sharedContext)
    return await this.baseRepository_.serialize<TaxTypes.TaxRateRuleDTO[]>(
      rules,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async getTaxLines(
    items: (TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO)[],
    calculationContext: TaxTypes.TaxCalculationContext,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]> {
    const normalizedContext =
      this.normalizeTaxCalculationContext(calculationContext)
    const regions = await this.taxRegionService_.list(
      {
        $or: [
          {
            country_code: normalizedContext.address.country_code,
            province_code: null,
          },
          {
            country_code: normalizedContext.address.country_code,
            province_code: normalizedContext.address.province_code,
          },
        ],
      },
      {},
      sharedContext
    )

    const parentRegion = regions.find((r) => r.province_code === null)
    if (!parentRegion) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No parent region found for country"
      )
    }

    const toReturn = await promiseAll(
      items.map(async (item) => {
        const regionIds = regions.map((r) => r.id)
        const rateQuery = this.getTaxRateQueryForItem(item, regionIds)
        const candidateRates = await this.taxRateService_.list(
          rateQuery,
          {
            relations: ["tax_region", "rules"],
          },
          sharedContext
        )

        const applicableRates = await this.getTaxRatesForItem(
          item,
          candidateRates
        )

        return {
          rates: applicableRates,
          item,
        }
      })
    )

    const taxLines = await this.getTaxLinesFromProvider(
      parentRegion.provider_id,
      toReturn,
      calculationContext
    )

    return taxLines
  }

  private async getTaxLinesFromProvider(
    rawProviderId: string | null,
    items: ItemWithRates[],
    calculationContext: TaxTypes.TaxCalculationContext
  ) {
    const providerId = rawProviderId || "system"
    let provider: ITaxProvider
    try {
      provider = this.container_[`tp_${providerId}`] as ITaxProvider
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Failed to resolve Tax Provider with id: ${providerId}. Make sure it's installed and configured in the Tax Module's options.`
      )
    }

    const [itemLines, shippingLines] = items.reduce(
      (acc, line) => {
        if ("shipping_option_id" in line.item) {
          acc[1].push({
            shipping_line: line.item,
            rates: line.rates,
          })
        } else {
          acc[0].push({
            line_item: line.item,
            rates: line.rates,
          })
        }
        return acc
      },
      [[], []] as [
        TaxTypes.ItemTaxCalculationLine[],
        TaxTypes.ShippingTaxCalculationLine[]
      ]
    )

    const itemTaxLines = await provider.getTaxLines(
      itemLines,
      shippingLines,
      calculationContext
    )

    return itemTaxLines
  }

  private normalizeTaxCalculationContext(
    context: TaxTypes.TaxCalculationContext
  ): TaxTypes.TaxCalculationContext {
    return {
      ...context,
      address: {
        ...context.address,
        country_code: this.normalizeRegionCodes(context.address.country_code),
        province_code: context.address.province_code
          ? this.normalizeRegionCodes(context.address.province_code)
          : null,
      },
    }
  }

  private prepareTaxRegionInputForCreate(
    data: TaxTypes.CreateTaxRegionDTO | TaxTypes.CreateTaxRegionDTO[]
  ) {
    const regionsWithDefaultRate = Array.isArray(data) ? data : [data]

    const defaultRates: (Omit<
      TaxTypes.CreateTaxRateDTO,
      "tax_region_id"
    > | null)[] = []
    const regionData: TaxTypes.CreateTaxRegionDTO[] = []

    for (const region of regionsWithDefaultRate) {
      const { default_tax_rate, ...rest } = region
      if (!default_tax_rate) {
        defaultRates.push(null)
      } else {
        defaultRates.push({
          ...default_tax_rate,
          is_default: true,
          created_by: region.created_by,
        })
      }

      regionData.push({
        ...rest,
        province_code: rest.province_code
          ? this.normalizeRegionCodes(rest.province_code)
          : null,
        country_code: this.normalizeRegionCodes(rest.country_code),
      })
    }

    return { defaultRates, regionData }
  }

  private async verifyProvinceToCountryMatch(
    regionsToVerify: TaxTypes.CreateTaxRegionDTO[],
    sharedContext: Context = {}
  ) {
    const parentIds = regionsToVerify.map((i) => i.parent_id).filter(isDefined)
    if (parentIds.length > 0) {
      const parentRegions = await this.taxRegionService_.list(
        { id: { $in: parentIds } },
        { select: ["id", "country_code"] },
        sharedContext
      )

      for (const region of regionsToVerify) {
        if (isDefined(region.parent_id)) {
          const parentRegion = parentRegions.find(
            (r) => r.id === region.parent_id
          )
          if (!isDefined(parentRegion)) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Province region must belong to a parent region. You are trying to create a province region with (country: ${region.country_code}, province: ${region.province_code}) but parent does not exist`
            )
          }

          if (parentRegion.country_code !== region.country_code) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              `Province region must belong to a parent region with the same country code. You are trying to create a province region with (country: ${region.country_code}, province: ${region.province_code}) but parent expects (country: ${parentRegion.country_code})`
            )
          }
        }
      }
    }
  }

  private async getTaxRatesForItem(
    item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO,
    rates: TTaxRate[]
  ): Promise<TTaxRate[]> {
    if (!rates.length) {
      return []
    }

    const prioritizedRates = this.prioritizeRates(rates, item)
    const rate = prioritizedRates[0]

    const ratesToReturn = [rate]

    // If the rate can be combined we need to find the rate's
    // parent region and add that rate too. If not we can return now.
    if (!(rate.is_combinable && rate.tax_region.parent_id)) {
      return ratesToReturn
    }

    // First parent region rate in prioritized rates
    // will be the most granular rate.
    const parentRate = prioritizedRates.find(
      (r) => r.tax_region.id === rate.tax_region.parent_id
    )

    if (parentRate) {
      ratesToReturn.push(parentRate)
    }

    return ratesToReturn
  }

  private getTaxRateQueryForItem(
    item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO,
    regionIds: string[]
  ) {
    const isShipping = "shipping_option_id" in item
    let ruleQuery = isShipping
      ? [
          {
            reference: "shipping_option",
            reference_id: item.shipping_option_id,
          },
        ]
      : [
          {
            reference: "product",
            reference_id: item.product_id,
          },
          {
            reference: "product_type",
            reference_id: item.product_type_id,
          },
        ]

    return {
      $and: [
        { tax_region_id: regionIds },
        { $or: [{ is_default: true }, { rules: { $or: ruleQuery } }] },
      ],
    }
  }

  private checkRuleMatches(
    rate: TTaxRate,
    item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO
  ) {
    if (rate.rules.length === 0) {
      return {
        isProductMatch: false,
        isProductTypeMatch: false,
        isShippingMatch: false,
      }
    }

    let isProductMatch = false
    const isShipping = "shipping_option_id" in item
    const matchingRules = rate.rules.filter((rule) => {
      if (isShipping) {
        return (
          rule.reference === "shipping" &&
          rule.reference_id === item.shipping_option_id
        )
      }
      return (
        (rule.reference === "product" &&
          rule.reference_id === item.product_id) ||
        (rule.reference === "product_type" &&
          rule.reference_id === item.product_type_id)
      )
    })

    if (matchingRules.some((rule) => rule.reference === "product")) {
      isProductMatch = true
    }

    return {
      isProductMatch,
      isProductTypeMatch: matchingRules.length > 0,
      isShippingMatch: isShipping && matchingRules.length > 0,
    }
  }

  private prioritizeRates(
    rates: TTaxRate[],
    item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO
  ) {
    const decoratedRates: (TTaxRate & {
      priority_score: number
    })[] = rates.map((rate) => {
      const { isProductMatch, isProductTypeMatch, isShippingMatch } =
        this.checkRuleMatches(rate, item)

      const isProvince = rate.tax_region.province_code !== null
      const isDefault = rate.is_default

      const decoratedRate = {
        ...rate,
        priority_score: 7,
      }

      if ((isShippingMatch || isProductMatch) && isProvince) {
        decoratedRate.priority_score = 1
      } else if (isProductTypeMatch && isProvince) {
        decoratedRate.priority_score = 2
      } else if (isDefault && isProvince) {
        decoratedRate.priority_score = 3
      } else if ((isShippingMatch || isProductMatch) && !isProvince) {
        decoratedRate.priority_score = 4
      } else if (isProductTypeMatch && !isProvince) {
        decoratedRate.priority_score = 5
      } else if (isDefault && !isProvince) {
        decoratedRate.priority_score = 6
      }
      return decoratedRate
    })

    return decoratedRates.sort(
      (a, b) => (a as any).priority_score - (b as any).priority_score
    )
  }

  private normalizeRegionCodes(code: string) {
    return code.toLowerCase()
  }

  // @InjectTransactionManager("baseRepository_")
  // async createProvidersOnLoad(@MedusaContext() sharedContext: Context = {}) {
  //   const providersToLoad = this.container_["tax_providers"] as ITaxProvider[]

  //   const ids = providersToLoad.map((p) => p.getIdentifier())

  //   const existing = await this.taxProviderService_.update(
  //     { selector: { id: { $in: ids } }, data: { is_enabled: true } },
  //     sharedContext
  //   )

  //   const existingIds = existing.map((p) => p.id)
  //   const diff = arrayDifference(ids, existingIds)
  //   await this.taxProviderService_.create(
  //     diff.map((id) => ({ id, is_enabled: true }))
  //   )

  //   await this.taxProviderService_.update({
  //     selector: { id: { $nin: ids } },
  //     data: { is_enabled: false },
  //   })
  // }
}
