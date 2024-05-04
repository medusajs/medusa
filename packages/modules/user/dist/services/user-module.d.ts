import { Context, DAL, InternalModuleDeclaration, ModuleJoinerConfig, UserTypes, ModulesSdkTypes, IEventBusModuleService } from "@medusajs/types";
import { ModulesSdkUtils } from "@medusajs/utils";
import { Invite, User } from "../models";
import InviteService from "./invite";
type InjectedDependencies = {
    baseRepository: DAL.RepositoryService;
    userService: ModulesSdkTypes.InternalModuleService<any>;
    inviteService: InviteService<any>;
    eventBusModuleService: IEventBusModuleService;
};
declare const UserModuleService_base: new (container: InjectedDependencies) => ModulesSdkUtils.AbstractModuleService<InjectedDependencies, UserTypes.UserDTO, {
    Invite: {
        dto: UserTypes.InviteDTO;
    };
}>;
export default class UserModuleService<TUser extends User = User, TInvite extends Invite = Invite> extends UserModuleService_base implements UserTypes.IUserModuleService {
    protected readonly moduleDeclaration: InternalModuleDeclaration;
    __joinerConfig(): ModuleJoinerConfig;
    protected baseRepository_: DAL.RepositoryService;
    protected readonly userService_: ModulesSdkTypes.InternalModuleService<TUser>;
    protected readonly inviteService_: InviteService<TInvite>;
    constructor({ userService, inviteService, baseRepository }: InjectedDependencies, moduleDeclaration: InternalModuleDeclaration);
    validateInviteToken(token: string, sharedContext?: Context): Promise<UserTypes.InviteDTO>;
    refreshInviteTokens(inviteIds: string[], sharedContext?: Context): Promise<UserTypes.InviteDTO[]>;
    refreshInviteTokens_(inviteIds: string[], sharedContext?: Context): Promise<TInvite[]>;
    create(data: UserTypes.CreateUserDTO[], sharedContext?: Context): Promise<UserTypes.UserDTO[]>;
    create(data: UserTypes.CreateUserDTO, sharedContext?: Context): Promise<UserTypes.UserDTO>;
    update(data: UserTypes.UpdateUserDTO[], sharedContext?: Context): Promise<UserTypes.UserDTO[]>;
    update(data: UserTypes.UpdateUserDTO, sharedContext?: Context): Promise<UserTypes.UserDTO>;
    createInvites(data: UserTypes.CreateInviteDTO[], sharedContext?: Context): Promise<UserTypes.InviteDTO[]>;
    createInvites(data: UserTypes.CreateInviteDTO, sharedContext?: Context): Promise<UserTypes.InviteDTO>;
    private createInvites_;
    updateInvites(data: UserTypes.UpdateInviteDTO[], sharedContext?: Context): Promise<UserTypes.InviteDTO[]>;
    updateInvites(data: UserTypes.UpdateInviteDTO, sharedContext?: Context): Promise<UserTypes.InviteDTO>;
}
export {};
