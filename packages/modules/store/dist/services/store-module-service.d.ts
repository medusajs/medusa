import { DAL, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes, IStoreModuleService, StoreTypes, Context } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Store } from "../models";
import { UpdateStoreInput } from "../types";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    storeService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const StoreModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, StoreTypes.StoreDTO, {
    Store: {
        dto: StoreTypes.StoreDTO;
    };
}>;
export default class StoreModuleService<TEntity extends Store = Store> extends StoreModuleService_base implements IStoreModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly storeService_: ModulesSdkTypes.InternalModuleService<TEntity>;
    constructor({ baseRepository, storeService }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: StoreTypes.CreateStoreDTO[], sharedContext?: Context): Promise<StoreTypes.StoreDTO[]>;
    create(data: StoreTypes.CreateStoreDTO, sharedContext?: Context): Promise<StoreTypes.StoreDTO>;
    create_(data: StoreTypes.CreateStoreDTO[], sharedContext?: Context): Promise<Store[]>;
    upsert(data: StoreTypes.UpsertStoreDTO[], sharedContext?: Context): Promise<StoreTypes.StoreDTO[]>;
    upsert(data: StoreTypes.UpsertStoreDTO, sharedContext?: Context): Promise<StoreTypes.StoreDTO>;
    update(id: string, data: StoreTypes.UpdateStoreDTO, sharedContext?: Context): Promise<StoreTypes.StoreDTO>;
    update(selector: StoreTypes.FilterableStoreProps, data: StoreTypes.UpdateStoreDTO, sharedContext?: Context): Promise<StoreTypes.StoreDTO[]>;
    protected update_(data: UpdateStoreInput[], sharedContext?: Context): Promise<Store[]>;
    private static normalizeInput;
    private static validateCreateRequest;
    private validateUpdateRequest;
}
export {};
