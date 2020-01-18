import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JWTStrategy } from "passport-jwt"
import config from "../config"

export default async ({ app, container }) => {
  const authService = container.cradle.authService

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

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: req => req.cookies.jwt,
        secretOrKey: config.jwtSecret,
      },
      (jwtPayload, done) => {
        if (Date.now() > jwtPayload.expires) {
          return done("jwt expired")
        }

        return done(null, jwtPayload)
      }
    )
  )
}
