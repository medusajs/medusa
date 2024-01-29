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

type AuthenticatorMethod = (
  service: IAuthModuleService
) => (
  provider: string,
  data: AuthenticationInput
) => Promise<AuthenticationResponse>

// class AbstractAuthModuleStrategy extends passport.Strategy {
//   name?: string
//   authenticationMethod: AuthenticatorMethod

//   constructor(name: string, authMethod: AuthenticatorMethod) {
//     super()
//     this.name = name
//     this.authenticationMethod = authMethod
//   }

//   async authenticate(
//     this: passport.StrategyCreated<this, this & passport.StrategyCreatedStatic>,
//     req: MedusaRequest,
//     _options?: any
//   ) {
//     if (req.user) {
//       return this.success(req.user)
//     }

//     const { scope, authProvider } = req.params

//     if (!authProvider || !scope) {
//       return this.fail()
//     }

//     const service: IAuthModuleService = req.scope.resolve(
//       ModuleRegistrationName.AUTH
//     )

//     const authData = { ...req } as unknown as AuthenticationInput
//     authData.authScope = scope
//     const res = await this.authenticationMethod(service)(authProvider, authData)

//     const { success, error, authUser, location } = res
//     if (location) {
//       return this.redirect(location)
//     }

//     if (!success) {
//       return this.error(error)
//     } else {
//       return this.success({ authUser, ...authUser.app_metadata })
//     }
//   }
// }
// passport.use(
//   new AbstractAuthModuleStrategy("custom1", (service) => service.authenticate)
// )

// passport.use(
//   new AbstractAuthModuleStrategy(
//     "customCallback1",
//     (service) => service.validateCallback
//   )
// )

class CustomStrategyRoutes extends passport.Strategy {
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
    console.log("middleware")
    if (req.user && req.user?.scope === options.scope && req.user?.medusa_id) {
      return this.success(req.user)
    }

    return this.fail()
  }
}

passport.use(new CustomStrategyRoutes("customRoute"))
class CustomStrategy1 extends passport.Strategy {
  name?: string

  constructor(name: string) {
    super()
    this.name = name
  }

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
    const res = await service.authenticate(authProvider, authData)

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

passport.use(new CustomStrategy1("custom"))

class CustomStrategy2 extends passport.Strategy {
  name?: string

  constructor(name: string) {
    super()
    this.name = name
  }

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
    const res = await service.validateCallback(authProvider, authData)

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

passport.use(new CustomStrategy2("customCallback"))

export const authRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/auth/:scope/:authProvider",
    method: ["GET", "POST"],
    // middlewares: [],
    middlewares: [passport.authenticate("custom", {})],
  },
  {
    matcher: "/auth/:scope/:authProvider/callback",
    method: ["GET", "POST"],
    // middlewares: [],
    middlewares: [passport.authenticate("customCallback", {})],
  },
  {
    matcher: "/auth/:scope",
    method: ["GET"],
    // middlewares: [],
    middlewares: [
      passport.authenticate("customRoute", {
        scope: "store",
      }),
    ],
  },
]
