import { PivotService } from "@services"
import {
  Context,
  DAL,
  FindConfig,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  ProductTypes,
} from "@medusajs/types"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import { shouldForceTransaction } from "../utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  pivotService: PivotService<any>
}

export default class LinkModuleService<TPivot> {
  baseRepository_: DAL.RepositoryService
  readonly pivotService_: PivotService<TPivot>

  constructor(
    { baseRepository, pivotService }: InjectedDependencies,
    readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.pivotService_ = pivotService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return {} as ModuleJoinerConfig
  }

  async list(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<unknown> = {},
    sharedContext?: Context
  ): Promise<ProductTypes.ProductDTO[]> {
    const products = await this.pivotService_.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(products))
  }

  async listAndCount(
    filters: ProductTypes.FilterableProductProps = {},
    config: FindConfig<unknown> = {},
    sharedContext?: Context
  ): Promise<[ProductTypes.ProductDTO[], number]> {
    const [products, count] = await this.pivotService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [JSON.parse(JSON.stringify(products)), count]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create(data: unknown[], @MedusaContext() sharedContext: Context = {}) {
    const links = await this.pivotService_.create(data, sharedContext)
    return links
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.pivotService_.delete(productIds, sharedContext)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async softDelete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TPivot[]> {
    return await this.pivotService_.softDelete(productIds, sharedContext)
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async restore(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TPivot[]> {
    return await this.pivotService_.restore(productIds, sharedContext)
  }
}
