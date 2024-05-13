import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ApiKeyDTO, AuthUserDTO, IApiKeyModuleService } from "@medusajs/types"
import { stringEqualsOrRegexMatch } from "@medusajs/utils"
import { NextFunction, RequestHandler } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "../../types/routing"

const SESSION_AUTH = "session"
const BEARER_AUTH = "bearer"
const API_KEY_AUTH = "api-key"

type AuthType = typeof SESSION_AUTH | typeof BEARER_AUTH | typeof API_KEY_AUTH

type MedusaSession = {
  auth_user: AuthUserDTO
  scope: string
}

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

    // We only allow authenticating using a secret API key on the admin
    if (authTypes.includes(API_KEY_AUTH) && isAdminScope(authScope)) {
      const apiKey = await getApiKeyInfo(req)
      if (apiKey) {
        ;(req as AuthenticatedMedusaRequest).auth = {
          actor_id: apiKey.id,
          auth_user_id: "",
          app_metadata: {},
          // TODO: Add more limited scope once we have support for it in the API key module
          scope: "admin",
        }

        return next()
      }
    }

    let authUser: AuthUserDTO | null = getAuthUserFromSession(
      req.session,
      authTypes,
      authScope
    )

    if (!authUser) {
      const { jwt_secret } = req.scope.resolve("configModule").projectConfig
      authUser = getAuthUserFromJwtToken(
        req.headers.authorization,
        jwt_secret,
        authTypes,
        authScope
      )
    }

    const isMedusaScope = isAdminScope(authScope) || isStoreScope(authScope)

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
      ;(req as AuthenticatedMedusaRequest).auth = {
        actor_id: getActorId(authUser, authScope) as string, // TODO: fix types for auth_users not in the medusa system
        auth_user_id: authUser.id,
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

const getApiKeyInfo = async (req: MedusaRequest): Promise<ApiKeyDTO | null> => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return null
  }

  const [tokenType, token] = authHeader.split(" ")
  if (tokenType.toLowerCase() !== "basic" || !token) {
    return null
  }

  // The token could have been base64 encoded, we want to decode it first.
  let normalizedToken = token
  if (!token.startsWith("sk_")) {
    normalizedToken = Buffer.from(token, "base64").toString("utf-8")
  }

  // Basic auth is defined as a username:password set, and since the token is set to the username we need to trim the colon
  if (normalizedToken.endsWith(":")) {
    normalizedToken = normalizedToken.slice(0, -1)
  }

  // Secret tokens start with 'sk_', and if it doesn't it could be a user JWT or a malformed token
  if (!normalizedToken.startsWith("sk_")) {
    return null
  }

  const apiKeyModule = req.scope.resolve(
    ModuleRegistrationName.API_KEY
  ) as IApiKeyModuleService
  try {
    const apiKey = await apiKeyModule.authenticate(normalizedToken)
    if (!apiKey) {
      return null
    }

    return apiKey
  } catch (error) {
    console.error(error)
    return null
  }
}

const getAuthUserFromSession = (
  session: Partial<MedusaSession> = {},
  authTypes: AuthType[],
  authScope: string | RegExp
): AuthUserDTO | null => {
  if (!authTypes.includes(SESSION_AUTH)) {
    return null
  }

  if (
    session.auth_user &&
    stringEqualsOrRegexMatch(authScope, session.auth_user.scope)
  ) {
    return session.auth_user
  }

  return null
}

const getAuthUserFromJwtToken = (
  authHeader: string | undefined,
  jwtSecret: string,
  authTypes: AuthType[],
  authScope: string | RegExp
): AuthUserDTO | null => {
  if (!authTypes.includes(BEARER_AUTH)) {
    return null
  }

  if (!authHeader) {
    return null
  }

  const re = /(\S+)\s+(\S+)/
  const matches = authHeader.match(re)

  // TODO: figure out how to obtain token (and store correct data in token)
  if (matches) {
    const tokenType = matches[1]
    const token = matches[2]
    if (tokenType.toLowerCase() === BEARER_AUTH) {
      // get config jwt secret
      // verify token and set authUser
      try {
        const verified = jwt.verify(token, jwtSecret) as JwtPayload
        if (stringEqualsOrRegexMatch(authScope, verified.scope)) {
          return verified as AuthUserDTO
        }
      } catch (err) {
        return null
      }
    }
  }

  return null
}

const getActorId = (
  authUser: AuthUserDTO,
  scope: string | RegExp
): string | undefined => {
  if (stringEqualsOrRegexMatch(scope, "admin")) {
    return authUser.app_metadata.user_id as string
  }

  if (stringEqualsOrRegexMatch(scope, "store")) {
    return authUser.app_metadata.customer_id as string
  }

  return undefined
}

const isAdminScope = (authScope: string | RegExp): boolean => {
  return stringEqualsOrRegexMatch(authScope, "admin")
}

const isStoreScope = (authScope: string | RegExp): boolean => {
  return stringEqualsOrRegexMatch(authScope, "store")
}
