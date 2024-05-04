import { Context, DAL, PricingTypes } from "@medusajs/types";
import { RuleType } from "../models";
type InjectedDependencies = {
    ruleTypeRepository: DAL.RepositoryService;
};
declare const RuleTypeService_base: new <TEntity_1 extends object = any>(container: InjectedDependencies) => import("@medusajs/types").InternalModuleService<TEntity_1, InjectedDependencies>;
export default class RuleTypeService<TEntity extends RuleType = RuleType> extends RuleTypeService_base<TEntity> {
    protected readonly ruleTypeRepository_: DAL.RepositoryService<TEntity>;
    constructor({ ruleTypeRepository }: InjectedDependencies);
    create(data: PricingTypes.CreateRuleTypeDTO, sharedContext: Context): Promise<TEntity>;
    create(data: PricingTypes.CreateRuleTypeDTO[], sharedContext: Context): Promise<TEntity[]>;
    update(data: PricingTypes.UpdateRuleTypeDTO[], sharedContext: Context): Promise<TEntity[]>;
    update(data: PricingTypes.UpdateRuleTypeDTO, sharedContext: Context): Promise<TEntity>;
}
export {};
