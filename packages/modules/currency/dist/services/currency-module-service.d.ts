import { DAL, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes, ICurrencyModuleService, CurrencyTypes, Context, FindConfig, FilterableCurrencyProps } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Currency } from "../models";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    currencyService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const CurrencyModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, CurrencyTypes.CurrencyDTO, {
    Currency: {
        dto: CurrencyTypes.CurrencyDTO;
    };
}>;
export default class CurrencyModuleService<TEntity extends Currency = Currency> extends CurrencyModuleService_base implements ICurrencyModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly currencyService_: ModulesSdkTypes.InternalModuleService<TEntity>;
    constructor({ baseRepository, currencyService }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    retrieve(code: string, config?: FindConfig<CurrencyTypes.CurrencyDTO>, sharedContext?: Context): Promise<CurrencyTypes.CurrencyDTO>;
    list(filters?: FilterableCurrencyProps, config?: FindConfig<CurrencyTypes.CurrencyDTO>, sharedContext?: Context): Promise<CurrencyTypes.CurrencyDTO[]>;
    listAndCount(filters?: FilterableCurrencyProps, config?: FindConfig<CurrencyTypes.CurrencyDTO>, sharedContext?: Context): Promise<[CurrencyTypes.CurrencyDTO[], number]>;
    protected static normalizeFilters(filters: FilterableCurrencyProps | undefined): FilterableCurrencyProps | undefined;
}
export {};
