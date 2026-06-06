import {
  Context,
  DAL,
  InferEntityType,
  InternalModuleDeclaration,
  ITaxModuleService,
  ITaxProvider,
  ModulesSdkTypes,
  TaxRegionDTO,
  TaxTypes,
} from "@zjedene-medusa/framework/types"
import {
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isDefined,
  isString,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@zjedene-medusa/framework/utils"
import { TaxProvider, TaxRate, TaxRateRule, TaxRegion } from "@models"
import { TaxProviderService } from "@services"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  taxRateService: ModulesSdkTypes.IMedusaInternalService<any>
  taxRegionService: ModulesSdkTypes.IMedusaInternalService<any>
  taxRateRuleService: ModulesSdkTypes.IMedusaInternalService<any>
  taxProviderService: TaxProviderService
  [key: `tp_${string}`]: ITaxProvider
}

const generateForModels = { TaxRate, TaxRegion, TaxRateRule, TaxProvider }

type ItemWithRates = {
  rates: InferEntityType<typeof TaxRate>[]
  item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO
}

export default class TaxModuleService
  extends ModulesSdkUtils.MedusaService<{
    TaxRate: { dto: TaxTypes.TaxRateDTO }
    TaxRegion: { dto: TaxTypes.TaxRegionDTO }
    TaxRateRule: { dto: TaxTypes.TaxRateRuleDTO }
    TaxProvider: { dto: TaxTypes.TaxProviderDTO }
  }>(generateForModels)
  implements ITaxModuleService
{
  protected readonly container_: InjectedDependencies
  protected baseRepository_: DAL.RepositoryService
  protected taxRateService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof TaxRate>
  >
  protected taxRegionService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof TaxRegion>
  >
  protected taxRateRuleService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof TaxRateRule>
  >
  protected taxProviderService_: TaxProviderService

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

  // @ts-expect-error
  async createTaxRates(
    data: TaxTypes.CreateTaxRateDTO[],
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO[]>

  // @ts-expect-error
  async createTaxRates(
    data: TaxTypes.CreateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createTaxRates(
    data: TaxTypes.CreateTaxRateDTO[] | TaxTypes.CreateTaxRateDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TaxTypes.TaxRateDTO[] | TaxTypes.TaxRateDTO> {
    const input = Array.isArray(data) ? data : [data]
    const rates = await this.createTaxRates_(input, sharedContext)

    const serialized = await this.baseRepository_.serialize<
      TaxTypes.TaxRateDTO[] | TaxTypes.TaxRateDTO
    >(rates)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  protected async createTaxRates_(
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

    return rates
  }

  // @ts-expect-error
  async updateTaxRates(
    id: string,
    data: TaxTypes.UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO>
  // @ts-expect-error
  async updateTaxRates(
    ids: string[],
    data: TaxTypes.UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO[]>
  // @ts-expect-error
  async updateTaxRates(
    selector: TaxTypes.FilterableTaxRateProps,
    data: TaxTypes.UpdateTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateTaxRates(
    selector: string | string[] | TaxTypes.FilterableTaxRateProps,
    data: TaxTypes.UpdateTaxRateDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TaxTypes.TaxRateDTO | TaxTypes.TaxRateDTO[]> {
    const rates = await this.updateTaxRates_(selector, data, sharedContext)

    const serialized = await this.baseRepository_.serialize<
      TaxTypes.TaxRateDTO[]
    >(rates)

    return isString(selector) ? serialized[0] : serialized
  }

  @InjectTransactionManager()
  protected async updateTaxRates_(
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

  async upsertTaxRates(
    data: TaxTypes.UpsertTaxRateDTO[],
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO[]>
  async upsertTaxRates(
    data: TaxTypes.UpsertTaxRateDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateDTO>

  @InjectManager()
  @EmitEvents()
  async upsertTaxRates(
    data: TaxTypes.UpsertTaxRateDTO | TaxTypes.UpsertTaxRateDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TaxTypes.TaxRateDTO | TaxTypes.TaxRateDTO[]> {
    const result = await this.taxRateService_.upsert(data, sharedContext)

    const serialized = await this.baseRepository_.serialize<
      TaxTypes.TaxRateDTO[]
    >(result)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  // @ts-ignore
  createTaxRegions(
    data: TaxTypes.CreateTaxRegionDTO,
    sharedContext?: Context
  ): Promise<TaxRegionDTO>

  // @ts-expect-error
  createTaxRegions(
    data: TaxTypes.CreateTaxRegionDTO[],
    sharedContext?: Context
  ): Promise<TaxRegionDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createTaxRegions(
    data: TaxTypes.CreateTaxRegionDTO | TaxTypes.CreateTaxRegionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]
    const result = await this.createTaxRegions_(input, sharedContext)

    const serialized = await this.baseRepository_.serialize<
      TaxTypes.TaxRegionDTO[] | TaxTypes.TaxRegionDTO
    >(result)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
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
      await this.createTaxRates(rates, sharedContext)
    }

    return regions
  }

  // @ts-expect-error
  createTaxRateRules(
    data: TaxTypes.CreateTaxRateRuleDTO,
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateRuleDTO>
  // @ts-expect-error
  createTaxRateRules(
    data: TaxTypes.CreateTaxRateRuleDTO[],
    sharedContext?: Context
  ): Promise<TaxTypes.TaxRateRuleDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createTaxRateRules(
    data: TaxTypes.CreateTaxRateRuleDTO | TaxTypes.CreateTaxRateRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const input = Array.isArray(data) ? data : [data]
    const result = await this.createTaxRateRules_(input, sharedContext)

    const serialized = await this.baseRepository_.serialize<
      TaxTypes.TaxRateRuleDTO[] | TaxTypes.TaxRateRuleDTO
    >(result)

    return Array.isArray(data) ? serialized : serialized[0]
  }

  @InjectTransactionManager()
  async createTaxRateRules_(
    data: TaxTypes.CreateTaxRateRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    const rules = await this.taxRateRuleService_.create(data, sharedContext)
    return rules
  }

  @InjectManager()
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
      return []
    }

    const regionIds = regions.map((r) => r.id)

    // Collect all unique reference IDs for batch query
    const productIds = new Set<string>()
    const productTypeIds = new Set<string>()
    const shippingOptionIds = new Set<string>()

    items.forEach((item) => {
      if ("shipping_option_id" in item) {
        shippingOptionIds.add(item.shipping_option_id)
      } else {
        productIds.add(item.product_id)
        if (item.product_type_id) {
          productTypeIds.add(item.product_type_id)
        }
      }
    })

    // Build comprehensive query for all items
    const ruleQueries = [
      ...Array.from(productIds).map((id) => ({
        reference: "product",
        reference_id: id,
      })),
      ...Array.from(productTypeIds).map((id) => ({
        reference: "product_type",
        reference_id: id,
      })),
      ...Array.from(shippingOptionIds).map((id) => ({
        reference: "shipping_option",
        reference_id: id,
      })),
    ]

    const allCandidateRates = await this.taxRateService_.list(
      {
        $and: [
          { tax_region_id: regionIds },
          {
            $or: [
              { is_default: true },
              ...(ruleQueries.length ? [{ rules: { $or: ruleQueries } }] : []),
            ],
          },
        ],
      },
      {
        relations: ["tax_region", "rules"],
      },
      sharedContext
    )

    const toReturn = items.map((item) => {
      const rateQuery = this.getTaxRateQueryForItem(item, regionIds)
      const candidateRates = allCandidateRates.filter((rate) =>
        this.rateMatchesQuery(rate, rateQuery)
      )
      const applicableRates = this.getTaxRatesForItem(item, candidateRates)

      return {
        rates: applicableRates,
        item,
      }
    })

    const taxLines = await this.getTaxLinesFromProvider(
      parentRegion.provider_id as string,
      toReturn,
      calculationContext
    )

    return taxLines
  }

  getProvider(providerId: string): ITaxProvider {
    return this.taxProviderService_.retrieveProvider(providerId)
  }

  private async getTaxLinesFromProvider(
    providerId: string,
    items: ItemWithRates[],
    calculationContext: TaxTypes.TaxCalculationContext
  ) {
    const provider = this.taxProviderService_.retrieveProvider(providerId)

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

  private getTaxRatesForItem(
    item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO,
    rates: InferEntityType<typeof TaxRate>[]
  ): InferEntityType<typeof TaxRate>[] {
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
  ): {
    $and: {
      tax_region_id?: string[]
      $or?: {
        is_default?: boolean
        rules?: {
          $or: { reference: string; reference_id: string | undefined }[]
        }
      }[]
    }[]
  } {
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

  private rateMatchesQuery(
    rate: InferEntityType<typeof TaxRate>,
    query: {
      $and: {
        tax_region_id?: string[]
        $or?: {
          is_default?: boolean
          rules?: {
            $or: { reference: string; reference_id: string | undefined }[]
          }
        }[]
      }[]
    }
  ): boolean {
    const { $and } = query
    const [regionCheck, ruleCheck] = $and

    // Check region match
    if (!regionCheck.tax_region_id?.includes(rate.tax_region_id)) {
      return false
    }

    // Check rule match
    const { $or } = ruleCheck
    if (rate.is_default) {
      return true
    }

    // Check if any rule matches
    for (const ruleCondition of $or ?? []) {
      if (ruleCondition.is_default && rate.is_default) {
        return true
      }
      if (ruleCondition.rules) {
        const { $or: ruleQueries } = ruleCondition.rules
        for (const ruleQuery of ruleQueries) {
          if (
            [...(rate.rules ?? [])]?.some(
              (rule: InferEntityType<typeof TaxRateRule>) =>
                rule.reference === ruleQuery.reference &&
                rule.reference_id === ruleQuery.reference_id
            )
          ) {
            return true
          }
        }
      }
    }

    return false
  }

  private checkRuleMatches(
    rate: InferEntityType<typeof TaxRate>,
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
          rule.reference === "shipping_option" &&
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
    rates: InferEntityType<typeof TaxRate>[],
    item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO
  ) {
    const decoratedRates = rates.map((rate) => {
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
    }) as (InferEntityType<typeof TaxRate> & {
      priority_score: number
    })[]

    return decoratedRates.sort(
      (a, b) => (a as any).priority_score - (b as any).priority_score
    )
  }

  private normalizeRegionCodes(code: string) {
    return code.toLowerCase()
  }
}
