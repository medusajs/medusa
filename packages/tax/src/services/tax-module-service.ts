import {
  Context,
  DAL,
  ITaxRateModuleService,
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
import { TaxRate } from "@models"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  taxRateService: ModulesSdkTypes.InternalModuleService<any>
}

export default class TaxModuleService<TTaxRate extends TaxRate = TaxRate>
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    TaxTypes.TaxRateDTO,
    {}
  >(TaxRate, [], entityNameToLinkableKeysMap)
  implements ITaxRateModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected taxRateService_: ModulesSdkTypes.InternalModuleService<TTaxRate>

  constructor(
    { baseRepository, taxRateService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.taxRateService_ = taxRateService
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
}
