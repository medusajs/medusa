import Scrypt from "scrypt-kdf"
import { AuthenticateResult } from "../types/auth"
import { Customer, User } from "../models"
import { TransactionBaseService } from "../interfaces"
import UserService from "./user"
import CustomerService from "./customer"
import { EntityManager } from "typeorm"
import { Logger } from "@medusajs/types"
import { deepEqualObj } from "@medusajs/utils"
import { defaultAuthConfig } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  userService: UserService
  customerService: CustomerService
  logger: Logger
}

/**
 * Can authenticate a user based on email password combination
 */
class AuthService extends TransactionBaseService {
  protected readonly userService_: UserService
  protected readonly customerService_: CustomerService
  protected readonly logger_: Logger

  constructor({ userService, customerService, logger }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.userService_ = userService
    this.customerService_ = customerService
    this.logger_ = logger
  }

  /**
   * Verifies if a password is valid given the provided password hash
   * @param {string} password - the raw password to check
   * @param {string} hash - the hash to compare against
   * @return {bool} the result of the comparison
   */
  protected async comparePassword_(
    password: string,
    hash: string
  ): Promise<boolean> {
    const buf = Buffer.from(hash, "base64")
    return Scrypt.verify(buf, password)
  }

  /**
   * Authenticates a given user with an API token
   * @param {string} token - the api_token of the user to authenticate
   * @return {AuthenticateResult}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeeded
   *    error: a string with the error message
   */
  async authenticateAPIToken(token: string): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      try {
        const user: User = await this.userService_
          .withTransaction(transactionManager)
          .retrieveByApiToken(token)
        return {
          success: true,
          user,
        }
      } catch (error) {
        return {
          success: false,
          error: "Invalid API Token",
        }
      }
    })
  }

  /**
   * Authenticates a given user based on an email, password combination. Uses
   * scrypt to match password with hashed value.
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @return {AuthenticateResult}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeeded
   *    error: a string with the error message
   */
  async authenticate(
    email: string,
    password: string
  ): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      try {
        const { password_hash }: User = await this.userService_
          .withTransaction(transactionManager)
          .retrieveByEmail(email, {
            select: ["password_hash"],
          })

        const passwordsMatch = await this.comparePassword_(
          password,
          password_hash
        )

        if (passwordsMatch) {
          const user = await this.userService_
            .withTransaction(transactionManager)
            .retrieveByEmail(email)

          if (!this.passwordConfigIsCurrent(password_hash)) {
            await this.userService_.setPassword_(user.id, password)
          }

          return {
            success: true,
            user: user,
          }
        }
      } catch (error) {
        this.logger_.log("error ->", error)
        // ignore
      }

      return {
        success: false,
        error: "Invalid email or password",
      }
    })
  }

  /**
   * Authenticates a customer based on an email, password combination. Uses
   * scrypt to match password with hashed value.
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @return {{ success: (bool), customer: (object | undefined) }}
   *    success: whether authentication succeeded
   *    customer: the customer document if authentication succeded
   *    error: a string with the error message
   */
  async authenticateCustomer(
    email: string,
    password: string
  ): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      try {
        const { password_hash }: Customer = await this.customerService_
          .withTransaction(transactionManager)
          .retrieveRegisteredByEmail(email, {
            select: ["password_hash"],
          })

        if (password_hash) {
          const passwordsMatch = await this.comparePassword_(
            password,
            password_hash
          )

          if (passwordsMatch) {
            const customer = await this.customerService_
              .withTransaction(transactionManager)
              .retrieveRegisteredByEmail(email)

            if (!this.passwordConfigIsCurrent(password_hash)) {
              await this.customerService_.update(customer.id, {
                password,
              })
            }

            return {
              success: true,
              customer,
            }
          }
        }
      } catch (error) {
        // ignore
      }

      return {
        success: false,
        error: "Invalid email or password",
      }
    })
  }

  protected passwordConfigIsCurrent(password_hash: string): boolean {
    const currentHashConfig = Scrypt.viewParams(
      Buffer.from(password_hash, "base64")
    )

    return deepEqualObj(currentHashConfig, defaultAuthConfig)
  }
}

export default AuthService
