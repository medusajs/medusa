import { Context, DAL, PricingTypes } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  validateRuleAttributes,
} from "@medusajs/utils"
import { RuleType } from "@models"

type InjectedDependencies = {
  ruleTypeRepository: DAL.RepositoryService
}

export default class RuleTypeService<
  TEntity extends RuleType = RuleType
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  RuleType
)<TEntity> {
  protected readonly ruleTypeRepository_: DAL.RepositoryService<TEntity>

  constructor({ ruleTypeRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.ruleTypeRepository_ = ruleTypeRepository
  }

  create(
    data: PricingTypes.CreateRuleTypeDTO,
    sharedContext: Context
  ): Promise<TEntity>
  create(
    data: PricingTypes.CreateRuleTypeDTO[],
    sharedContext: Context
  ): Promise<TEntity[]>

  @InjectTransactionManager("ruleTypeRepository_")
  async create(
    data: PricingTypes.CreateRuleTypeDTO | PricingTypes.CreateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]
    validateRuleAttributes(data_.map((d) => d.rule_attribute))
    return await super.create(data, sharedContext)
  }

  // @ts-ignore
  update(
    data: PricingTypes.UpdateRuleTypeDTO[],
    sharedContext: Context
  ): Promise<TEntity[]>
  // @ts-ignore
  update(
    data: PricingTypes.UpdateRuleTypeDTO,
    sharedContext: Context
  ): Promise<TEntity>

  @InjectTransactionManager("ruleTypeRepository_")
  // TODO: add support for selector? and then rm ts ignore
  // @ts-ignore
  async update(
    data: PricingTypes.UpdateRuleTypeDTO | PricingTypes.UpdateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]
    validateRuleAttributes(data_.map((d) => d.rule_attribute))
    return await super.update(data, sharedContext)
  }
}
