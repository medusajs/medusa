import { Context, DAL } from "@medusajs/types";
import { Invite } from "../models";
import { InviteServiceTypes } from "../types";
type InjectedDependencies = {
    inviteRepository: DAL.RepositoryService;
};
declare const InviteService_base: new <TEntity_1 extends object = any>(container: InjectedDependencies) => import("@medusajs/types").InternalModuleService<TEntity_1, InjectedDependencies>;
export default class InviteService<TEntity extends Invite = Invite> extends InviteService_base<TEntity> {
    protected readonly inviteRepository_: DAL.RepositoryService<TEntity>;
    protected options_: {
        jwt_secret: string;
        valid_duration: number;
    } | undefined;
    constructor(container: InjectedDependencies);
    withModuleOptions(options: any): InviteService<TEntity>;
    private getOption;
    create(data: InviteServiceTypes.CreateInviteDTO, context?: Context): Promise<TEntity>;
    create(data: InviteServiceTypes.CreateInviteDTO[], context?: Context): Promise<TEntity[]>;
    refreshInviteTokens(inviteIds: string[], context?: Context): Promise<TEntity[]>;
    validateInviteToken(token: string, context?: Context): Promise<TEntity>;
    private generateToken;
    private getValidDuration;
    private validateToken;
}
export {};
