import { InternalModuleDeclaration } from "@medusajs/modules-sdk";
import { Context, CreateStockLocationInput, IEventBusService, ModuleJoinerConfig, StockLocationAddressInput, StockLocationTypes, ModulesSdkTypes, DAL, IStockLocationServiceNext, FilterableStockLocationProps } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { StockLocation, StockLocationAddress } from "../models";
import { UpdateStockLocationNextInput } from "@medusajs/types";
import { UpsertStockLocationInput } from "@medusajs/types";
type InjectedDependencies = {
    eventBusService: IEventBusService;
    baseRepository: DAL.RepositoryService;
    stockLocationService: ModulesSdkTypes.InternalModuleService<any>;
    stockLocationAddressService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const StockLocationModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, StockLocationTypes.StockLocationDTO, {
    StockLocation: {
        dto: StockLocationTypes.StockLocationDTO;
    };
    StockLocationAddress: {
        dto: StockLocationTypes.StockLocationAddressDTO;
    };
}>;
/**
 * Service for managing stock locations.
 */
export default class StockLocationModuleService<TEntity extends StockLocation = StockLocation, TStockLocationAddress extends StockLocationAddress = StockLocationAddress> extends StockLocationModuleService_base implements IStockLocationServiceNext {
    protected readonly moduleDeclaration?: InternalModuleDeclaration | undefined;
    protected readonly eventBusService_: IEventBusService;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly stockLocationService_: ModulesSdkTypes.InternalModuleService<TEntity>;
    protected readonly stockLocationAddressService_: ModulesSdkTypes.InternalModuleService<TStockLocationAddress>;
    constructor({ eventBusService, baseRepository, stockLocationService, stockLocationAddressService, }: InjectedDependencies, moduleDeclaration?: InternalModuleDeclaration | undefined);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: CreateStockLocationInput, context: Context): Promise<StockLocationTypes.StockLocationDTO>;
    create(data: CreateStockLocationInput[], context: Context): Promise<StockLocationTypes.StockLocationDTO[]>;
    create_(data: CreateStockLocationInput[], context?: Context): Promise<TEntity[]>;
    upsert(data: UpsertStockLocationInput, context?: Context): Promise<StockLocationTypes.StockLocationDTO>;
    upsert(data: UpsertStockLocationInput[], context?: Context): Promise<StockLocationTypes.StockLocationDTO[]>;
    upsert_(input: UpsertStockLocationInput[], context?: Context): Promise<StockLocation[]>;
    update(id: string, input: UpdateStockLocationNextInput, context?: Context): Promise<StockLocationTypes.StockLocationDTO>;
    update(selector: FilterableStockLocationProps, input: UpdateStockLocationNextInput, context?: Context): Promise<StockLocationTypes.StockLocationDTO[]>;
    update_(data: UpdateStockLocationNextInput[] | UpdateStockLocationNextInput | {
        data: any;
        selector: FilterableStockLocationProps;
    }, context?: Context): Promise<TEntity[] | TEntity>;
    updateStockLocationAddress(data: StockLocationAddressInput & {
        id: string;
    }, context?: Context): Promise<StockLocationTypes.StockLocationAddressDTO>;
    updateStockLocationAddress(data: (StockLocationAddressInput & {
        id: string;
    })[], context?: Context): Promise<StockLocationTypes.StockLocationAddressDTO[]>;
    private updateStockLocationAddress_;
}
export {};
