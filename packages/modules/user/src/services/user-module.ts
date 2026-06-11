import {
  Context,
  DAL,
  InferEntityType,
  InternalModuleDeclaration,
  ModulesSdkTypes,
  ProjectConfigOptions,
  UserTypes,
} from "@medusajs/framework/types"
import {
  arrayDifference,
  CommonEvents,
  EmitEvents,
  generateEntityId,
  generateJwtToken,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  MedusaService,
  moduleEventBuilderFactory,
  Modules,
  UserEvents,
} from "@medusajs/framework/utils"
import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken"
import crypto from "node:crypto"

import { Invite, User } from "@models"
import { getExpiresAt } from "../utils/utils"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  userService: ModulesSdkTypes.IMedusaInternalService<any>
  inviteService: ModulesSdkTypes.IMedusaInternalService<any>
}

const DEFAULT_VALID_INVITE_DURATION_SECONDS = 60 * 60 * 24
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

  protected readonly userService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof User>
  >
  protected readonly inviteService_: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof Invite>
  >
  protected readonly config: {
    jwtSecret: string
    jwtPublicKey?: string
    jwt_verify_options: ProjectConfigOptions["http"]["jwtVerifyOptions"]
    jwtOptions: ProjectConfigOptions["http"]["jwtOptions"] & {
      expiresIn: number
    }
  }

  constructor(
    { userService, inviteService, baseRepository }: InjectedDependencies,
    moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository
    this.userService_ = userService
    this.inviteService_ = inviteService

    this.config = {
      jwtSecret: moduleDeclaration["jwt_secret"],
      jwtPublicKey: moduleDeclaration["jwt_public_key"],
      jwt_verify_options: moduleDeclaration["jwt_verify_options"],
      jwtOptions: {
        ...moduleDeclaration["jwt_options"],
        expiresIn:
          moduleDeclaration["valid_duration"] ??
          moduleDeclaration["jwt_options"]?.expiresIn ??
          DEFAULT_VALID_INVITE_DURATION_SECONDS,
      },
    }

    if (!this.config.jwtSecret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No jwt_secret was provided in the UserModule's options. Please add one."
      )
    }
  }

  @InjectManager()
  async validateInviteToken(
    token: string,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.InviteDTO> {
    const options = {
      ...(this.config.jwt_verify_options ?? this.config.jwtOptions),
      complete: true,
    } as VerifyOptions & SignOptions

    if (!options.algorithms && options.algorithm) {
      options.algorithms = [options.algorithm]
      delete options.algorithm
    }

    const decoded = jwt.verify(
      token,
      this.config.jwtPublicKey ?? this.config.jwtSecret,
      options
    ) as JwtPayload

    const invite = await this.inviteService_.retrieve(
      decoded.payload.id,
      {},
      sharedContext
    )

    // Reject tokens that have been rotated (e.g. by a resend). Without this
    // check, any previously-issued JWT remains valid for the full TTL even
    // after `refreshInviteTokens_` writes a new token to the DB.
    if (token !== invite.token) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The invite token is invalid"
      )
    }

    if (invite.expires_at < new Date()) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The invite has expired"
      )
    }

    return await this.baseRepository_.serialize<UserTypes.InviteDTO>(invite)
  }

  @InjectManager()
  @EmitEvents()
  async refreshInviteTokens(
    inviteIds: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.InviteDTO[]> {
    const invites = await this.refreshInviteTokens_(inviteIds, sharedContext)

    const serializedInvites = await this.baseRepository_.serialize<
      UserTypes.InviteDTO[]
    >(invites)

    moduleEventBuilderFactory({
      eventName: UserEvents.INVITE_TOKEN_GENERATED,
      source: Modules.USER,
      action: CommonEvents.CREATED,
      object: "invite",
    })({
      data: serializedInvites,
      sharedContext,
    })

    return serializedInvites
  }

  @InjectTransactionManager()
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

    const expiresAt = getExpiresAt(this.config.jwtOptions.expiresIn)
    const updates = invites.map((invite) => {
      return {
        id: invite.id,
        expires_at: expiresAt,
        token: this.generateToken({ id: invite.id, email: invite.email }),
      }
    })

    return await this.inviteService_.update(updates, sharedContext)
  }

  // @ts-expect-error
  createUsers(
    data: UserTypes.CreateUserDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO[]>
  // @ts-expect-error
  createUsers(
    data: UserTypes.CreateUserDTO,
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createUsers(
    data: UserTypes.CreateUserDTO[] | UserTypes.CreateUserDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.UserDTO | UserTypes.UserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const users = await this.userService_.create(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      UserTypes.UserDTO[] | UserTypes.UserDTO
    >(users)

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  // @ts-expect-error
  updateUsers(
    data: UserTypes.UpdateUserDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO[]>
  // @ts-expect-error
  updateUsers(
    data: UserTypes.UpdateUserDTO,
    sharedContext?: Context
  ): Promise<UserTypes.UserDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async updateUsers(
    data: UserTypes.UpdateUserDTO | UserTypes.UpdateUserDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.UserDTO | UserTypes.UserDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const updatedUsers = await this.userService_.update(input, sharedContext)

    const serializedUsers = await this.baseRepository_.serialize<
      UserTypes.UserDTO[]
    >(updatedUsers)

    return Array.isArray(data) ? serializedUsers : serializedUsers[0]
  }

  // @ts-expect-error
  createInvites(
    data: UserTypes.CreateInviteDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.InviteDTO[]>
  // @ts-expect-error
  createInvites(
    data: UserTypes.CreateInviteDTO,
    sharedContext?: Context
  ): Promise<UserTypes.InviteDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
  async createInvites(
    data: UserTypes.CreateInviteDTO[] | UserTypes.CreateInviteDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<UserTypes.InviteDTO | UserTypes.InviteDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const invites = await this.createInvites_(input, sharedContext)

    const serializedInvites = await this.baseRepository_.serialize<
      UserTypes.InviteDTO[] | UserTypes.InviteDTO
    >(invites)

    moduleEventBuilderFactory({
      eventName: UserEvents.INVITE_TOKEN_GENERATED,
      source: Modules.USER,
      action: "token_generated",
      object: "invite",
    })({
      data: serializedInvites,
      sharedContext,
    })

    return Array.isArray(data) ? serializedInvites : serializedInvites[0]
  }

  @InjectTransactionManager()
  private async createInvites_(
    data: UserTypes.CreateInviteDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Invite>[]> {
    const alreadyExistingUsers = await this.listUsers({
      email: data.map((d) => d.email),
    })

    if (alreadyExistingUsers.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `User account for following email(s) already exist: ${alreadyExistingUsers
          .map((u) => u.email)
          .join(", ")}`
      )
    }

    const expiresAt = getExpiresAt(this.config.jwtOptions.expiresIn)

    const toCreate = data.map((invite) => {
      const id = generateEntityId((invite as { id?: string }).id, "invite")
      return {
        ...invite,
        id,
        expires_at: expiresAt,
        token: this.generateToken({ id, email: invite.email }),
      }
    })

    return await this.inviteService_.create(toCreate, sharedContext)
  }

  // @ts-ignore
  updateInvites(
    data: UserTypes.UpdateInviteDTO[],
    sharedContext?: Context
  ): Promise<UserTypes.InviteDTO[]>
  // @ts-expect-error
  updateInvites(
    data: UserTypes.UpdateInviteDTO,
    sharedContext?: Context
  ): Promise<UserTypes.InviteDTO>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
    >(updatedInvites)

    moduleEventBuilderFactory({
      eventName: UserEvents.INVITE_TOKEN_GENERATED,
      source: Modules.USER,
      action: "token_generated",
      object: "invite",
    })({
      data: serializedInvites,
      sharedContext,
    })

    return Array.isArray(data) ? serializedInvites : serializedInvites[0]
  }

  private generateToken(data: any): string {
    const jwtId = this.config.jwtOptions.jwtid ?? crypto.randomUUID()
    const token = generateJwtToken(data, {
      secret: this.config.jwtSecret,
      jwtOptions: {
        ...this.config.jwtOptions,
        jwtid: jwtId,
      },
    })

    return token
  }
}
