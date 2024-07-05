import * as crypto from "crypto"

import { Context, DAL } from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaError,
  ModulesSdkUtils,
  arrayDifference,
} from "@medusajs/utils"
import jwt, { JwtPayload } from "jsonwebtoken"

import { Invite } from "@models"
import { InviteServiceTypes } from "@types"

type InjectedDependencies = {
  inviteRepository: DAL.RepositoryService
}

// 1 day
const DEFAULT_VALID_INVITE_DURATION = 60 * 60 * 24 * 1000

export default class InviteService<
  TEntity extends Invite = Invite
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  Invite
)<TEntity> {
  // eslint-disable-next-line max-len
  protected readonly inviteRepository_: DAL.RepositoryService<TEntity>
  protected options_: { jwt_secret: string; valid_duration: number } | undefined

  constructor(container: InjectedDependencies) {
    super(container)
    this.inviteRepository_ = container.inviteRepository
  }

  public withModuleOptions(options: any) {
    const service = new InviteService<TEntity>(this.__container__)

    service.options_ = options

    return service
  }

  private getOption(key: string) {
    if (!this.options_) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Options are not configured for InviteService, call "withModuleOptions" and provide options`
      )
    }
    return this.options_[key]
  }

  create(
    data: InviteServiceTypes.CreateInviteDTO,
    context?: Context
  ): Promise<TEntity>
  create(
    data: InviteServiceTypes.CreateInviteDTO[],
    context?: Context
  ): Promise<TEntity[]>

  @InjectTransactionManager("inviteRepository_")
  async create(
    data:
      | InviteServiceTypes.CreateInviteDTO
      | InviteServiceTypes.CreateInviteDTO[],
    context: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]

    const invites = await super.create(data_, context)

    const expiresIn: number = this.getValidDuration()

    const updates = invites.map((invite) => {
      return {
        id: invite.id,
        expires_at: new Date().setMilliseconds(
          new Date().getMilliseconds() + expiresIn
        ),
        token: this.generateToken({ id: invite.id }),
      }
    })

    return await super.update(updates, context)
  }

  @InjectTransactionManager("inviteRepository_")
  async refreshInviteTokens(
    inviteIds: string[],
    context: Context = {}
  ): Promise<TEntity[]> {
    const [invites, count] = await super.listAndCount(
      { id: inviteIds },
      {},
      context
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

    const expiresIn: number = this.getValidDuration()

    const updates = invites.map((invite) => {
      return {
        id: invite.id,
        expires_at: new Date().setMilliseconds(
          new Date().getMilliseconds() + expiresIn
        ),
        token: this.generateToken({ id: invite.id }),
      }
    })

    return await super.update(updates, context)
  }

  @InjectTransactionManager("inviteRepository_")
  async validateInviteToken(
    token: string,
    context?: Context
  ): Promise<TEntity> {
    const decoded = this.validateToken(token)

    const invite = await super.retrieve(decoded.payload.id, {}, context)

    if (invite.expires_at < new Date()) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The invite has expired"
      )
    }

    return invite
  }

  private generateToken(data: any): string {
    const jwtSecret: string = this.getOption("jwt_secret")
    const expiresIn: number = this.getValidDuration() / 1000

    if (!jwtSecret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No jwt_secret was provided in the UserModule's options. Please add one."
      )
    }

    return jwt.sign(data, jwtSecret, {
      jwtid: crypto.randomUUID(),
      expiresIn,
    })
  }

  private getValidDuration(): number {
    return (
      parseInt(this.getOption("valid_duration")) ||
      DEFAULT_VALID_INVITE_DURATION
    )
  }

  private validateToken(data: any): JwtPayload {
    const jwtSecret = this.getOption("jwt_secret")

    if (!jwtSecret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No jwt_secret was provided in the UserModule's options. Please add one."
      )
    }

    return jwt.verify(data, jwtSecret, { complete: true })
  }
}
