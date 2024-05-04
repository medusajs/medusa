import { Context, DAL, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes, PromotionTypes } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { ApplicationMethod, Campaign, CampaignBudget, Promotion, PromotionRule, PromotionRuleValue } from "../models";
import { ApplicationMethodRuleTypes } from "../types";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    promotionService: ModulesSdkTypes.InternalModuleService<any>;
    applicationMethodService: ModulesSdkTypes.InternalModuleService<any>;
    promotionRuleService: ModulesSdkTypes.InternalModuleService<any>;
    promotionRuleValueService: ModulesSdkTypes.InternalModuleService<any>;
    campaignService: ModulesSdkTypes.InternalModuleService<any>;
    campaignBudgetService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const PromotionModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, PromotionTypes.PromotionDTO, {
    ApplicationMethod: {
        dto: PromotionTypes.ApplicationMethodDTO;
    };
    Campaign: {
        dto: PromotionTypes.CampaignDTO;
    };
    CampaignBudget: {
        dto: PromotionTypes.CampaignBudgetDTO;
    };
    PromotionRule: {
        dto: PromotionTypes.PromotionRuleDTO;
    };
    PromotionRuleValue: {
        dto: PromotionTypes.PromotionRuleValueDTO;
    };
}>;
export default class PromotionModuleService<TApplicationMethod extends ApplicationMethod = ApplicationMethod, TPromotion extends Promotion = Promotion, TPromotionRule extends PromotionRule = PromotionRule, TPromotionRuleValue extends PromotionRuleValue = PromotionRuleValue, TCampaign extends Campaign = Campaign, TCampaignBudget extends CampaignBudget = CampaignBudget> extends PromotionModuleService_base implements PromotionTypes.IPromotionModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected promotionService_: ModulesSdkTypes.InternalModuleService<TPromotion>;
    protected applicationMethodService_: ModulesSdkTypes.InternalModuleService<TApplicationMethod>;
    protected promotionRuleService_: ModulesSdkTypes.InternalModuleService<TPromotionRule>;
    protected promotionRuleValueService_: ModulesSdkTypes.InternalModuleService<TPromotionRuleValue>;
    protected campaignService_: ModulesSdkTypes.InternalModuleService<TCampaign>;
    protected campaignBudgetService_: ModulesSdkTypes.InternalModuleService<TCampaignBudget>;
    constructor({ baseRepository, promotionService, applicationMethodService, promotionRuleService, promotionRuleValueService, campaignService, campaignBudgetService, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    registerUsage(computedActions: PromotionTypes.UsageComputedActions[], sharedContext?: Context): Promise<void>;
    computeActions(promotionCodes: string[], applicationContext: PromotionTypes.ComputeActionContext, options?: PromotionTypes.ComputeActionOptions, sharedContext?: Context): Promise<PromotionTypes.ComputeActions[]>;
    create(data: PromotionTypes.CreatePromotionDTO, sharedContext?: Context): Promise<PromotionTypes.PromotionDTO>;
    create(data: PromotionTypes.CreatePromotionDTO[], sharedContext?: Context): Promise<PromotionTypes.PromotionDTO[]>;
    protected create_(data: PromotionTypes.CreatePromotionDTO[], sharedContext?: Context): Promise<TPromotion[]>;
    update(data: PromotionTypes.UpdatePromotionDTO, sharedContext?: Context): Promise<PromotionTypes.PromotionDTO>;
    update(data: PromotionTypes.UpdatePromotionDTO[], sharedContext?: Context): Promise<PromotionTypes.PromotionDTO[]>;
    protected update_(data: PromotionTypes.UpdatePromotionDTO[], sharedContext?: Context): Promise<TPromotion[]>;
    updatePromotionRules(data: PromotionTypes.UpdatePromotionRuleDTO[], sharedContext?: Context): Promise<PromotionTypes.PromotionRuleDTO[]>;
    protected updatePromotionRules_(data: PromotionTypes.UpdatePromotionRuleDTO[], sharedContext?: Context): Promise<TPromotionRule[]>;
    addPromotionRules(promotionId: string, rulesData: PromotionTypes.CreatePromotionRuleDTO[], sharedContext?: Context): Promise<PromotionTypes.PromotionRuleDTO[]>;
    addPromotionTargetRules(promotionId: string, rulesData: PromotionTypes.CreatePromotionRuleDTO[], sharedContext?: Context): Promise<PromotionTypes.PromotionRuleDTO[]>;
    addPromotionBuyRules(promotionId: string, rulesData: PromotionTypes.CreatePromotionRuleDTO[], sharedContext?: Context): Promise<PromotionTypes.PromotionRuleDTO[]>;
    protected createPromotionRulesAndValues_(rulesData: PromotionTypes.CreatePromotionRuleDTO[], relationName: "promotions" | "method_target_rules" | "method_buy_rules", relation: Promotion | ApplicationMethod, sharedContext?: Context): Promise<TPromotionRule[]>;
    removePromotionRules(promotionId: string, ruleIds: string[], sharedContext?: Context): Promise<void>;
    protected removePromotionRules_(promotionId: string, ruleIds: string[], sharedContext?: Context): Promise<void>;
    removePromotionTargetRules(promotionId: string, ruleIds: string[], sharedContext?: Context): Promise<void>;
    removePromotionBuyRules(promotionId: string, ruleIds: string[], sharedContext?: Context): Promise<void>;
    protected removeApplicationMethodRules_(promotionId: string, ruleIds: string[], relation: ApplicationMethodRuleTypes.TARGET_RULES | ApplicationMethodRuleTypes.BUY_RULES, sharedContext?: Context): Promise<void>;
    createCampaigns(data: PromotionTypes.CreateCampaignDTO, sharedContext?: Context): Promise<PromotionTypes.CampaignDTO>;
    createCampaigns(data: PromotionTypes.CreateCampaignDTO[], sharedContext?: Context): Promise<PromotionTypes.CampaignDTO[]>;
    protected createCampaigns_(data: PromotionTypes.CreateCampaignDTO[], sharedContext?: Context): Promise<TCampaign[]>;
    updateCampaigns(data: PromotionTypes.UpdateCampaignDTO, sharedContext?: Context): Promise<PromotionTypes.CampaignDTO>;
    updateCampaigns(data: PromotionTypes.UpdateCampaignDTO[], sharedContext?: Context): Promise<PromotionTypes.CampaignDTO[]>;
    protected updateCampaigns_(data: PromotionTypes.UpdateCampaignDTO[], sharedContext?: Context): Promise<TCampaign[]>;
}
export {};
//# sourceMappingURL=promotion-module.d.ts.map