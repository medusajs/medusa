import {
  Context,
  DAL,
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModulesSdkTypes,
  UserTypes,
} from "@medusajs/types"
import {
  arrayDifference,
  CommonEvents,
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  MedusaService,
  UserEvents,
} from "@medusajs/utils"
import jwt, { JwtPayload } from "jsonwebtoken"
import crypto from "node:crypto"

import { Invite, User } from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  userService: ModulesSdkTypes.IMedusaInternalService<any>
  inviteService: ModulesSdkTypes.IMedusaInternalService<any>
  eventBusModuleService: IEventBusModuleService
}

// 1 day
const DEFAULT_VALID_INVITE_DURATION = 60 * 60 * 24 * 1000
export default class UserModuleService
  extends MedusaService<{
    User: {
      dto: UserTypes.UserDTO
    }
    Invite: {
      dto: UserTypes.InviteDTO
    }
  }>({ User, Invite })
  implements UserTypes.IUserModuleService
{
  protected baseRepository_: DAL.RepositoryService

  protected readonly userService_: ModulesSdkTypes.IMedusaInternalService<User>
  protected readonly inviteService_: ModulesSdkTypes.IMedusaInternalService<Invite>
  protected readonly config: { jwtSecret: string; expiresIn: number }

  constructor(
    { userService, inviteService, baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.userService_ = userService
    this.inviteService_ = inviteService
    this.config = {
      jwtSecret: moduleDeclaration["jwt_secret"],
      expiresIn:
        parseInt(moduleDeclaration["valid_duration"]) ||
        DEFAULT_VALID_INVITE_DURATION,
    }

    if (!this.config.jwtSecret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No jwt_secret was provided in the UserModule's options. Please add one."
      )
    }
  }

  @InjectTransactionManager("baseRepository_")
  async validateInviteToken(
    token: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.InviteDTO> {
    const jwtSecret = this.moduleDeclaration["jwt_secret"]
    const decoded: JwtPayload = jwt.verify(token, jwtSecret, { complete: true })

    const invite = await this.inviteService_.retrieve(
      decoded.payload.id,
      {},
      sharedContext
    )

    if (invite.expires_at < new Date()) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The invite has expired"
      )
    }

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
        eventName: UserEvents.INVITE_TOKEN_GENERATED,
        source: this.constructor.name,
        action: "token_generated",
        object: "invite",
        context: sharedContext,
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
    const [invites, count] = await this.inviteService_.listAndCount(
      { id: inviteIds },
      {},
      sharedContext
    )

    if (count !== inviteIds.length) {
      const missing = arrayDifference(
        inviteIds,
        invites.map((invite) => invite.id)
      )

      if (missing.length > 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The following invites do not exist: ${missing.join(", ")}`
        )
      }
    }

    const updates = invites.map((invite) => {
      return {
        id: invite.id,
        expires_at: new Date().setMilliseconds(
          new Date().getMilliseconds() + this.config.expiresIn
        ),
        token: this.generateToken({ id: invite.id }),
      }
    })

    return await this.inviteService_.update(updates, sharedContext)
  }

  // @ts-expect-error
  createUsers(
    data: UserTypes.CreateUserDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO[]>
  createUsers(
    data: UserTypes.CreateUserDTO,
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async createUsers(
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
        eventName: UserEvents.USER_CREATED,
        source: this.constructor.name,
        action: CommonEvents.CREATED,
        object: "user",
        context: sharedContext,
        data: { id: user.id },
      }))
    )

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  // @ts-expect-error
  updateUsers(
    data: UserTypes.UpdateUserDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO[]>
  updateUsers(
    data: UserTypes.UpdateUserDTO,
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO>

  @InjectManager("baseRepository_")
  @EmitEvents()
  async updateUsers(
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
        eventName: UserEvents.USER_UPDATED,
        source: this.constructor.name,
        action: CommonEvents.UPDATED,
        object: "user",
        context: sharedContext,
        data: { id: user.id },
      }))
    )

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  // @ts-ignore
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
        eventName: UserEvents.INVITE_CREATED,
        source: this.constructor.name,
        action: CommonEvents.CREATED,
        object: "invite",
        context: sharedContext,
        data: { id: invite.id },
      }))
    )

    sharedContext.messageAggregator?.saveRawMessageData(
      invites.map((invite) => ({
        eventName: UserEvents.INVITE_TOKEN_GENERATED,
        source: this.constructor.name,
        action: "token_generated",
        object: "invite",
        context: sharedContext,
        data: { id: invite.id },
      }))
    )

    return Array.isArray(data) ? serializedInvites : serializedInvites[0]
  }

  @InjectTransactionManager("baseRepository_")
  private async createInvites_(
    data: UserTypes.CreateInviteDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Invite[]> {
    const toCreate = data.map((invite) => {
      return {
        ...invite,
        expires_at: new Date(),
        token: "placeholder",
      }
    })

    const created = await this.inviteService_.create(toCreate, sharedContext)

    const updates = created.map((invite) => {
      return {
        id: invite.id,
        expires_at: new Date().setMilliseconds(
          new Date().getMilliseconds() + this.config.expiresIn
        ),
        token: this.generateToken({ id: invite.id }),
      }
    })

    return await this.inviteService_.update(updates, sharedContext)
  }

  // @ts-ignore
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
        eventName: UserEvents.INVITE_UPDATED,
        source: this.constructor.name,
        action: CommonEvents.UPDATED,
        object: "invite",
        context: sharedContext,
        data: { id: invite.id },
      }))
    )

    return Array.isArray(data) ? serializedInvites : serializedInvites[0]
  }

  private generateToken(data: any): string {
    const jwtSecret: string = this.moduleDeclaration["jwt_secret"]
    return jwt.sign(data, jwtSecret, {
      jwtid: crypto.randomUUID(),
      expiresIn: this.config.expiresIn,
    })
  }
}
