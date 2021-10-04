import { BaseService } from "medusa-interfaces"
import jwt from "jsonwebtoken"
import config from "../config"
import { MedusaError } from "medusa-core-utils"

class InviteService extends BaseService {
  constructor({
    manager,
    userService,
    userRepository,
    inviteRepository,
    eventBusService,
    // accountService,
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

    // this.accountService_ = accountService
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
      // mailerService: this.mailerService_,
      eventBusService: this.eventBus_,
      // accountService: this.accountService_,
    })

    cloned.transactionManager_ = manager

    return cloned
  }

  async list(selector, config = {}) {
    const inviteRepo = this.manager_.getCustomRepository(this.inviteRepository_)

    const query = this.buildQuery_(selector, config)

    const invites = await inviteRepo.find(query)

    return invites
  }

  /**
   * Updates an account_user.
   * @param {string} data.inviter - user who creates the invites
   * @param {string} data.account_id - id of the account
   * @param {Array<string>} data.users - user emails
   * @param {string} data.role - role to assign to the users
   * @return {Promise} the result of create
   */
  async create(data) {
    const { users, inviter, ...inviteData } = data
    return await this.atomicPhase_(async manager => {
      const inviteRepository = this.manager_.getCustomRepository(
        this.inviteRepository_
      )
      if (true) {
        const user_email = users[0]
        // await Promise.any(
        // const tokens = users.map(async user_email => {
        let invite = await inviteRepository.findOne({
          where: { user_email },
        })

        // if user is trying to send another invite for the same account + email, but with a different role
        // then change the role on the invite as long as the invite has not been accepted yet
        if (invite && !invite.accepted && invite.role !== inviteData.role) {
          invite.role = inviteData.role

          invite = await inviteRepository.save(invite)
        }
        // if no invite is found, create a new one
        else if (!invite) {
          const created = await inviteRepository.create({
            ...inviteData,
            user_email,
          })

          invite = await inviteRepository.save(created)
        }

        const token = this.generateToken({
          invite_id: invite.id,
          role: data.role,
          user_email,
        })
        return token
      }
      await Promise.any(
        users.map(async user_email => {
          let invite = await inviteRepository.findOne({
            where: { user_email },
          })

          // if user is trying to send another invite for the same account + email, but with a different role
          // then change the role on the invite as long as the invite has not been accepted yet
          if (invite && !invite.accepted && invite.role !== inviteData.role) {
            invite.role = inviteData.role

            invite = await inviteRepository.save(invite)
          }
          // if no invite is found, create a new one
          else if (!invite) {
            const created = await inviteRepository.create({
              ...inviteData,
              user_email,
            })

            invite = await inviteRepository.save(created)
          }

          const token = this.generateToken({
            invite_id: invite.id,
            role: data.role,
            user_email,
          })

          // await this.mailerService_.send("invite_link", {
          //   to: user_email,
          //   account_name: account.name,
          //   invite_link: `http://localhost:6002/a/invite?token=${token}`,
          //   inviter: `${inviter.first_name} ${inviter.last_name}`,
          // })
        })
      )
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
    const { invite_id } = decoded

    return this.atomicPhase_(async m => {
      const userRepo = m.getCustomRepository(this.userRepo_)
      const inviteRepo = m.getCustomRepository(this.inviteRepository_)

      const invite = await inviteRepo.findOne({ where: { id: invite_id } })

      if (invite.accepted) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Invite already accepted"
        )
      }

      const exists = await userRepo.findOne({
        where: { user_id: user_.id },
        select: ["user_id"],
      })

      if (exists) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "User already joined"
        )
      }

      const user = await this.userService_
        .withTransaction(m)
        .create({ role: invite.role, user_id: user_.id })

      // use the email of the user who actually accepted the invite
      invite.user_email = user.email
      invite.accepted = true
      await inviteRepo.save(invite)

      return user
    }, "SERIALIZABLE")
  }

  verifyToken(token) {
    return jwt.verify(token, config.jwtSecret)
  }

  async resend(id, inviter) {
    const inviteRepo = this.manager_.getCustomRepository(this.inviteRepository_)

    const invite = await inviteRepo.findOne({ id })
    // const account = await this.accountService_.retrieve(invite.account_id)

    const token = this.generateToken({
      invite_id: invite.id,
      role: invite.role,
      user_email: invite.user_email,
    })

    // return await this.mailerService_.send("invite_link", {
    //   to: invite.user_email,
    //   account_name: account.name,
    //   invite_link: `http://localhost:6002/invite?token=${token}`,
    //   inviter: `${inviter.first_name} ${inviter.last_name}`,
    // })
  }
}

export default InviteService
