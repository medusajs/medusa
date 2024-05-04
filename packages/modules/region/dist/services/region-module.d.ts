import { Context, CreateRegionDTO, DAL, FilterableRegionProps, InternalModuleDeclaration, IRegionModuleService, ModuleJoinerConfig, ModulesSdkTypes, RegionCountryDTO, RegionDTO, UpdateRegionDTO, UpsertRegionDTO } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Country, Region } from "../models";
import { UpdateRegionInput } from "../types";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    regionService: ModulesSdkTypes.InternalModuleService<any>;
    countryService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const RegionModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, RegionDTO, {
    Country: {
        dto: RegionCountryDTO;
    };
}>;
export default class RegionModuleService<TRegion extends Region = Region, TCountry extends Country = Country> extends RegionModuleService_base implements IRegionModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly regionService_: ModulesSdkTypes.InternalModuleService<TRegion>;
    protected readonly countryService_: ModulesSdkTypes.InternalModuleService<TCountry>;
    constructor({ baseRepository, regionService, countryService }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: CreateRegionDTO[], sharedContext?: Context): Promise<RegionDTO[]>;
    create(data: CreateRegionDTO, sharedContext?: Context): Promise<RegionDTO>;
    create_(data: CreateRegionDTO[], sharedContext?: Context): Promise<Region[]>;
    upsert(data: UpsertRegionDTO[], sharedContext?: Context): Promise<RegionDTO[]>;
    upsert(data: UpsertRegionDTO, sharedContext?: Context): Promise<RegionDTO>;
    update(id: string, data: UpdateRegionDTO, sharedContext?: Context): Promise<RegionDTO>;
    update(selector: FilterableRegionProps, data: UpdateRegionDTO, sharedContext?: Context): Promise<RegionDTO[]>;
    protected update_(data: UpdateRegionInput[], sharedContext?: Context): Promise<Region[]>;
    private static normalizeInput;
    /**
     * Validate that countries can be assigned to a region.
     *
     * NOTE: this method relies on countries of the regions that we are assigning to need to be unassigned first.
     * @param countries
     * @param sharedContext
     * @private
     */
    private validateCountries;
}
export {};
