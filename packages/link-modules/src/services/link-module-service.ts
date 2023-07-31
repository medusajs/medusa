import {
  Context,
  DAL,
  FindConfig,
  ILinkModule,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import { PivotService } from "@services"
import { shouldForceTransaction } from "../utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  pivotService: PivotService<any>
  primaryKey: string | string[]
  foreignKey: string
}

export default class LinkModuleService<TPivot> implements ILinkModule {
  protected baseRepository_: DAL.RepositoryService
  protected readonly pivotService_: PivotService<TPivot>
  protected primaryKey_: string[]
  protected foreignKey_: string

  constructor(
    {
      baseRepository,
      pivotService,
      primaryKey,
      foreignKey,
    }: InjectedDependencies,
    readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
    this.pivotService_ = pivotService
    this.primaryKey_ = !Array.isArray(primaryKey) ? [primaryKey] : primaryKey
    this.foreignKey_ = foreignKey
  }

  __joinerConfig(): ModuleJoinerConfig {
    return {} as ModuleJoinerConfig
  }

  async list(
    filters: Record<string, unknown> = {},
    config: FindConfig<unknown> = {},
    sharedContext?: Context
  ): Promise<unknown[]> {
    const products = await this.pivotService_.list(
      filters,
      config,
      sharedContext
    )

    return JSON.parse(JSON.stringify(products))
  }

  async listAndCount(
    filters: Record<string, unknown> = {},
    config: FindConfig<unknown> = {},
    sharedContext?: Context
  ): Promise<[unknown[], number]> {
    const [products, count] = await this.pivotService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [JSON.parse(JSON.stringify(products)), count]
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async create(data: unknown[], @MedusaContext() sharedContext: Context = {}) {
    const filter = this.primaryKey_.map((key, index) => ({
      [key]: primaryKeyData[index],
    }))
    filter[this.foreignKey_] = foreignKeyData

    const links = await this.pivotService_.create(data, sharedContext)
    return links
  }

  @InjectTransactionManager(shouldForceTransaction, "baseRepository_")
  async delete(
    productIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<unknown[]> {
    return await this.pivotService_.delete(productIds, sharedContext)
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
