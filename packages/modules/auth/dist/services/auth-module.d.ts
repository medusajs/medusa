import { AuthenticationInput, AuthenticationResponse, AuthTypes, AuthUserDTO, Context, CreateAuthUserDTO, DAL, InternalModuleDeclaration, ModuleJoinerConfig, ModulesSdkTypes, UpdateAuthUserDTO } from "@medusajs/types";
import { AuthUser } from "../models";
import { AbstractAuthModuleProvider, ModulesSdkUtils } from "@medusajs/utils";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    authUserService: ModulesSdkTypes.InternalModuleService<any>;
};
declare const AuthModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, AuthTypes.AuthUserDTO, {
    AuthUser: {
        dto: AuthUserDTO;
    };
}>;
export default class AuthModuleService<TAuthUser extends AuthUser = AuthUser> extends AuthModuleService_base implements AuthTypes.IAuthModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    protected baseRepository_: DAL.RepositoryService;
    protected authUserService_: ModulesSdkTypes.InternalModuleService<TAuthUser>;
    constructor({ authUserService, baseRepository }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    __joinerConfig(): ModuleJoinerConfig;
    create(data: CreateAuthUserDTO[], sharedContext?: Context): Promise<AuthUserDTO[]>;
    create(data: CreateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>;
    update(data: UpdateAuthUserDTO[], sharedContext?: Context): Promise<AuthUserDTO[]>;
    update(data: UpdateAuthUserDTO, sharedContext?: Context): Promise<AuthUserDTO>;
    protected getRegisteredAuthenticationProvider(provider: string, { authScope }: AuthenticationInput): AbstractAuthModuleProvider;
    authenticate(provider: string, authenticationData: AuthenticationInput): Promise<AuthenticationResponse>;
    validateCallback(provider: string, authenticationData: AuthenticationInput): Promise<AuthenticationResponse>;
}
export {};
