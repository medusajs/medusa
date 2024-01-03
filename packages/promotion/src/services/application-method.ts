import { Context, DAL, FindConfig, PromotionTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { ApplicationMethod } from "@models"
import { ApplicationMethodRepository } from "@repositories"
import {
  CreateApplicationMethodDTO,
  UpdateApplicationMethodDTO,
} from "../types"

type InjectedDependencies = {
  applicationMethodRepository: DAL.RepositoryService
}

export default class ApplicationMethodService<
  TEntity extends ApplicationMethod = ApplicationMethod
> {
  protected readonly applicationMethodRepository_: DAL.RepositoryService

  constructor({ applicationMethodRepository }: InjectedDependencies) {
    this.applicationMethodRepository_ = applicationMethodRepository
  }

  @InjectManager("applicationMethodRepository_")
  async retrieve(
    applicationMethodId: string,
    config: FindConfig<PromotionTypes.ApplicationMethodDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      ApplicationMethod,
      PromotionTypes.ApplicationMethodDTO
    >({
      id: applicationMethodId,
      entityName: ApplicationMethod.name,
      repository: this.applicationMethodRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("applicationMethodRepository_")
  async list(
    filters: PromotionTypes.FilterableApplicationMethodProps = {},
    config: FindConfig<PromotionTypes.ApplicationMethodDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ApplicationMethod>(
      filters,
      config
    )

    return (await this.applicationMethodRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("applicationMethodRepository_")
  async listAndCount(
    filters: PromotionTypes.FilterableApplicationMethodProps = {},
    config: FindConfig<PromotionTypes.ApplicationMethodDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ApplicationMethod>(
      filters,
      config
    )

    return (await this.applicationMethodRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("applicationMethodRepository_")
  async create(
    data: CreateApplicationMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.applicationMethodRepository_ as ApplicationMethodRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("applicationMethodRepository_")
  async update(
    data: UpdateApplicationMethodDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.applicationMethodRepository_ as ApplicationMethodRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("applicationMethodRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.applicationMethodRepository_.delete(ids, sharedContext)
  }
}
