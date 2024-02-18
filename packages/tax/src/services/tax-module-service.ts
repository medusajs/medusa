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
} from "@medusajs/utils"
import { TaxRate, TaxRegion } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  taxRateService: ModulesSdkTypes.InternalModuleService<any>
  taxRegionService: ModulesSdkTypes.InternalModuleService<any>
}

export default class TaxModuleService<
    TTaxRate extends TaxRate = TaxRate,
    TTaxRegion extends TaxRegion = TaxRegion
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    TaxTypes.TaxRateDTO,
    { TaxRegion: { dto: TaxTypes.TaxRegionDTO } }
  >(TaxRate, [TaxRegion], entityNameToLinkableKeysMap)
  implements ITaxModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected taxRateService_: ModulesSdkTypes.InternalModuleService<TTaxRate>
  protected taxRegionService_: ModulesSdkTypes.InternalModuleService<TTaxRegion>

  constructor(
    { baseRepository, taxRateService, taxRegionService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.taxRateService_ = taxRateService
    this.taxRegionService_ = taxRegionService
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

    const rates = regions.map((region, i) => {
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
}
