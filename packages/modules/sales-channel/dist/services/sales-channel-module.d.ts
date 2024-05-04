import { Context, CreateSalesChannelDTO, DAL, FilterableSalesChannelProps, InternalModuleDeclaration, ISalesChannelModuleService, ModuleJoinerConfig, ModulesSdkTypes, SalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { SalesChannel } from "../models";
import { UpsertSalesChannelDTO } from "@medusajs/types";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    salesChannelService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const SalesChannelModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, SalesChannelDTO, {}>;
export default class SalesChannelModuleService<TEntity extends SalesChannel = SalesChannel> extends SalesChannelModuleService_base implements ISalesChannelModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly salesChannelService_: ModulesSdkTypes.InternalModuleService<TEntity>;
    constructor({ baseRepository, salesChannelService }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: CreateSalesChannelDTO[], sharedContext?: Context): Promise<SalesChannelDTO[]>;
    create(data: CreateSalesChannelDTO, sharedContext?: Context): Promise<SalesChannelDTO>;
    create_(data: CreateSalesChannelDTO[], sharedContext: Context): Promise<SalesChannel[]>;
    update(id: string, data: UpdateSalesChannelDTO, sharedContext?: Context): Promise<SalesChannelDTO>;
    update(selector: FilterableSalesChannelProps, data: UpdateSalesChannelDTO, sharedContext?: Context): Promise<SalesChannelDTO[]>;
    update_(data: UpdateSalesChannelDTO[], sharedContext: Context): Promise<TEntity[]>;
    upsert(data: UpsertSalesChannelDTO[], sharedContext?: Context): Promise<SalesChannelDTO[]>;
    upsert(data: UpsertSalesChannelDTO, sharedContext?: Context): Promise<SalesChannelDTO>;
}
export {};
