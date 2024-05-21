import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ApiKeyDTO, ConfigModule, IApiKeyModuleService } from "@medusajs/types"
import { NextFunction, RequestHandler } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import {
  AuthContext,
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "../../types/routing"

const SESSION_AUTH = "session"
const BEARER_AUTH = "bearer"
const API_KEY_AUTH = "api-key"

type AuthType = typeof SESSION_AUTH | typeof BEARER_AUTH | typeof API_KEY_AUTH

const ADMIN_SCOPE = "admin"
const STORE_SCOPE = "store"
const ALL_SCOPE = "*"

type Scope = typeof ADMIN_SCOPE | typeof STORE_SCOPE | typeof ALL_SCOPE

type MedusaSession = {
  auth_context: AuthContext
}

export const authenticate = (
  authScope: Scope | Scope[],
  authType: AuthType | AuthType[],
  options: { allowUnauthenticated?: boolean; allowUnregistered?: boolean } = {}
): RequestHandler => {
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: NextFunction
  ): Promise<void> => {
    const authTypes = Array.isArray(authType) ? authType : [authType]
    const scopes = Array.isArray(authScope) ? authScope : [authScope]

    // We only allow authenticating using a secret API key on the admin
    const isExclusivelyAdmin =
      scopes.length === 1 && scopes.includes(ADMIN_SCOPE)
    if (authTypes.includes(API_KEY_AUTH) && isExclusivelyAdmin) {
      const apiKey = await getApiKeyInfo(req)
      if (apiKey) {
        ;(req as AuthenticatedMedusaRequest).auth_context = {
          actor_id: apiKey.id,
          actor_type: "api-key",
          auth_identity_id: "",
          app_metadata: {},
          scope: ADMIN_SCOPE,
        }

        return next()
      }
    }

    // We try to extract the auth context either from the session or from a JWT token
    let authContext: AuthContext | null = getAuthContextFromSession(
      req.session,
      authTypes,
      scopes
    )

    if (!authContext) {
      const { http } =
        req.scope.resolve<ConfigModule>("configModule").projectConfig
      authContext = getAuthContextFromJwtToken(
        req.headers.authorization,
        http.jwtSecret!,
        authTypes,
        scopes
      )
    }

    // If the entity is authenticated, and it is a registered user/customer we can continue
    if (
      authContext &&
      !!authContext.actor_id &&
      authContext.actor_type !== "unknown"
    ) {
      ;(req as AuthenticatedMedusaRequest).auth_context = authContext
      return next()
    }

    // If the entity is authenticated, but there is no user/customer yet, we can continue (eg. in the case of a user invite) if allow unregistered is set
    if (
      authContext &&
      authContext.auth_identity_id &&
      options.allowUnregistered
    ) {
      ;(req as AuthenticatedMedusaRequest).auth_context = authContext
      return next()
    }

    // If we allow unauthenticated requests (i.e public endpoints), just continue
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

const getAuthContextFromSession = (
  session: Partial<MedusaSession> = {},
  authTypes: AuthType[],
  scopes: Scope[]
): AuthContext | null => {
  if (!authTypes.includes(SESSION_AUTH)) {
    return null
  }

  if (
    session.auth_context &&
    scopes.includes(session.auth_context.scope as Scope)
  ) {
    return session.auth_context
  }

  return null
}

const getAuthContextFromJwtToken = (
  authHeader: string | undefined,
  jwtSecret: string,
  authTypes: AuthType[],
  scopes: Scope[]
): AuthContext | null => {
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
        if (scopes.includes(verified.scope)) {
          return verified as AuthContext
        }
      } catch (err) {
        return null
      }
    }
  }

  return null
}
