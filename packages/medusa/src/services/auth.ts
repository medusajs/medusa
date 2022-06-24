import Scrypt from "scrypt-kdf"
import { AuthenticateResult } from "../types/auth"
import { User, Customer } from "../models"
import { TransactionBaseService } from "../interfaces"
import UserService from "./user"
import CustomerService from "./customer"
import { EntityManager } from "typeorm"
import AbstractAuthStrategy from "../interfaces/authentication-strategy"
import { Request } from "express"
import { StrategyResolverService } from "./index"
import AdminDefaultAuthenticationStrategy from "../strategies/admin-authentication"
import StoreDefaultAuthenticationStrategy from "../strategies/store-authentication"

type InjectedDependencies = {
  manager: EntityManager
  userService: UserService
  customerService: CustomerService
  strategyResolverService: StrategyResolverService
}

/**
 * Can authenticate a user based on email password combination
 * @extends BaseService
 */
class AuthService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly userService_: UserService
  protected readonly customerService_: CustomerService
  protected readonly strategyResolverService_: StrategyResolverService

  constructor({
    manager,
    userService,
    customerService,
    strategyResolverService,
  }: InjectedDependencies) {
    super({
      manager,
      userService,
      customerService,
      strategyResolverService,
    })

    this.manager_ = manager
    this.userService_ = userService
    this.customerService_ = customerService
    this.strategyResolverService_ = strategyResolverService
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
   *    user: the user document if authentication succeded
   *    error: a string with the error message
   */
  async authenticateAPIToken(token: string): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      if (process.env.NODE_ENV?.startsWith("dev")) {
        try {
          const user: User = await this.userService_
            .withTransaction(transactionManager)
            .retrieve(token)
          return {
            success: true,
            user,
          }
        } catch (error) {
          // ignore
        }
      }

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
   *    user: the user document if authentication succeded
   *    error: a string with the error message
   */
  async authenticate(
    email: string,
    password: string
  ): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      try {
        const userPasswordHash: User = await this.userService_
          .withTransaction(transactionManager)
          .retrieveByEmail(email, {
            select: ["password_hash"],
          })

        const passwordsMatch = await this.comparePassword_(
          password,
          userPasswordHash.password_hash
        )

        if (passwordsMatch) {
          const user = await this.userService_
            .withTransaction(transactionManager)
            .retrieveByEmail(email)

          return {
            success: true,
            user: user,
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

  /**
   * Authenticates a customer based on an email, password combination. Uses
   * scrypt to match password with hashed value.
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @return {{ success: (bool), customer: (object | undefined) }}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeded
   *    error: a string with the error message
   */
  async authenticateCustomer(
    email: string,
    password: string
  ): Promise<AuthenticateResult> {
    return await this.atomicPhase_(async (transactionManager) => {
      try {
        const customerPasswordHash: Customer = await this.customerService_
          .withTransaction(transactionManager)
          .retrieveByEmail(email, {
            select: ["password_hash"],
          })
        if (customerPasswordHash.password_hash) {
          const passwordsMatch = await this.comparePassword_(
            password,
            customerPasswordHash.password_hash
          )

          if (passwordsMatch) {
            const customer = await this.customerService_
              .withTransaction(transactionManager)
              .retrieveByEmail(email)

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

  async retrieveAuthenticationStrategy(
    req: Request,
    scope: "admin" | "store"
  ): Promise<AbstractAuthStrategy<never>> {
    let authStrategy: AbstractAuthStrategy<never> | undefined

    const authenticationStrategies = req.scope.resolve(
      "authenticationStrategies"
    ) as AbstractAuthStrategy<never>[]
    const userStrategies = authenticationStrategies.filter((strategy) => {
      return (
        (strategy.constructor as any).identifier !==
          AdminDefaultAuthenticationStrategy.identifier &&
        (strategy.constructor as any).identifier !==
          StoreDefaultAuthenticationStrategy.identifier
      )
    })

    for (const strategy of userStrategies) {
      const shouldUse = await strategy.shouldUseStrategy(req, scope)
      if (shouldUse) {
        authStrategy = strategy
        break
      }
    }

    if (!authStrategy) {
      authStrategy =
        scope === "admin"
          ? this.strategyResolverService_.resolveAuthByType(
              "core-admin-default-auth"
            )
          : this.strategyResolverService_.resolveAuthByType(
              "core-store-default-auth"
            )
    }

    return authStrategy
  }
}

export default AuthService
