import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as BearerStrategy } from "passport-http-bearer"
import { Strategy as JWTStrategy } from "passport-jwt"
import config from "../config"

export default async ({ app, container }) => {
  const authService = container.resolve("authService")
  const userService = container.resolve("userService")

  // For good old email password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const { success, user } = authService.authenticate(email, password)
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
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: (req) => req.session.jwt,
        secretOrKey: config.jwtSecret,
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
