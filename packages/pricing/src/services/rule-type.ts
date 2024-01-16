import { Context, DAL } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  validateRuleAttributes,
} from "@medusajs/utils"
import { RuleType } from "@models"
import { ServiceTypes } from "@types"

type InjectedDependencies = {
  ruleTypeRepository: DAL.RepositoryService
}

export default class RuleTypeService<
  TEntity extends RuleType = RuleType
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ServiceTypes.CreateRuleTypeDTO
    update: ServiceTypes.UpdateRuleTypeDTO
  },
  {
    list: ServiceTypes.FilterableRuleTypeProps
    listAndCount: ServiceTypes.FilterableRuleTypeProps
  }
>(RuleType)<TEntity> {
  protected readonly ruleTypeRepository_: DAL.RepositoryService<TEntity>

  constructor({ ruleTypeRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.ruleTypeRepository_ = ruleTypeRepository
  }

  @InjectTransactionManager("ruleTypeRepository_")
  async create(
    data: ServiceTypes.CreateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    validateRuleAttributes(data.map((d) => d.rule_attribute))
    return await this.ruleTypeRepository_.create(data, sharedContext)
  }

  @InjectTransactionManager("ruleTypeRepository_")
  async update(
    data: ServiceTypes.UpdateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    validateRuleAttributes(data.map((d) => d.rule_attribute))
    return await this.ruleTypeRepository_.update(data, sharedContext)
  }
}
