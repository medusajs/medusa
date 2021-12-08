import jwt from "jsonwebtoken"
import { MedusaError, Validator } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import Scrypt from "scrypt-kdf"
import { EntityManager } from "typeorm"
import { User } from "../models/user"
import { UserRepository } from "../repositories/user"
import { FindConfig } from "../types/common"
import {
  CreateUserInput,
  FilterableUserProps,
  UpdateUserInput,
} from "../types/user"
import EventBusService from "./event-bus"

type UserServiceProps = {
  userRepository: typeof UserRepository
  eventBusService: EventBusService
  manager: EntityManager
}

/**
 * Provides layer to manipulate users.
 * @extends BaseService
 */
class UserService extends BaseService {
  static Events = {
    PASSWORD_RESET: "user.password_reset",
  }

  private userRepository_: typeof UserRepository
  private eventBus_: EventBusService
  private manager_: EntityManager
  private transactionManager_: EntityManager

  constructor({ userRepository, eventBusService, manager }: UserServiceProps) {
    super()

    /** @private @const {UserRepository} */
    this.userRepository_ = userRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {EntityManager} */
    this.manager_ = manager
  }

  withTransaction(transactionManager: EntityManager): UserService {
    if (!transactionManager) {
      return this
    }

    const cloned = new UserService({
      manager: transactionManager,
      userRepository: this.userRepository_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Used to validate user email.
   * @param {string} email - email to validate
   * @return {string} the validated email
   */
  validateEmail_(email: string): string {
    const schema = Validator.string().email().required()
    const { value, error } = schema.validate(email)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The email is not valid"
      )
    }

    return value.toLowerCase()
  }

  /**
   * @param {FilterableUserProps} selector - the query object for find
   * @param {Object} config - the configuration object for the query
   * @return {Promise} the result of the find operation
   */
  async list(selector: FilterableUserProps, config = {}): Promise<User[]> {
    const userRepo = this.manager_.getCustomRepository(this.userRepository_)
    return userRepo.find(this.buildQuery_(selector, config))
  }

  /**
   * Gets a user by id.
   * Throws in case of DB Error and if user was not found.
   * @param {string} userId - the id of the user to get.
   * @param {FindConfig} config - query configs
   * @return {Promise<User>} the user document.
   */
  async retrieve(userId: string, config: FindConfig<User> = {}): Promise<User> {
    const userRepo = this.manager_.getCustomRepository(this.userRepository_)
    const validatedId = this.validateId_(userId)
    const query = this.buildQuery_({ id: validatedId }, config)

    const user = await userRepo.findOne(query)

    if (!user) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with id: ${userId} was not found`
      )
    }

    return user
  }

  /**
   * Gets a user by api token.
   * Throws in case of DB Error and if user was not found.
   * @param {string} apiToken - the token of the user to get.
   * @param {string[]} relations - relations to include with the user
   * @return {Promise<User>} the user document.
   */
  async retrieveByApiToken(
    apiToken: string,
    relations: string[] = []
  ): Promise<User> {
    const userRepo = this.manager_.getCustomRepository(this.userRepository_)

    const user = await userRepo.findOne({
      where: { api_token: apiToken },
      relations,
    })

    if (!user) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with api token: ${apiToken} was not found`
      )
    }

    return user
  }

  /**
   * Gets a user by email.
   * Throws in case of DB Error and if user was not found.
   * @param {string} email - the email of the user to get.
   * @param {FindConfig} config - query config
   * @return {Promise<User>} the user document.
   */
  async retrieveByEmail(
    email: string,
    config: FindConfig<User> = {}
  ): Promise<User> {
    const userRepo = this.manager_.getCustomRepository(this.userRepository_)

    const query = this.buildQuery_({ email: email.toLowerCase() }, config)
    const user = await userRepo.findOne(query)

    if (!user) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with email: ${email} was not found`
      )
    }

    return user
  }

  /**
   * Hashes a password
   * @param {string} password - the value to hash
   * @return {string} hashed password
   */
  async hashPassword_(password: string): Promise<string> {
    const buf = await Scrypt.kdf(password, { logN: 1, r: 1, p: 1 })
    return buf.toString("base64")
  }

  /**
   * Creates a user with username being validated.
   * Fails if email is not a valid format.
   * @param {object} user - the user to create
   * @param {string} password - user's password to hash
   * @return {Promise} the result of create
   */
  async create(user: CreateUserInput, password: string): Promise<User> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository_)

      const createData = { ...user } as CreateUserInput & {
        password_hash: string
      }

      const validatedEmail = this.validateEmail_(user.email)
      if (password) {
        const hashedPassword = await this.hashPassword_(password)
        createData.password_hash = hashedPassword
      }

      createData.email = validatedEmail

      const created = userRepo.create(createData)

      return userRepo.save(created)
    })
  }

  /**
   * Updates a user.
   * @param {object} userId - id of the user to update
   * @param {object} update - the values to be updated on the user
   * @return {Promise} the result of create
   */
  async update(userId: string, update: UpdateUserInput): Promise<User> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository_)
      const validatedId = this.validateId_(userId)

      const user = await this.retrieve(validatedId)

      const { email, password_hash, metadata, ...rest } = update

      if (email) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "You are not allowed to update email"
        )
      }

      if (password_hash) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Use dedicated methods, `setPassword`, `generateResetPasswordToken` for password operations"
        )
      }

      if (metadata) {
        user.metadata = this.setMetadata_(user, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        user[key as keyof User] = value
      }

      return userRepo.save(user)
    })
  }

  /**
   * Deletes a user from a given user id.
   * @param {string} userId - the id of the user to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(userId: string): Promise<null> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository_)

      // Should not fail, if user does not exist, since delete is idempotent
      const user = await userRepo.findOne({ where: { id: userId } })

      if (!user) {
        return Promise.resolve()
      }

      await userRepo.softRemove(user)

      return Promise.resolve()
    })
  }

  /**
   * Sets a password for a user
   * Fails if no user exists with userId and if the hashing of the new
   * password does not work.
   * @param {string} userId - the userId to set password for
   * @param {string} password - the old password to set
   * @return {Promise} the result of the update operation
   */
  async setPassword_(userId: string, password: string): Promise<User> {
    return this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository_)

      const user = await this.retrieve(userId)

      const hashedPassword = await this.hashPassword_(password)
      if (!hashedPassword) {
        throw new MedusaError(
          MedusaError.Types.DB_ERROR,
          `An error occured while hashing password`
        )
      }

      user.password_hash = hashedPassword

      return userRepo.save(user)
    })
  }

  /**
   * Generate a JSON Web token, that will be sent to a user, that wishes to
   * reset password.
   * The token will be signed with the users current password hash as a secret
   * a long side a payload with userId and the expiry time for the token, which
   * is always 15 minutes.
   * @param {string} userId - the id of the user to reset password for
   * @return {string} the generated JSON web token
   */
  async generateResetPasswordToken(userId: string): Promise<string> {
    const user = await this.retrieve(userId, {
      select: ["id", "email", "password_hash"],
    })
    const secret = user.password_hash
    const expiry = Math.floor(Date.now() / 1000) + 60 * 15
    const payload = { user_id: user.id, email: user.email, exp: expiry }
    const token = jwt.sign(payload, secret)

    // Notify subscribers
    this.eventBus_.emit(UserService.Events.PASSWORD_RESET, {
      email: user.email,
      token,
    })
    return token
  }
}

export default UserService
