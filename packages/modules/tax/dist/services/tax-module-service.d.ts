import { Context, DAL, ITaxModuleService, ITaxProvider, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes, TaxRegionDTO, TaxTypes } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { TaxProvider, TaxRate, TaxRateRule, TaxRegion } from "../models";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    taxRateService: ModulesSdkTypes.InternalModuleService<any>;
    taxRegionService: ModulesSdkTypes.InternalModuleService<any>;
    taxRateRuleService: ModulesSdkTypes.InternalModuleService<any>;
    taxProviderService: ModulesSdkTypes.InternalModuleService<any>;
    [key: `tp_${string}`]: ITaxProvider;
};
declare const TaxModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, TaxTypes.TaxRateDTO, {
    TaxRegion: {
        dto: TaxTypes.TaxRegionDTO;
    };
    TaxRateRule: {
        dto: TaxTypes.TaxRateRuleDTO;
    };
    TaxProvider: {
        dto: TaxTypes.TaxProviderDTO;
    };
}>;
export default class TaxModuleService<TTaxRate extends TaxRate = TaxRate, TTaxRegion extends TaxRegion = TaxRegion, TTaxRateRule extends TaxRateRule = TaxRateRule, TTaxProvider extends TaxProvider = TaxProvider> extends TaxModuleService_base implements ITaxModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected readonly container_: InjectedDependencies;
    protected baseRepository_: DAL.RepositoryService;
    protected taxRateService_: ModulesSdkTypes.InternalModuleService<TTaxRate>;
    protected taxRegionService_: ModulesSdkTypes.InternalModuleService<TTaxRegion>;
    protected taxRateRuleService_: ModulesSdkTypes.InternalModuleService<TTaxRateRule>;
    protected taxProviderService_: ModulesSdkTypes.InternalModuleService<TTaxProvider>;
    constructor({ baseRepository, taxRateService, taxRegionService, taxRateRuleService, taxProviderService, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: TaxTypes.CreateTaxRateDTO[], sharedContext?: Context): Promise<TaxTypes.TaxRateDTO[]>;
    create(data: TaxTypes.CreateTaxRateDTO, sharedContext?: Context): Promise<TaxTypes.TaxRateDTO>;
    protected create_(data: TaxTypes.CreateTaxRateDTO[], sharedContext?: Context): Promise<TaxTypes.TaxRateDTO[]>;
    update(id: string, data: TaxTypes.UpdateTaxRateDTO, sharedContext?: Context): Promise<TaxTypes.TaxRateDTO>;
    update(ids: string[], data: TaxTypes.UpdateTaxRateDTO, sharedContext?: Context): Promise<TaxTypes.TaxRateDTO[]>;
    update(selector: TaxTypes.FilterableTaxRateProps, data: TaxTypes.UpdateTaxRateDTO, sharedContext?: Context): Promise<TaxTypes.TaxRateDTO[]>;
    protected update_(idOrSelector: string | string[] | TaxTypes.FilterableTaxRateProps, data: TaxTypes.UpdateTaxRateDTO, sharedContext?: Context): Promise<TTaxRate>;
    private setTaxRateRulesForTaxRates;
    private getTaxRateIdsFromSelector;
    upsert(data: TaxTypes.UpsertTaxRateDTO[], sharedContext?: Context): Promise<TaxTypes.TaxRateDTO[]>;
    upsert(data: TaxTypes.UpsertTaxRateDTO, sharedContext?: Context): Promise<TaxTypes.TaxRateDTO>;
    createTaxRegions(data: TaxTypes.CreateTaxRegionDTO, sharedContext?: Context): Promise<TaxRegionDTO>;
    createTaxRegions(data: TaxTypes.CreateTaxRegionDTO[], sharedContext?: Context): Promise<TaxRegionDTO[]>;
    createTaxRegions_(data: TaxTypes.CreateTaxRegionDTO[], sharedContext?: Context): Promise<TaxRegionDTO[]>;
    createTaxRateRules(data: TaxTypes.CreateTaxRateRuleDTO, sharedContext?: Context): Promise<TaxTypes.TaxRateRuleDTO>;
    createTaxRateRules(data: TaxTypes.CreateTaxRateRuleDTO[], sharedContext?: Context): Promise<TaxTypes.TaxRateRuleDTO[]>;
    createTaxRateRules_(data: TaxTypes.CreateTaxRateRuleDTO[], sharedContext?: Context): Promise<TaxTypes.TaxRateRuleDTO[]>;
    getTaxLines(items: (TaxTypes.TaxableItemDTO | TaxTypes.TaxableShippingDTO)[], calculationContext: TaxTypes.TaxCalculationContext, sharedContext?: Context): Promise<(TaxTypes.ItemTaxLineDTO | TaxTypes.ShippingTaxLineDTO)[]>;
    private getTaxLinesFromProvider;
    private normalizeTaxCalculationContext;
    private prepareTaxRegionInputForCreate;
    private verifyProvinceToCountryMatch;
    private getTaxRatesForItem;
    private getTaxRateQueryForItem;
    private checkRuleMatches;
    private prioritizeRates;
    private normalizeRegionCodes;
}
export {};
