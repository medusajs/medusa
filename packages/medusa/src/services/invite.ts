import jwt, { JwtPayload } from "jsonwebtoken"
import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { EventBusService, UserService } from "."
import { User } from ".."
import config from "../config"
import { UserRoles } from "../models/user"
import { InviteRepository } from "../repositories/invite"
import { UserRepository } from "../repositories/user"
import { ListInvite } from "../types/invites"

// 7 days
const DEFAULT_VALID_DURATION = 1000 * 60 * 60 * 24 * 7

type InviteServiceProps = {
  manager: EntityManager
  userService: UserService
  userRepository: UserRepository
  inviteRepository: InviteRepository
  eventBusService: EventBusService
}

class InviteService extends BaseService {
  static Events = {
    CREATED: "invite.created",
  }

  private manager_: EntityManager
  private userService_: UserService
  private userRepo_: UserRepository
  private inviteRepository_: InviteRepository
  private eventBus_: EventBusService

  constructor({
    manager,
    userService,
    userRepository,
    inviteRepository,
    eventBusService,
  }: InviteServiceProps) {
    super()

    /** @private @constant {EntityManager} */
    this.manager_ = manager

    /** @private @constant {UserService} */
    this.userService_ = userService

    /** @private @constant {UserRepository} */
    this.userRepo_ = userRepository

    /** @private @constant {InviteRepository} */
    this.inviteRepository_ = inviteRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  withTransaction(manager): InviteService {
    if (!manager) {
      return this
    }

    const cloned = new InviteService({
      manager,
      inviteRepository: this.inviteRepository_,
      userService: this.userService_,
      userRepository: this.userRepo_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = manager

    return cloned
  }

  generateToken(data): string {
    if (config.jwtSecret) {
      return jwt.sign(data, config.jwtSecret)
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Please configure JwtSecret"
    )
  }

  async list(selector, config = {}): Promise<ListInvite[]> {
    const inviteRepo = this.manager_.getCustomRepository(InviteRepository)

    const query = this.buildQuery_(selector, config)

    return await inviteRepo.find(query)
  }

  /**
   * Updates an account_user.
   * @param {string} user - user emails
   * @param {string} role - role to assign to the user
   * @param {number} validDuration - role to assign to the user
   * @return {Promise} the result of create
   */
  async create(
    user: string,
    role: UserRoles,
    validDuration = DEFAULT_VALID_DURATION
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const inviteRepository =
        this.manager_.getCustomRepository(InviteRepository)

      const userRepo = this.manager_.getCustomRepository(UserRepository)

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
        const created = await inviteRepository.create({
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
   * @param {string} inviteId - the id of the invite to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(inviteId): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const inviteRepo: InviteRepository =
        manager.getCustomRepository(InviteRepository)

      // Should not fail, if invite does not exist, since delete is idempotent
      const invite = await inviteRepo.findOne({ where: { id: inviteId } })

      if (!invite) {
        return Promise.resolve()
      }

      await inviteRepo.delete({ id: invite.id })

      return Promise.resolve()
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

    return this.atomicPhase_(async (m) => {
      const userRepo = m.getCustomRepository(this.userRepo_)
      const inviteRepo: InviteRepository = m.getCustomRepository(
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
    if (config.jwtSecret) {
      return jwt.verify(token, config.jwtSecret)
    }
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Please configure JwtSecret"
    )
  }

  async resend(id): Promise<any> {
    const inviteRepo = this.manager_.getCustomRepository(InviteRepository)

    const invite = await inviteRepo.findOne({ id })

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
      .withTransaction(this.manager_)
      .emit(InviteService.Events.CREATED, {
        id: invite.id,
        token: invite.token,
        user_email: invite.user_email,
      })
  }
}

export default InviteService
