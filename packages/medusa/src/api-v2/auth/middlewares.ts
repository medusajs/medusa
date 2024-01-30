import {
  AuthUserDTO,
  AuthenticationInput,
  AuthenticationResponse,
  IAuthModuleService,
} from "@medusajs/types"

import { MedusaRequest } from "../../types/routing"
import { MiddlewareRoute } from "../../loaders/helpers/routing/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import passport from "passport"
import passportCustom from "passport-custom"

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

abstract class AbstractAuthModuleStrategy extends passport.Strategy {
  name?: string

  constructor(name: string) {
    super()
    this.name = name
  }

  abstract authenticationMethod(
    authProvider: string,
    authData: AuthenticationInput
  ): (service: IAuthModuleService) => Promise<AuthenticationResponse>

  async authenticate(
    this: passport.StrategyCreated<this, this & passport.StrategyCreatedStatic>,
    req: MedusaRequest,
    _options?: any
  ) {
    if (req.user) {
      return this.success(req.user)
    }

    const { scope, authProvider } = req.params

    if (!authProvider || !scope) {
      return this.fail()
    }

    const service: IAuthModuleService = req.scope.resolve(
      ModuleRegistrationName.AUTH
    )

    const authData = { ...req } as unknown as AuthenticationInput
    authData.authScope = scope
    const res = await this.authenticationMethod(authProvider, authData)(service)
    // const res = await this.authenticationMethod(service)(authProvider, authData)

    const { success, error, authUser, location } = res
    if (location) {
      return this.redirect(location)
    }

    if (!success) {
      return this.error(error)
    } else {
      return this.success({ authUser, ...authUser.app_metadata })
    }
  }
}

class AuthModuleAuthenticateStrategy extends AbstractAuthModuleStrategy {
  authenticationMethod(authProvider: string, authData: AuthenticationInput) {
    return (service: IAuthModuleService) =>
      service.authenticate(authProvider, authData)
  }
}
class AuthModuleCallbackeStrategy extends AbstractAuthModuleStrategy {
  authenticationMethod(authProvider: string, authData: AuthenticationInput) {
    return (service: IAuthModuleService) =>
      service.validateCallback(authProvider, authData)
  }
}

passport.use(
  new AuthModuleAuthenticateStrategy("authModuleAuthenticate")
)

passport.use(
  new AuthModuleCallbackeStrategy(
    "authModuleCallback"
  )
)

class AuthModuleRoutes extends passport.Strategy {
  name?: string

  constructor(name: string) {
    super()
    this.name = name
  }

  async authenticate(
    this: passport.StrategyCreated<this, this & passport.StrategyCreatedStatic>,
    req: MedusaRequest,
    options?: any
  ) {
    if (
      req.user &&
      req.user?.scope === options.scope &&
      (req.user.medusa_id ||
        (req.user.customer_id && req.user?.scope === "store") ||
        (req.user.userId && req.user?.scope === "admin"))
    ) {
      return this.success(req.user)
    }

    const hasUserId = (user) => user?.medusa_id || user?.customer_id || user?.userId
    
    const service: IAuthModuleService = req.scope.resolve(
      ModuleRegistrationName.AUTH
    )

    // Refetch user if no id is present
    // TODO: is there a better "fix" than this ugly hack?
    if(!hasUserId(req.user)) {
      const user = await service.retrieveAuthUser(req.user!.authUser!.id!)

      const successParam = { ...req.user, ...user, ...user.app_metadata }

      if(!user || !hasUserId(successParam)) {
        return this.fail()
      }

      return this.success(successParam)
    }

    return this.fail()
  }
}

passport.use(new AuthModuleRoutes("customRoute"))

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/auth/:scope/:authProvider",
    method: ["GET", "POST"],
    middlewares: [passport.authenticate("custom", {})],
  },
  {
    matcher: "/auth/:scope/:authProvider/callback",
    method: ["GET", "POST"],
    middlewares: [passport.authenticate("customCallback", {})],
  },
  {
    matcher: "/auth/:scope",
    method: ["GET"],
    middlewares: [
      passport.authenticate("customRoute", {
        scope: "store",
      }),
    ],
  },
]
