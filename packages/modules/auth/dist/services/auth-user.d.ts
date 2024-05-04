import { AuthTypes, Context, DAL, FindConfig, RepositoryService } from "@medusajs/types";
import { AuthUser } from "../models";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    authUserRepository: DAL.RepositoryService;
};
declare const AuthUserService_base: new <TEntity_1 extends object = any>(container: InjectedDependencies) => import("@medusajs/types").InternalModuleService<TEntity_1, InjectedDependencies>;
export default class AuthUserService<TEntity extends AuthUser = AuthUser> extends AuthUserService_base<TEntity> {
    protected readonly authUserRepository_: RepositoryService<TEntity>;
    protected baseRepository_: DAL.RepositoryService;
    constructor(container: InjectedDependencies);
    retrieveByProviderAndEntityId<TEntityMethod = AuthTypes.AuthUserDTO>(entityId: string, provider: string, config?: FindConfig<TEntityMethod>, sharedContext?: Context): Promise<AuthTypes.AuthUserDTO>;
}
export {};
