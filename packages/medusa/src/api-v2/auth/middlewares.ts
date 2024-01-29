import { MiddlewareRoute } from "../../loaders/helpers/routing/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import passport from "passport"
import passportCustom from "passport-custom"
import { IAuthModuleService } from "@medusajs/types"

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(
  "custom",
  new passportCustom.Strategy(async (req: any, cb) => {
    if (req.user || req.customer) {
      return cb(null, req.user)
    }

    const { scope, auth_provider } = req.params

    if (!auth_provider || !scope) {
      return (this as passport.Strategy).fail()
    }

    const service: IAuthModuleService = req.scope.resolve(
      ModuleRegistrationName.AUTHENTICATION
    )

    const res = await service.authenticate(auth_provider, req)

    const { success, error, authUser, location } = res
    if (location) {
      return (this as passport.Strategy).redirect(location)
    }

    if (!success) {
      return cb(error, null)
    } else {
      return cb(null, authUser)
    }
  })
)

passport.use(
  "customCallback",
  new passportCustom.Strategy(async (req: any, cb) => {
    if (req.user) {
      return cb(null, req.user)
    }

    const { scope, auth_provider } = req.params

    if (!auth_provider || !scope) {
      return (this as passport.Strategy).fail()
    }

    const service = req.scope.resolve(ModuleRegistrationName.AUTHENTICATION)

    const res = await service.validateCallback(auth_provider, req)

    const { success, error, authUser, location } = res
    if (location) {
      return (this as passport.Strategy).redirect(location)
    }

    if (!success) {
      return cb(error, null)
    } else {
      return cb(null, authUser)
    }
  })
)

export const adminCampaignRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/auth/:scope/:auth-provider",
    middlewares: [],
  },
  {
    matcher: "/auth/:scope/:auth-provider/callback",
    middlewares: [],
  },
]
