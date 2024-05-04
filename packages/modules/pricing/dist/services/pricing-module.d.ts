import { AddPricesDTO, Context, CreatePriceRuleDTO, DAL, FindConfig, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes, PriceSetDTO, PricingContext, PricingFilters, PricingRepositoryService, PricingTypes, RuleTypeDTO, UpsertPriceSetDTO } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Price, PriceList, PriceListRule, PriceListRuleValue, PriceRule, PriceSet, PriceSetRuleType, RuleType } from "../models";
import { PriceListService, RuleTypeService } from ".";
import { UpdatePriceSetInput } from "src/types/services";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    pricingRepository: PricingRepositoryService;
    priceSetService: ModulesSdkTypes.InternalModuleService<any>;
    ruleTypeService: RuleTypeService<any>;
    priceRuleService: ModulesSdkTypes.InternalModuleService<any>;
    priceSetRuleTypeService: ModulesSdkTypes.InternalModuleService<any>;
    priceService: ModulesSdkTypes.InternalModuleService<any>;
    priceListService: PriceListService<any>;
    priceListRuleService: ModulesSdkTypes.InternalModuleService<any>;
    priceListRuleValueService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const PricingModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, PriceSetDTO, {
    Price: {
        dto: PricingTypes.PriceDTO;
    };
    PriceRule: {
        dto: PricingTypes.PriceRuleDTO;
        create: PricingTypes.CreatePriceRuleDTO;
        update: PricingTypes.UpdatePriceRuleDTO;
    };
    RuleType: {
        dto: PricingTypes.RuleTypeDTO;
        create: PricingTypes.CreateRuleTypeDTO;
        update: PricingTypes.UpdateRuleTypeDTO;
    };
    PriceList: {
        dto: PricingTypes.PriceListDTO;
    };
    PriceListRule: {
        dto: PricingTypes.PriceListRuleDTO;
    };
}>;
export default class PricingModuleService<TPriceSet extends PriceSet = PriceSet, TRuleType extends RuleType = RuleType, TPriceRule extends PriceRule = PriceRule, TPriceSetRuleType extends PriceSetRuleType = PriceSetRuleType, TPrice extends Price = Price, TPriceList extends PriceList = PriceList, TPriceListRule extends PriceListRule = PriceListRule, TPriceListRuleValue extends PriceListRuleValue = PriceListRuleValue> extends PricingModuleService_base implements PricingTypes.IPricingModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly pricingRepository_: PricingRepositoryService;
    protected readonly ruleTypeService_: RuleTypeService<TRuleType>;
    protected readonly priceSetService_: ModulesSdkTypes.InternalModuleService<TPriceSet>;
    protected readonly priceRuleService_: ModulesSdkTypes.InternalModuleService<TPriceRule>;
    protected readonly priceSetRuleTypeService_: ModulesSdkTypes.InternalModuleService<TPriceSetRuleType>;
    protected readonly priceService_: ModulesSdkTypes.InternalModuleService<TPrice>;
    protected readonly priceListService_: PriceListService<TPriceList>;
    protected readonly priceListRuleService_: ModulesSdkTypes.InternalModuleService<TPriceListRule>;
    protected readonly priceListRuleValueService_: ModulesSdkTypes.InternalModuleService<TPriceListRuleValue>;
    constructor({ baseRepository, pricingRepository, ruleTypeService, priceSetService, priceRuleService, priceSetRuleTypeService, priceService, priceListService, priceListRuleService, priceListRuleValueService, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    private setupCalculatedPriceConfig_;
    list(filters?: PricingTypes.FilterablePriceSetProps, config?: FindConfig<PricingTypes.PriceSetDTO>, sharedContext?: Context): Promise<PriceSetDTO[]>;
    listAndCount(filters?: PricingTypes.FilterablePriceSetProps, config?: FindConfig<PricingTypes.PriceSetDTO>, sharedContext?: Context): Promise<[PriceSetDTO[], number]>;
    calculatePrices(pricingFilters: PricingFilters, pricingContext?: PricingContext, sharedContext?: Context): Promise<PricingTypes.CalculatedPriceSet[]>;
    create(data: PricingTypes.CreatePriceSetDTO, sharedContext?: Context): Promise<PriceSetDTO>;
    create(data: PricingTypes.CreatePriceSetDTO[], sharedContext?: Context): Promise<PriceSetDTO[]>;
    upsert(data: UpsertPriceSetDTO[], sharedContext?: Context): Promise<PriceSetDTO[]>;
    upsert(data: UpsertPriceSetDTO, sharedContext?: Context): Promise<PriceSetDTO>;
    update(id: string, data: PricingTypes.UpdatePriceSetDTO, sharedContext?: Context): Promise<PriceSetDTO>;
    update(selector: PricingTypes.FilterablePriceSetProps, data: PricingTypes.UpdatePriceSetDTO, sharedContext?: Context): Promise<PriceSetDTO[]>;
    private normalizeUpdateData;
    protected update_(data: UpdatePriceSetInput[], sharedContext?: Context): Promise<PriceSet[]>;
    addRules(data: PricingTypes.AddRulesDTO, sharedContext?: Context): Promise<PricingTypes.PriceSetDTO>;
    addRules(data: PricingTypes.AddRulesDTO[], sharedContext?: Context): Promise<PricingTypes.PriceSetDTO[]>;
    addPrices(data: AddPricesDTO, sharedContext?: Context): Promise<PricingTypes.PriceSetDTO>;
    addPrices(data: AddPricesDTO[], sharedContext?: Context): Promise<PricingTypes.PriceSetDTO[]>;
    removeRules(data: PricingTypes.RemovePriceSetRulesDTO[], sharedContext?: Context): Promise<void>;
    createPriceLists(data: PricingTypes.CreatePriceListDTO[], sharedContext?: Context): Promise<PricingTypes.PriceListDTO[]>;
    updatePriceLists(data: PricingTypes.UpdatePriceListDTO[], sharedContext?: Context): Promise<PricingTypes.PriceListDTO[]>;
    createPriceListRules(data: PricingTypes.CreatePriceListRuleDTO[], sharedContext?: Context): Promise<PricingTypes.PriceListRuleDTO[]>;
    createPriceListRules_(data: PricingTypes.CreatePriceListRuleDTO[], sharedContext?: Context): Promise<TPriceListRule[]>;
    updatePriceListRules(data: PricingTypes.UpdatePriceListRuleDTO[], sharedContext?: Context): Promise<PricingTypes.PriceListRuleDTO[]>;
    updatePriceListPrices(data: PricingTypes.UpdatePriceListPricesDTO[], sharedContext?: Context): Promise<PricingTypes.PriceDTO[]>;
    removePrices(ids: string[], sharedContext?: Context): Promise<void>;
    addPriceListPrices(data: PricingTypes.AddPriceListPricesDTO[], sharedContext?: Context): Promise<PricingTypes.PriceDTO[]>;
    setPriceListRules(data: PricingTypes.SetPriceListRulesDTO, sharedContext?: Context): Promise<PricingTypes.PriceListDTO>;
    removePriceListRules(data: PricingTypes.RemovePriceListRulesDTO, sharedContext?: Context): Promise<PricingTypes.PriceListDTO>;
    protected create_(data: PricingTypes.CreatePriceSetDTO[], sharedContext?: Context): Promise<TPriceSet[]>;
    protected addRules_(inputs: PricingTypes.AddRulesDTO[], sharedContext?: Context): Promise<TPriceSet[]>;
    protected addPrices_(input: AddPricesDTO[], sharedContext?: Context): Promise<void>;
    protected createPriceLists_(data: PricingTypes.CreatePriceListDTO[], sharedContext?: Context): Promise<TPriceList[]>;
    protected updatePriceLists_(data: PricingTypes.UpdatePriceListDTO[], sharedContext?: Context): Promise<PricingTypes.PriceListDTO[]>;
    protected updatePriceListPrices_(data: PricingTypes.UpdatePriceListPricesDTO[], sharedContext?: Context): Promise<TPrice[]>;
    protected removePrices_(ids: string[], sharedContext?: Context): Promise<void>;
    protected addPriceListPrices_(data: PricingTypes.AddPriceListPricesDTO[], sharedContext?: Context): Promise<TPrice[]>;
    protected setPriceListRules_(data: PricingTypes.SetPriceListRulesDTO[], sharedContext?: Context): Promise<TPriceList[]>;
    protected removePriceListRules_(data: PricingTypes.RemovePriceListRulesDTO[], sharedContext?: Context): Promise<TPriceList[]>;
}
export {};
