import passport from "passport"
import { Strategy as BearerStrategy } from "passport-http-bearer"
import { Strategy as JWTStrategy } from "passport-jwt"
import { Strategy as LocalStrategy } from "passport-local"
import { Request, Response, NextFunction, Express } from "express"
import { EntityManager } from "typeorm"
import jwt from "jsonwebtoken"

import AbstractAuthStrategy from "../interfaces/authentication-strategy"
import { AuthService } from "../services"
import { ConfigModule, MedusaContainer } from "../types/global"
import { validator } from "../utils/validator"
import CustomerService from "../services/customer"
import { StorePostAuthReq } from "../api/routes/store/auth"
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "../api/routes/store/customers"

type InjectedDependencies = {
  manager: EntityManager
}

export default class StoreDefaultAuthenticationStrategy extends AbstractAuthStrategy<StoreDefaultAuthenticationStrategy> {
  static identifier = "core-store-default-auth"

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly configModule_: ConfigModule

  constructor({ manager }: InjectedDependencies, configModule: ConfigModule) {
    super({ manager }, configModule)
    this.configModule_ = configModule
  }

  static async beforeInit(
    app: Express,
    container: MedusaContainer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: Record<string, unknown>
  ): Promise<void> {
    const authService = container.resolve("authService") as AuthService
    const configModule = container.resolve("configModule") as ConfigModule

    this.validateConfig(configModule)

    // For good old email password authentication
    passport.use(
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        async (email, password, done) => {
          try {
            const { success, user } = await authService.authenticate(
              email,
              password
            )
            if (success) {
              return done(null, user)
            } else {
              return done("Incorrect Username / Password")
            }
          } catch (error) {
            return done(error)
          }
        }
      )
    )

    // After a user has authenticated a JWT will be placed on a cookie, all
    // calls will be authenticated based on the JWT
    const { jwt_secret } = configModule.projectConfig
    passport.use(
      new JWTStrategy(
        {
          jwtFromRequest: (req): string => req.session.jwt,
          secretOrKey: jwt_secret,
        },
        async (jwtPayload, done) => {
          return done(null, jwtPayload)
        }
      )
    )

    // Alternatively use bearer token to authenticate to the admin api
    passport.use(
      new BearerStrategy(async (token, done) => {
        const auth = await authService.authenticateAPIToken(token)
        if (auth.success) {
          done(null, auth.user)
        } else {
          done(auth.error)
        }
      })
    )

    app.use(passport.initialize())
    app.use(passport.session())
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async shouldUseStrategy(
    req: Request,
    scope: "admin" | "store"
  ): Promise<boolean> {
    return scope === "store"
  }

  async authenticate(req: Request, res: Response): Promise<void> {
    const validated = await validator(StorePostAuthReq, req.body)

    const authService: AuthService = req.scope.resolve("authService")
    const result = await authService.authenticateCustomer(
      validated.email,
      validated.password
    )
    if (!result.success) {
      res.sendStatus(401)
      return
    }

    // Add JWT to cookie
    const {
      projectConfig: { jwt_secret },
    } = req.scope.resolve("configModule")
    req.session.jwt = jwt.sign(
      { customer_id: result.customer?.id },
      jwt_secret!,
      {
        expiresIn: "30d",
      }
    )

    const customerService: CustomerService =
      req.scope.resolve("customerService")
    const customer = await customerService.retrieve(
      result.customer?.id || "",
      req.retrieveConfig ?? {
        relations: defaultStoreCustomersRelations,
        select: defaultStoreCustomersFields,
      }
    )

    res.json({ customer })
  }

  async unAuthenticate(req: Request, res: Response): Promise<void> {
    req.session.destroy()
    res.status(200).end()
  }

  async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    passport.authenticate(
      ["jwt", "bearer"],
      { session: false },
      (err, user) => {
        if (err) {
          return next(err)
        }
        req.user = user
        return next()
      }
    )(req, res, next)
  }

  private static validateConfig(configModule: ConfigModule): void | never {
    const isProduction = ["production", "prod"].includes(
      process.env.NODE_ENV || ""
    )
    const errorHandler = isProduction
      ? (msg: string): never => {
          throw new Error(msg)
        }
      : console.log

    const jwt_secret =
      configModule?.projectConfig?.jwt_secret ?? process.env.JWT_SECRET
    if (!jwt_secret) {
      errorHandler(
        `[medusa-config] ⚠️ jwt_secret not found.${
          isProduction
            ? ""
            : " fallback to either cookie_secret or default 'supersecret'."
        }`
      )
    }
  }
}
