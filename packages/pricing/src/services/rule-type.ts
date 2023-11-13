import { Context, DAL, FindConfig } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { RuleType } from "@models"
import {
  CreateRuleTypeDTO,
  FilterableRuleTypeProps,
  RuleTypeDTO,
  UpdateRuleTypeDTO,
} from "../types"

type InjectedDependencies = {
  ruleTypeRepository: DAL.RepositoryService
}

export default class RuleTypeService<TEntity extends RuleType = RuleType> {
  protected readonly ruleTypeRepository_: DAL.RepositoryService

  constructor({ ruleTypeRepository }: InjectedDependencies) {
    this.ruleTypeRepository_ = ruleTypeRepository
  }

  @InjectManager("ruleTypeRepository_")
  async retrieve(
    ruleTypeId: string,
    config: FindConfig<RuleTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<RuleType, RuleTypeDTO>({
      id: ruleTypeId,
      identifierColumn: "id",
      entityName: RuleType.name,
      repository: this.ruleTypeRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("ruleTypeRepository_")
  async list(
    filters: FilterableRuleTypeProps = {},
    config: FindConfig<RuleTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<RuleType>(filters, config)

    return (await this.ruleTypeRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("ruleTypeRepository_")
  async listAndCount(
    filters: FilterableRuleTypeProps = {},
    config: FindConfig<RuleTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    const queryOptions = ModulesSdkUtils.buildQuery<RuleType>(filters, config)

    return (await this.ruleTypeRepository_.findAndCount(
      queryOptions,
      sharedContext
    )) as [TEntity[], number]
  }

  @InjectTransactionManager("ruleTypeRepository_")
  async create(
    data: CreateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.ruleTypeRepository_.create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("ruleTypeRepository_")
  async update(
    data: UpdateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.ruleTypeRepository_.update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("ruleTypeRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.ruleTypeRepository_.delete(ids, sharedContext)
  }
}
