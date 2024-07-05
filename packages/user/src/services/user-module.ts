import {
  Context,
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  UserTypes,
  ModulesSdkTypes,
  IEventBusModuleService,
} from "@medusajs/types"
import {
  EmitEvents,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  InjectManager,
  CommonEvents,
  UserEvents,
} from "@medusajs/utils"
import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"

import { Invite, User } from "@models"
import InviteService from "./invite"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  userService: ModulesSdkTypes.InternalModuleService<any>
  inviteService: InviteService<any>
  eventBusModuleService: IEventBusModuleService
}

const generateMethodForModels = [Invite]

export default class UserModuleService<
    TUser extends User = User,
    TInvite extends Invite = Invite
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    UserTypes.UserDTO,
    {
      Invite: {
        dto: UserTypes.InviteDTO
      }
    }
  >(User, generateMethodForModels, entityNameToLinkableKeysMap)
  implements UserTypes.IUserModuleService
{
  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  protected baseRepository_: DAL.RepositoryService

  protected readonly userService_: ModulesSdkTypes.InternalModuleService<TUser>
  protected readonly inviteService_: InviteService<TInvite>

  constructor(
    { userService, inviteService, baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.userService_ = userService
    this.inviteService_ = inviteService.withModuleOptions(
      this.moduleDeclaration
    )
  }

  @InjectTransactionManager("baseRepository_")
  async validateInviteToken(
    token: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.InviteDTO> {
    const invite = await this.inviteService_.validateInviteToken(
      token,
      sharedContext
    )

    return await this.baseRepository_.serialize<UserTypes.InviteDTO>(invite, {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  @EmitEvents()
  async refreshInviteTokens(
    inviteIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.InviteDTO[]> {
    const invites = await this.refreshInviteTokens_(inviteIds, sharedContext)

    sharedContext.messageAggregator?.saveRawMessageData(
      invites.map((invite) => ({
        eventName: UserEvents.invite_token_generated,
        metadata: {
          service: this.constructor.name,
          action: "token_generated",
          object: "invite",
        },
        data: { id: invite.id },
      }))
    )

    return await this.baseRepository_.serialize<UserTypes.InviteDTO[]>(
      invites,
      {
        populate: true,
      }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async refreshInviteTokens_(
    inviteIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.inviteService_.refreshInviteTokens(
      inviteIds,
      sharedContext
    )
  }

  create(
    data: UserTypes.CreateUserDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO[]>
  create(
    data: UserTypes.CreateUserDTO,
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async create(
    data: UserTypes.CreateUserDTO[] | UserTypes.CreateUserDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.UserDTO | UserTypes.UserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const users = await this.userService_.create(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      UserTypes.UserDTO[] | UserTypes.UserDTO
    >(users, {
      populate: true,
    })

    sharedContext.messageAggregator?.saveRawMessageData(
      users.map((user) => ({
        eventName: UserEvents.created,
        metadata: {
          service: this.constructor.name,
          action: CommonEvents.CREATED,
          object: "user",
        },
        data: { id: user.id },
      }))
    )

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  update(
    data: UserTypes.UpdateUserDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO[]>
  update(
    data: UserTypes.UpdateUserDTO,
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async update(
    data: UserTypes.UpdateUserDTO | UserTypes.UpdateUserDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.UserDTO | UserTypes.UserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const updatedUsers = await this.userService_.update(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      UserTypes.UserDTO[]
    >(updatedUsers, {
      populate: true,
    })

    sharedContext.messageAggregator?.saveRawMessageData(
      updatedUsers.map((user) => ({
        eventName: UserEvents.updated,
        metadata: {
          service: this.constructor.name,
          action: CommonEvents.UPDATED,
          object: "user",
        },
        data: { id: user.id },
      }))
    )

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  createInvites(
    data: UserTypes.CreateInviteDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.InviteDTO[]>
  createInvites(
    data: UserTypes.CreateInviteDTO,
    sharedContext?: Context
  ): Promise<UserTypes.InviteDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createInvites(
    data: UserTypes.CreateInviteDTO[] | UserTypes.CreateInviteDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.InviteDTO | UserTypes.InviteDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const invites = await this.createInvites_(input, sharedContext)

    const serializedInvites = await this.baseRepository_.serialize<
      UserTypes.InviteDTO[] | UserTypes.InviteDTO
    >(invites, {
      populate: true,
    })

    sharedContext.messageAggregator?.saveRawMessageData(
      invites.map((invite) => ({
        eventName: UserEvents.invite_created,
        metadata: {
          service: this.constructor.name,
          action: CommonEvents.CREATED,
          object: "invite",
        },
        data: { id: invite.id },
      }))
    )

    sharedContext.messageAggregator?.saveRawMessageData(
      invites.map((invite) => ({
        eventName: UserEvents.invite_token_generated,
        metadata: {
          service: this.constructor.name,
          action: "token_generated",
          object: "invite",
        },
        data: { id: invite.id },
      }))
    )

    return Array.isArray(data) ? serializedInvites : serializedInvites[0]
  }

  @InjectTransactionManager("baseRepository_")
  private async createInvites_(
    data: UserTypes.CreateInviteDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TInvite[]> {
    const toCreate = data.map((invite) => {
      return {
        ...invite,
        expires_at: new Date(),
        token: "placeholder",
      }
    })

    return await this.inviteService_.create(toCreate, sharedContext)
  }

  updateInvites(
    data: UserTypes.UpdateInviteDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.InviteDTO[]>
  updateInvites(
    data: UserTypes.UpdateInviteDTO,
    sharedContext?: Context
  ): Promise<UserTypes.InviteDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateInvites(
    data: UserTypes.UpdateInviteDTO | UserTypes.UpdateInviteDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.InviteDTO | UserTypes.InviteDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const updatedInvites = await this.inviteService_.update(
      input,
      sharedContext
    )

    const serializedInvites = await this.baseRepository_.serialize<
      UserTypes.InviteDTO[]
    >(updatedInvites, {
      populate: true,
    })

    sharedContext.messageAggregator?.saveRawMessageData(
      serializedInvites.map((invite) => ({
        eventName: UserEvents.invite_updated,
        metadata: {
          service: this.constructor.name,
          action: CommonEvents.UPDATED,
          object: "invite",
        },
        data: { id: invite.id },
      }))
    )

    return Array.isArray(data) ? serializedInvites : serializedInvites[0]
  }
}
