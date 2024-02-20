import {
  Context,
  DAL,
  ITaxModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  TaxTypes,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  promiseAll,
} from "@medusajs/utils"
import { TaxRate, TaxRegion, TaxRateRule } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { TaxRegionDTO } from "@medusajs/types"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  taxRateService: ModulesSdkTypes.InternalModuleService<any>
  taxRegionService: ModulesSdkTypes.InternalModuleService<any>
  taxRateRuleService: ModulesSdkTypes.InternalModuleService<any>
}

const generateForModels = [TaxRegion, TaxRateRule]

export default class TaxModuleService<
    TTaxRate extends TaxRate = TaxRate,
    TTaxRegion extends TaxRegion = TaxRegion,
    TTaxRateRule extends TaxRateRule = TaxRateRule
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    TaxTypes.TaxRateDTO,
    {
      TaxRegion: { dto: TaxTypes.TaxRegionDTO }
      TaxRateRule: { dto: TaxTypes.TaxRateRuleDTO }
    }
  >(TaxRate, generateForModels, entityNameToLinkableKeysMap)
  implements ITaxModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected taxRateService_: ModulesSdkTypes.InternalModuleService<TTaxRate>
  protected taxRegionService_: ModulesSdkTypes.InternalModuleService<TTaxRegion>
  protected taxRateRuleService_: ModulesSdkTypes.InternalModuleService<TTaxRateRule>

  constructor(
    {
      baseRepository,
      taxRateService,
      taxRegionService,
      taxRateRuleService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.taxRateService_ = taxRateService
    this.taxRegionService_ = taxRegionService
    this.taxRateRuleService_ = taxRateRuleService
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
    const result = await this.baseRepository_.serialize<TaxTypes.TaxRateDTO>(
      rates,
      { populate: true }
    )
    return Array.isArray(data) ? result : result[0]
  }

  @InjectTransactionManager("baseRepository_")
  protected async create_(
    data: TaxTypes.CreateTaxRateDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.taxRateService_.create(data, sharedContext)
  }

  @InjectManager("baseRepository_")
  async createTaxRegions(
    data: TaxTypes.CreateTaxRegionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TaxTypes.TaxRegionDTO[]> {
    // TODO: check that country_code === parent.country_code
    const [defaultRates, regionData] = data.reduce(
      (acc, region) => {
        const { default_tax_rate, ...rest } = region
        acc[0].push({
          ...default_tax_rate,
          is_default: true,
          created_by: region.created_by,
        })
        acc[1].push(rest)
        return acc
      },
      [[], []] as [
        Omit<TaxTypes.CreateTaxRateDTO, "tax_region_id">[],
        Partial<TaxTypes.CreateTaxRegionDTO>[]
      ]
    )

    const regions = await this.taxRegionService_.create(
      regionData,
      sharedContext
    )

    const rates = regions.map((region: TaxRegionDTO, i: number) => {
      return {
        ...defaultRates[i],
        tax_region_id: region.id,
      }
    })

    await this.create(rates, sharedContext)

    return await this.baseRepository_.serialize<TaxTypes.TaxRegionDTO[]>(
      regions,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async createTaxRateRules(
    data: TaxTypes.CreateTaxRateRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TaxTypes.TaxRateRuleDTO[]> {
    const rules = await this.taxRateRuleService_.create(data, sharedContext)
    const result = await this.baseRepository_.serialize<
      TaxTypes.TaxRateRuleDTO[]
    >(rules, {
      populate: true,
    })
    return result
  }

  @InjectTransactionManager("baseRepository_")
  async createTaxRateRules_(
    data: TaxTypes.CreateTaxRateRuleDTO[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.taxRateRuleService_.create(data, sharedContext)
  }

  async getTaxLines(
    items: (TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO)[],
    calculationContext: TaxTypes.TaxCalculationContext,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]> {
    const regions = await this.taxRegionService_.list(
      {
        $or: [
          {
            country_code: calculationContext.address.country_code,
            province_code: null,
          },
          {
            country_code: calculationContext.address.country_code,
            province_code: calculationContext.address.province_code,
          },
        ],
      },
      {},
      sharedContext
    )

    const toReturn = await promiseAll(
      items.map(async (item) => {
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

        const rates = await this.taxRateService_.list(
          {
            $and: [
              { tax_region_id: { $in: regions.map((r) => r.id) } },
              { $or: [{ is_default: true }, { rules: { $or: ruleQuery } }] },
            ],
          },
          { relations: ["rules", "tax_region"] },
          sharedContext
        )

        const prioritizedRates = this.prioritizeRates(rates, item)

        const rate = prioritizedRates[0]
        const toReturn = {
          rate_id: rate.id,
          rate: rate.rate,
          code: rate.code,
          name: rate.name,
        }

        if (isShipping) {
          return [{ shipping_line_id: item.id, ...toReturn }]
        }

        return [{ line_item_id: item.id, ...toReturn }]
      })
    )

    return toReturn.flat()
  }

  private prioritizeRates(
    rates: TTaxRate[],
    item: TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO
  ) {
    const isShipping = "shipping_option_id" in item

    const decoratedRates: (TTaxRate & {
      priority_score: number
    })[] = rates.map((rate) => {
      let isProductMatch = false
      let isProductTypeMatch = false
      if (rate.rules.length !== 0) {
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

        if (matchingRules.length !== 0) {
          if (matchingRules.some((rule) => rule.reference === "product")) {
            isProductMatch = true
          } else {
            isProductTypeMatch = true
          }
        }
      }

      const isProvince = rate.tax_region.province_code !== null
      const isDefault = rate.is_default

      if ((isShipping || isProductMatch) && isProvince) {
        return { ...rate, priority_score: 1 }
      }
      if (isProductTypeMatch && isProvince) {
        return { ...rate, priority_score: 2 }
      }
      if (isDefault && isProvince) {
        return { ...rate, priority_score: 3 }
      }
      if (isProductMatch && !isProvince) {
        return { ...rate, priority_score: 4 }
      }
      if (isProductTypeMatch && !isProvince) {
        return { ...rate, priority_score: 5 }
      }
      if (isDefault && !isProvince) {
        return { ...rate, priority_score: 6 }
      }

      return { ...rate, priority_score: 7 }
    })

    return decoratedRates.sort(
      (a, b) => (a as any).priority_score - (b as any).priority_score
    )
  }
}
