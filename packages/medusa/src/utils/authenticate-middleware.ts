import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IAuthModuleService } from "@medusajs/types"
import { NextFunction, RequestHandler } from "express"
import { MedusaRequest, MedusaResponse } from "../types/routing"

type MedusaSession = {
  auth: {
    [authScope: string]: {
      user_id: string
    }
  }
}

type AuthType = "session" | "bearer"

export default (
  authScope: string,
  authType: AuthType | AuthType[],
  options: { allowUnauthenticated?: boolean } = {}
): RequestHandler => {
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: NextFunction
  ): Promise<void> => {
    const authTypes = Array.isArray(authType) ? authType : [authType]
    const authModule = req.scope.resolve<IAuthModuleService>(
      ModuleRegistrationName.AUTH
    )

    // @ts-ignore
    const session: MedusaSession = req.session || {}

    if (authTypes.includes("session")) {
      if (session.auth && session.auth[authScope]) {
        const authUser = await authModule.retrieveAuthUser(
          session.auth[authScope].user_id
        )
        req.auth_user = {
          id: authUser.id,
          app_metadata: authUser.app_metadata,
          scope: authScope,
        }
        return next()
      }
    }

    if (authTypes.includes("bearer")) {
      const authHeader = req.headers.authorization
      if (authHeader) {
        const re = /(\S+)\s+(\S+)/
        const matches = authHeader.match(re)

        if (matches) {
          const tokenType = matches[1]
          const token = matches[2]
          if (tokenType.toLowerCase() === "bearer") {
            const authUser = await authModule.retrieveAuthUserFromJwtToken(
              token,
              authScope
            )
            req.auth_user = {
              id: authUser.id,
              app_metadata: authUser.app_metadata,
              scope: authScope,
            }
            return next()
          }
        }
      }
    }

    if (options.allowUnauthenticated) {
      return next()
    }

    res.status(401).json({ message: "Unauthorized" })
  }
}
