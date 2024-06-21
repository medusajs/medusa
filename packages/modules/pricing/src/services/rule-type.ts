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

export default class RuleTypeService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  RuleType
)<RuleType> {
  protected readonly ruleTypeRepository_: DAL.RepositoryService<RuleType>

  constructor({ ruleTypeRepository }: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
    this.ruleTypeRepository_ = ruleTypeRepository
  }

  create(
    data: PricingTypes.CreateRuleTypeDTO,
    sharedContext: Context
  ): Promise<RuleType>
  create(
    data: PricingTypes.CreateRuleTypeDTO[],
    sharedContext: Context
  ): Promise<RuleType[]>

  @InjectTransactionManager("ruleTypeRepository_")
  async create(
    data: PricingTypes.CreateRuleTypeDTO | PricingTypes.CreateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RuleType | RuleType[]> {
    const data_ = Array.isArray(data) ? data : [data]
    validateRuleAttributes(data_.map((d) => d.rule_attribute))
    return await super.create(data, sharedContext)
  }

  // @ts-ignore
  update(
    data: PricingTypes.UpdateRuleTypeDTO[],
    sharedContext: Context
  ): Promise<RuleType[]>
  // @ts-ignore
  update(
    data: PricingTypes.UpdateRuleTypeDTO,
    sharedContext: Context
  ): Promise<RuleType>

  @InjectTransactionManager("ruleTypeRepository_")
  // TODO: add support for selector? and then rm ts ignore
  // @ts-ignore
  async update(
    data: PricingTypes.UpdateRuleTypeDTO | PricingTypes.UpdateRuleTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<RuleType | RuleType[]> {
    const data_ = Array.isArray(data) ? data : [data]
    validateRuleAttributes(data_.map((d) => d.rule_attribute))
    return await super.update(data, sharedContext)
  }
}
