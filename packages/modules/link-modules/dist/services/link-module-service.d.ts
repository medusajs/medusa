import { Context, DAL, FindConfig, IEventBusModuleService, ILinkModule, InternalModuleDeclaration, ModuleJoinerConfig, RestoreReturn, SoftDeleteReturn } from "@medusajs/types";
import { LinkService } from ".";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    linkService: LinkService<any>;
    eventBusModuleService?: IEventBusModuleService;
    primaryKey: string | string[];
    foreignKey: string;
    extraFields: string[];
    entityName: string;
    serviceName: string;
};
export default class LinkModuleService<TLink> implements ILinkModule {
    readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly linkService_: LinkService<TLink>;
    protected readonly eventBusModuleService_?: IEventBusModuleService;
    protected readonly entityName_: string;
    protected readonly serviceName_: string;
    protected primaryKey_: string[];
    protected foreignKey_: string;
    protected extraFields_: string[];
    constructor({ baseRepository, linkService, eventBusModuleService, primaryKey, foreignKey, extraFields, entityName, serviceName, }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    private buildData;
    private isValidKeyName;
    private validateFields;
    retrieve(primaryKeyData: string | string[], foreignKeyData: string, sharedContext?: Context): Promise<unknown>;
    list(filters?: Record<string, unknown>, config?: FindConfig<unknown>, sharedContext?: Context): Promise<unknown[]>;
    listAndCount(filters?: Record<string, unknown>, config?: FindConfig<unknown>, sharedContext?: Context): Promise<[unknown[], number]>;
    create(primaryKeyOrBulkData: string | string[] | [string | string[], string, Record<string, unknown>][], foreignKeyData?: string, extraFields?: Record<string, unknown>, sharedContext?: Context): Promise<object[]>;
    dismiss(primaryKeyOrBulkData: string | string[] | [string | string[], string][], foreignKeyData?: string, sharedContext?: Context): Promise<object[]>;
    delete(data: any, sharedContext?: Context): Promise<void>;
    softDelete(data: any, { returnLinkableKeys }?: SoftDeleteReturn, sharedContext?: Context): Promise<Record<string, unknown[]> | void>;
    protected softDelete_(data: any[], sharedContext?: Context): Promise<[object[], Record<string, string[]>]>;
    restore(data: any, { returnLinkableKeys }?: RestoreReturn, sharedContext?: Context): Promise<Record<string, unknown[]> | void>;
    restore_(data: any, sharedContext?: Context): Promise<[object[], Record<string, string[]>]>;
}
export {};
