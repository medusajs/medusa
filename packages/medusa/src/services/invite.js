import { BaseService } from "medusa-interfaces"
import jwt from "jsonwebtoken"
import config from "../config"
import { MedusaError } from "medusa-core-utils"

class InviteService extends BaseService {
  static Events = {
    CREATED: "invite.created",
  }

  constructor({
    manager,
    userService,
    userRepository,
    inviteRepository,
    eventBusService,
  }) {
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

  withTransaction(manager) {
    if (!manager) {
      return this
    }

    const cloned = new inviteService({
      manager,
      inviteRepository: this.inviteRepository_,
      userService: this.userService_,
      userRepository: this.userRepo_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = manager

    return cloned
  }

  async list(selector, config = {}) {
    const inviteRepo = this.manager_.getCustomRepository(this.inviteRepository_)

    const query = this.buildQuery_(selector, config)

    const invites = await inviteRepo.find(query)

    return invites.map(inv => {
      return {
        token: this.generateToken({
          invite_id: inv.id,
          role: inv.role,
          user_email: inv.user_email,
        }),
        ...inv,
      }
    })
  }

  /**
   * Updates an account_user.
   * @param {string} data.inviter - user who creates the invites
   * @param {string} data.account_id - id of the account
   * @param {Array<string>} data.users - user emails
   * @param {string} data.role - role to assign to the users
   * @return {Promise} the result of create
   */
  async create(users, role) {
    return await this.atomicPhase_(async manager => {
      const inviteRepository = this.manager_.getCustomRepository(
        this.inviteRepository_
      )

      await Promise.any(
        users.map(async user_email => {
          let invite = await inviteRepository.findOne({
            where: { user_email },
          })

          // if user is trying to send another invite for the same account + email, but with a different role
          // then change the role on the invite as long as the invite has not been accepted yet
          if (invite && !invite.accepted && invite.role !== role) {
            invite.role = role

            invite = await inviteRepository.save(invite)
          }
          // if no invite is found, create a new one
          else if (!invite) {
            const created = await inviteRepository.create({
              role,
              user_email,
            })

            invite = await inviteRepository.save(created)
          }

          const token = this.generateToken({
            invite_id: invite.id,
            role,
            user_email,
          })

          await this.eventBus_
            .withTransaction(manager)
            .emit(InviteService.Events.CREATED, {
              id: invite.id,
              token,
            })
        })
      )
    })
  }

  /**
   * Deletes an invite from a given user id.
   * @param {string} inviteId - the id of the invite to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(inviteId) {
    return this.atomicPhase_(async manager => {
      const inviteRepo = manager.getCustomRepository(this.inviteRepository_)

      // Should not fail, if invite does not exist, since delete is idempotent
      const invite = await inviteRepo.findOne({ where: { id: inviteId } })

      if (!invite) return Promise.resolve()

      await inviteRepo.softRemove(invite)

      return Promise.resolve()
    })
  }

  generateToken(data) {
    return jwt.sign(data, config.jwtSecret, {
      expiresIn: "7d",
    })
  }

  async accept(token, user_) {
    const decoded = this.verifyToken(token)

    if (!decoded) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Token is not valid"
      )
    }

    const { invite_id, user_email } = decoded

    return this.atomicPhase_(async m => {
      const userRepo = m.getCustomRepository(this.userRepo_)
      const inviteRepo = m.getCustomRepository(this.inviteRepository_)

      const invite = await inviteRepo.findOne({ where: { id: invite_id } })

      if (invite.user_email !== user_email) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `invalid token ${invite.user_email} != ${user_email}`
        )
      }

      if (invite.accepted) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invite already accepted"
        )
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

      const user = await this.userService_.withTransaction(m).create(
        {
          email: user_email,
          role: invite.role,
          first_name: user_.first_name,
          last_name: user_.last_name,
        },
        user_.password
      )

      // use the email of the user who actually accepted the invite
      invite.accepted = true
      await inviteRepo.save(invite)

      return user
    }, "SERIALIZABLE")
  }

  verifyToken(token) {
    return jwt.verify(token, config.jwtSecret)
  }

  async resend(id) {
    const inviteRepo = this.manager_.getCustomRepository(this.inviteRepository_)

    const invite = await inviteRepo.findOne({ id })

    const token = this.generateToken({
      invite_id: invite.id,
      role: invite.role,
      user_email: invite.user_email,
    })

    await this.eventBus_
      .withTransaction(this.manager_)
      .emit(InviteService.Events.CREATED, {
        id: invite.id,
        token,
      })
  }
}

export default InviteService
