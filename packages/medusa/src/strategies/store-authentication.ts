import passport from "passport"
import { Strategy as BearerStrategy } from "passport-http-bearer"
import { Strategy as JWTStrategy } from "passport-jwt"
import { Strategy as LocalStrategy } from "passport-local"
import { Request, Response, NextFunction, Express } from "express"
import { EntityManager } from "typeorm"
import jwt from "jsonwebtoken"

import AbstractAuthStrategy from "../interfaces/authentication-strategy"
import { AuthService } from "../services"
import { ConfigModule } from "../types/global"
import { validator } from "../utils/validator"
import { IsEmail, IsNotEmpty } from "class-validator"
import CustomerService from "../services/customer"

type InjectedDependencies = {
  manager: EntityManager
  authService: AuthService
}

export default class StoreDefaultAuthenticationStrategy extends AbstractAuthStrategy<StoreDefaultAuthenticationStrategy> {
  static identifier = "core-store-default-auth"

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly authService_: AuthService
  protected readonly configModule_: ConfigModule

  constructor(
    { manager, authService }: InjectedDependencies,
    configModule: ConfigModule
  ) {
    super({ manager, authService }, configModule)
    this.configModule_ = configModule
    this.authService_ = authService
  }

  async afterInit(app: Express): Promise<void> {
    // For good old email password authentication
    passport.use(
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
        },
        async (email, password, done) => {
          try {
            const { success, user } = await this.authService_.authenticate(
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
    const { jwt_secret } = this.configModule_.projectConfig
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
        const auth = await this.authService_.authenticateAPIToken(token)
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
    const customer = await customerService.retrieve(result.customer?.id || "", {
      relations: ["orders", "orders.items"],
    })

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
}

export class StorePostAuthReq {
  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string
}
