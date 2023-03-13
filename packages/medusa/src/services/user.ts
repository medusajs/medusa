import jwt from "jsonwebtoken"
import { isDefined, MedusaError } from "medusa-core-utils"
import Scrypt from "scrypt-kdf"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import AnalyticsFeatureFlag from "../loaders/feature-flags/analytics"
import { User } from "../models"
import { UserRepository } from "../repositories/user"
import { FindConfig } from "../types/common"
import {
  CreateUserInput,
  FilterableUserProps,
  UpdateUserInput,
} from "../types/user"
import { buildQuery, setMetadata } from "../utils"
import { FlagRouter } from "../utils/flag-router"
import { validateEmail } from "../utils/is-email"
import AnalyticsConfigService from "./analytics-config"
import EventBusService from "./event-bus"

type UserServiceProps = {
  userRepository: typeof UserRepository
  analyticsConfigService: AnalyticsConfigService
  eventBusService: EventBusService
  manager: EntityManager
  featureFlagRouter: FlagRouter
}

/**
 * Provides layer to manipulate users.
 */
class UserService extends TransactionBaseService {
  static Events = {
    PASSWORD_RESET: "user.password_reset",
    CREATED: "user.created",
    UPDATED: "user.updated",
    DELETED: "user.deleted",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager
  protected readonly analyticsConfigService_: AnalyticsConfigService
  protected readonly userRepository_: typeof UserRepository
  protected readonly eventBus_: EventBusService
  protected readonly featureFlagRouter_: FlagRouter

  constructor({
    userRepository,
    eventBusService,
    analyticsConfigService,
    featureFlagRouter,
    manager,
  }: UserServiceProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.userRepository_ = userRepository
    this.analyticsConfigService_ = analyticsConfigService
    this.featureFlagRouter_ = featureFlagRouter
    this.eventBus_ = eventBusService
    this.manager_ = manager
  }

  /**
   * @param {FilterableUserProps} selector - the query object for find
   * @param {Object} config - the configuration object for the query
   * @return {Promise} the result of the find operation
   */
  async list(selector: FilterableUserProps, config = {}): Promise<User[]> {
    const manager = this.manager_
    const userRepo = manager.getCustomRepository(this.userRepository_)
    return await userRepo.find(buildQuery(selector, config))
  }

  /**
   * Gets a user by id.
   * Throws in case of DB Error and if user was not found.
   * @param {string} userId - the id of the user to get.
   * @param {FindConfig} config - query configs
   * @return {Promise<User>} the user document.
   */
  async retrieve(userId: string, config: FindConfig<User> = {}): Promise<User> {
    if (!isDefined(userId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"userId" must be defined`
      )
    }

    const manager = this.manager_
    const userRepo = manager.getCustomRepository(this.userRepository_)
    const query = buildQuery({ id: userId }, config)

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
   * @param {string[]} relations - relations to include with the user.
   * @return {Promise<User>} the user document.
   */
  async retrieveByApiToken(
    apiToken: string,
    relations: string[] = []
  ): Promise<User> {
    const manager = this.manager_
    const userRepo = manager.getCustomRepository(this.userRepository_)

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
    const manager = this.manager_
    const userRepo = manager.getCustomRepository(this.userRepository_)

    const query = buildQuery({ email: email.toLowerCase() }, config)
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
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository_)

      const createData = { ...user } as CreateUserInput & {
        password_hash: string
      }

      const validatedEmail = validateEmail(user.email)
      if (password) {
        const hashedPassword = await this.hashPassword_(password)
        createData.password_hash = hashedPassword
      }

      createData.email = validatedEmail

      const created = userRepo.create(createData)

      const newUser = await userRepo.save(created)

      await this.eventBus_
        .withTransaction(manager)
        .emit(UserService.Events.CREATED, { id: newUser.id })

      return newUser
    })
  }

  /**
   * Updates a user.
   * @param {object} userId - id of the user to update
   * @param {object} update - the values to be updated on the user
   * @return {Promise} the result of create
   */
  async update(userId: string, update: UpdateUserInput): Promise<User> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository_)

      const user = await this.retrieve(userId)

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
        user.metadata = setMetadata(user, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        user[key as keyof User] = value
      }

      const updatedUser = await userRepo.save(user)

      await this.eventBus_
        .withTransaction(manager)
        .emit(UserService.Events.UPDATED, { id: updatedUser.id })

      return updatedUser
    })
  }

  /**
   * Deletes a user from a given user id.
   * @param {string} userId - the id of the user to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(userId: string): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository_)
      const analyticsServiceTx =
        this.analyticsConfigService_.withTransaction(manager)

      // Should not fail, if user does not exist, since delete is idempotent
      const user = await userRepo.findOne({ where: { id: userId } })

      if (!user) {
        return Promise.resolve()
      }

      if (this.featureFlagRouter_.isFeatureEnabled(AnalyticsFeatureFlag.key)) {
        await analyticsServiceTx.delete(userId)
      }

      await userRepo.softRemove(user)

      await this.eventBus_
        .withTransaction(manager)
        .emit(UserService.Events.DELETED, { id: user.id })

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
    return await this.atomicPhase_(async (manager: EntityManager) => {
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

      return await userRepo.save(user)
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
    return await this.atomicPhase_(async (transactionManager) => {
      const user = await this.retrieve(userId, {
        select: ["id", "email", "password_hash"],
      })
      const secret = user.password_hash
      const expiry = Math.floor(Date.now() / 1000) + 60 * 15
      const payload = { user_id: user.id, email: user.email, exp: expiry }
      const token = jwt.sign(payload, secret)

      // Notify subscribers
      await this.eventBus_
        .withTransaction(transactionManager)
        .emit(UserService.Events.PASSWORD_RESET, {
          email: user.email,
          token,
        })

      return token
    })
  }
}

export default UserService
