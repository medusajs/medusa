import { AuthUserDTO, IUserModuleService } from "@medusajs/types"
import { MedusaRequest, MedusaResponse } from "../types/routing"
import { NextFunction, RequestHandler } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { stringEqualsOrRegexMatch } from "@medusajs/utils"

const SESSION_AUTH = "session"
const BEARER_AUTH = "bearer"

type MedusaSession = {
  auth_user: AuthUserDTO
  scope: string
}

type AuthType = "session" | "bearer"

export const authenticate = (
  authScope: string | RegExp,
  authType: AuthType | AuthType[],
  options: { allowUnauthenticated?: boolean; allowUnregistered?: boolean } = {}
): RequestHandler => {
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: NextFunction
  ): Promise<void> => {
    const authTypes = Array.isArray(authType) ? authType : [authType]

    // @ts-ignore
    const session: MedusaSession = req.session || {}

    let authUser: AuthUserDTO | null = null
    if (authTypes.includes(SESSION_AUTH)) {
      if (
        session.auth_user &&
        stringEqualsOrRegexMatch(authScope, session.auth_user.scope)
      ) {
        authUser = session.auth_user
      }
    }

    if (!authUser && authTypes.includes(BEARER_AUTH)) {
      const authHeader = req.headers.authorization

      if (authHeader) {
        const re = /(\S+)\s+(\S+)/
        const matches = authHeader.match(re)

        // TODO: figure out how to obtain token (and store correct data in token)
        if (matches) {
          const tokenType = matches[1]
          const token = matches[2]
          if (tokenType.toLowerCase() === BEARER_AUTH) {
            // get config jwt secret
            // verify token and set authUser
            const { jwt_secret } =
              req.scope.resolve("configModule").projectConfig

            const verified = jwt.verify(token, jwt_secret) as JwtPayload

            if (stringEqualsOrRegexMatch(authScope, verified.scope)) {
              authUser = verified as AuthUserDTO
            }
          }
        }
      }
    }

    const isMedusaScope =
      stringEqualsOrRegexMatch(authScope, "admin") ||
      stringEqualsOrRegexMatch(authScope, "store")

    const isRegistered =
      !isMedusaScope ||
      (authUser?.app_metadata?.user_id &&
        stringEqualsOrRegexMatch(authScope, "admin")) ||
      (authUser?.app_metadata?.customer_id &&
        stringEqualsOrRegexMatch(authScope, "store"))

    if (
      authUser &&
      (isRegistered || (!isRegistered && options.allowUnregistered))
    ) {
      req.auth_user = {
        id: authUser.id,
        app_metadata: authUser.app_metadata,
        scope: authUser.scope,
      }
      return next()
    }

    if (options.allowUnauthenticated) {
      return next()
    }

    res.status(401).json({ message: "Unauthorized" })
  }
}
