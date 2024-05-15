import { ConfigModule } from "@medusajs/types"
import { Express } from "express"
import passport from "passport"
import { Strategy as CustomStrategy } from "passport-custom"
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt"
/* import { AuthService } from "../services"*/

export default async ({
  app,
  configModule,
}: {
  app: Express
  configModule: ConfigModule
}): Promise<void> => {
  // For good old email password authentication
  /* passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req: MedusaRequest, email, password, done) => {
        const authService = req.scope.resolve<AuthService>("authService")
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
  )*/

  // After a user has authenticated a JWT will be placed on a cookie, all
  // calls will be authenticated based on the JWT
  const { jwt_secret } = configModule.projectConfig
  passport.use(
    "admin-session",
    new CustomStrategy(async (req, done) => {
      // @ts-ignore
      if (req.session?.user_id) {
        // @ts-ignore
        return done(null, { userId: req.session.user_id })
      }

      return done(null, false)
    })
  )

  passport.use(
    "store-session",
    new CustomStrategy(async (req, done) => {
      // @ts-ignore
      if (req.session?.customer_id) {
        // @ts-ignore
        return done(null, { customer_id: req.session.customer_id })
      }

      return done(null, false)
    })
  )

  // Alternatively use API token to authenticate to the admin api
  /* passport.use(
    "admin-api-token",
    new CustomStrategy(async (req, done) => {
      // extract the token from the header
      const token = req.headers["x-medusa-access-token"]

      // check if header exists and is string
      // typescript will complain if we don't check for type
      if (!token || typeof token !== "string") {
        return done(null, false)
      }

      const authService = req.scope.resolve<AuthService>("authService")
      const auth = await authService.authenticateAPIToken(token)
      if (auth.success) {
        done(null, auth.user)
      } else {
        done(null, false)
      }
    })
  )*/

  // Admin bearer JWT token authentication strategy, best suited for web SPAs or mobile apps
  passport.use(
    "admin-bearer",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret,
      },
      (token, done) => {
        if (token.domain !== "admin") {
          done(null, false)
          return
        }

        if (!token.user_id) {
          done(null, false)
          return
        }

        done(null, { userId: token.user_id })
      }
    )
  )

  // Store bearer JWT token authentication strategy, best suited for web SPAs or mobile apps
  passport.use(
    "store-bearer",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret,
      },
      (token, done) => {
        if (token.domain !== "store") {
          done(null, false)
          return
        }

        if (!token.customer_id) {
          done(null, false)
          return
        }

        done(null, { customer_id: token.customer_id })
      }
    )
  )

  app.use(passport.initialize())
  app.use(passport.session())
}
