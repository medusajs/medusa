import { Context, DAL, ApiKeyTypes, IApiKeyModuleService, ModulesSdkTypes, InternalModuleDeclaration, ModuleJoinerConfig, FindConfig, FilterableApiKeyProps } from "@medusajs/types";
import { ApiKey } from "../models";
import { RevokeApiKeyInput, TokenDTO, UpdateApiKeyInput } from "../types";
import { ModulesSdkUtils } from "@medusajs/utils";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    apiKeyService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const ApiKeyModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, ApiKeyTypes.ApiKeyDTO, {
    ApiKey: {
        dto: ApiKeyTypes.ApiKeyDTO;
    };
}>;
export default class ApiKeyModuleService<TEntity extends ApiKey = ApiKey> extends ApiKeyModuleService_base implements IApiKeyModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly apiKeyService_: ModulesSdkTypes.InternalModuleService<TEntity>;
    constructor({ baseRepository, apiKeyService }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: ApiKeyTypes.CreateApiKeyDTO[], sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO[]>;
    create(data: ApiKeyTypes.CreateApiKeyDTO, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO>;
    protected create_(data: ApiKeyTypes.CreateApiKeyDTO[], sharedContext?: Context): Promise<[TEntity[], TokenDTO[]]>;
    upsert(data: ApiKeyTypes.UpsertApiKeyDTO[], sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO[]>;
    upsert(data: ApiKeyTypes.UpsertApiKeyDTO, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO>;
    update(id: string, data: ApiKeyTypes.UpdateApiKeyDTO, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO>;
    update(selector: FilterableApiKeyProps, data: ApiKeyTypes.UpdateApiKeyDTO, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO[]>;
    protected update_(normalizedInput: UpdateApiKeyInput[], sharedContext?: Context): Promise<TEntity[]>;
    retrieve(id: string, config?: FindConfig<ApiKeyTypes.ApiKeyDTO>, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO>;
    list(filters?: ApiKeyTypes.FilterableApiKeyProps, config?: FindConfig<ApiKeyTypes.ApiKeyDTO>, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO[]>;
    listAndCount(filters?: ApiKeyTypes.FilterableApiKeyProps, config?: FindConfig<ApiKeyTypes.ApiKeyDTO>, sharedContext?: Context): Promise<[ApiKeyTypes.ApiKeyDTO[], number]>;
    revoke(id: string, data: ApiKeyTypes.RevokeApiKeyDTO, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO>;
    revoke(selector: FilterableApiKeyProps, data: ApiKeyTypes.RevokeApiKeyDTO, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO[]>;
    revoke_(normalizedInput: RevokeApiKeyInput[], sharedContext?: Context): Promise<TEntity[]>;
    authenticate(token: string, sharedContext?: Context): Promise<ApiKeyTypes.ApiKeyDTO | false>;
    protected authenticate_(token: string, sharedContext?: Context): Promise<ApiKey | false>;
    protected validateCreateApiKeys_(data: ApiKeyTypes.CreateApiKeyDTO[], sharedContext?: Context): Promise<void>;
    protected normalizeUpdateInput_<T>(idOrSelector: string | FilterableApiKeyProps, data: Omit<T, "id">, sharedContext?: Context): Promise<T[]>;
    protected validateRevokeApiKeys_(data: RevokeApiKeyInput[], sharedContext?: Context): Promise<void>;
    protected static generatePublishableKey(): TokenDTO;
    protected static generateSecretKey(): Promise<TokenDTO>;
    protected static calculateHash(token: string, salt: string): Promise<string>;
}
export {};
