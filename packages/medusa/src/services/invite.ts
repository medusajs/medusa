import jwt, { JwtPayload } from "jsonwebtoken"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { UserService } from "."
import { User } from ".."
import { TransactionBaseService } from "../interfaces"
import { UserRoles } from "../models/user"
import { InviteRepository } from "../repositories/invite"
import { UserRepository } from "../repositories/user"
import { ConfigModule } from "../types/global"
import { ListInvite } from "../types/invites"
import { buildQuery } from "../utils"
import EventBusService from "./event-bus"

// 7 days
const DEFAULT_VALID_DURATION = 1000 * 60 * 60 * 24 * 7

type InviteServiceProps = {
  manager: EntityManager
  userService: UserService
  userRepository: typeof UserRepository
  inviteRepository: typeof InviteRepository
  eventBusService: EventBusService
}

class InviteService extends TransactionBaseService {
  static Events = {
    CREATED: "invite.created",
  }

  protected readonly userService_: UserService
  protected readonly userRepo_: typeof UserRepository
  protected readonly inviteRepository_: typeof InviteRepository
  protected readonly eventBus_: EventBusService

  protected readonly configModule_: ConfigModule

  constructor(
    {
      userService,
      userRepository,
      inviteRepository,
      eventBusService,
    }: InviteServiceProps,
    configModule: ConfigModule
  ) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)

    this.configModule_ = configModule
    this.userService_ = userService
    this.userRepo_ = userRepository
    this.inviteRepository_ = inviteRepository
    this.eventBus_ = eventBusService
  }

  generateToken(data): string {
    const { jwt_secret } = this.configModule_.projectConfig
    if (jwt_secret) {
      return jwt.sign(data, jwt_secret)
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Please configure jwt_secret"
    )
  }

  async list(selector, config = {}): Promise<ListInvite[]> {
    const inviteRepo = this.activeManager_.withRepository(InviteRepository)

    const query = buildQuery(selector, config)

    return await inviteRepo.find(query)
  }

  /**
   * Updates an account_user.
   * @param user - user emails
   * @param role - role to assign to the user
   * @param validDuration - role to assign to the user
   * @return the result of create
   */
  async create(
    user: string,
    role: UserRoles,
    validDuration = DEFAULT_VALID_DURATION
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const inviteRepository =
        this.activeManager_.withRepository(InviteRepository)

      const userRepo = this.activeManager_.withRepository(UserRepository)

      const userEntity = await userRepo.findOne({
        where: { email: user },
      })

      if (userEntity) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Can't invite a user with an existing account"
        )
      }

      let invite = await inviteRepository.findOne({
        where: { user_email: user },
      })
      // if user is trying to send another invite for the same account + email, but with a different role
      // then change the role on the invite as long as the invite has not been accepted yet
      if (invite && !invite.accepted && invite.role !== role) {
        invite.role = role

        invite = await inviteRepository.save(invite)
      } else if (!invite) {
        // if no invite is found, create a new one
        const created = inviteRepository.create({
          role,
          token: "",
          user_email: user,
        })

        invite = await inviteRepository.save(created)
      }

      invite.token = this.generateToken({
        invite_id: invite.id,
        role,
        user_email: user,
      })

      invite.expires_at = new Date()
      invite.expires_at.setMilliseconds(
        invite.expires_at.getMilliseconds() + validDuration
      )

      invite = await inviteRepository.save(invite)

      await this.eventBus_
        .withTransaction(manager)
        .emit(InviteService.Events.CREATED, {
          id: invite.id,
          token: invite.token,
          user_email: invite.user_email,
        })
    })
  }

  /**
   * Deletes an invite from a given user id.
   * @param inviteId - the id of the invite to delete. Must be
   *   castable as an ObjectId
   * @return the result of the delete operation.
   */
  async delete(inviteId): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const inviteRepo: typeof InviteRepository =
        manager.withRepository(InviteRepository)

      // Should not fail, if invite does not exist, since delete is idempotent
      const invite = await inviteRepo.findOne({ where: { id: inviteId } })

      if (!invite) {
        return
      }

      await inviteRepo.delete({ id: invite.id })
    })
  }

  async accept(token, user_): Promise<User> {
    let decoded
    try {
      decoded = this.verifyToken(token)
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Token is not valid"
      )
    }

    const { invite_id, user_email } = decoded

    return await this.atomicPhase_(async (m) => {
      const userRepo = m.withRepository(this.userRepo_)
      const inviteRepo: typeof InviteRepository = m.withRepository(
        this.inviteRepository_
      )

      const invite = await inviteRepo.findOne({ where: { id: invite_id } })

      if (
        !invite ||
        invite?.user_email !== user_email ||
        new Date() > invite.expires_at
      ) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, `Invalid invite`)
      }

      const exists = await userRepo.findOne({
        where: { email: user_email.toLowerCase() },
        select: ["id"],
      })

      if (exists) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "User already joined"
        )
      }

      // use the email of the user who actually accepted the invite
      const user = await this.userService_.withTransaction(m).create(
        {
          email: invite.user_email,
          role: invite.role,
          first_name: user_.first_name,
          last_name: user_.last_name,
        },
        user_.password
      )

      await inviteRepo.delete({ id: invite.id })

      return user
    }, "SERIALIZABLE")
  }

  verifyToken(token): JwtPayload | string {
    const { jwt_secret } = this.configModule_.projectConfig

    if (jwt_secret) {
      return jwt.verify(token, jwt_secret)
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Please configure jwt_secret"
    )
  }

  async resend(id): Promise<void> {
    const inviteRepo = this.activeManager_.withRepository(InviteRepository)

    const invite = await inviteRepo.findOne({ where: { id } })

    if (!invite) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invite doesn't exist`
      )
    }

    invite.token = this.generateToken({
      invite_id: invite.id,
      role: invite.role,
      user_email: invite.user_email,
    })

    invite.expires_at = new Date()
    invite.expires_at.setDate(invite.expires_at.getDate() + 7)

    await inviteRepo.save(invite)

    await this.eventBus_
      .withTransaction(this.activeManager_)
      .emit(InviteService.Events.CREATED, {
        id: invite.id,
        token: invite.token,
        user_email: invite.user_email,
      })
  }
}

export default InviteService
