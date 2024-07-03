import { ApiKeyDTO, ConfigModule, IApiKeyModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
} from "@medusajs/utils"
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

// This is the only hard-coded actor type, as API keys have special handling for now. We could also generalize API keys to carry the actor type with them.
const ADMIN_ACTOR_TYPE = "user"

type AuthType = typeof SESSION_AUTH | typeof BEARER_AUTH | typeof API_KEY_AUTH

type MedusaSession = {
  auth_context: AuthContext
}

export const authenticate = (
  actorType: string | string[],
  authType: AuthType | AuthType[],
  options: { allowUnauthenticated?: boolean; allowUnregistered?: boolean } = {}
): RequestHandler => {
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: NextFunction
  ): Promise<void> => {
    const authTypes = Array.isArray(authType) ? authType : [authType]
    const actorTypes = Array.isArray(actorType) ? actorType : [actorType]
    const req_ = req as AuthenticatedMedusaRequest

    // We only allow authenticating using a secret API key on the admin
    const isExclusivelyUser =
      actorTypes.length === 1 && actorTypes[0] === ADMIN_ACTOR_TYPE

    if (authTypes.includes(API_KEY_AUTH) && isExclusivelyUser) {
      const apiKey = await getApiKeyInfo(req)
      if (apiKey) {
        req_.auth_context = {
          actor_id: apiKey.id,
          actor_type: "api-key",
          auth_identity_id: "",
          app_metadata: {},
        }

        return next()
      }
    }

    // We try to extract the auth context either from the session or from a JWT token
    let authContext: AuthContext | null = getAuthContextFromSession(
      req.session,
      authTypes,
      actorTypes
    )

    if (!authContext) {
      const { http } = req.scope.resolve<ConfigModule>(
        ContainerRegistrationKeys.CONFIG_MODULE
      ).projectConfig

      authContext = getAuthContextFromJwtToken(
        req.headers.authorization,
        http.jwtSecret!,
        authTypes,
        actorTypes
      )
    }

    // If the entity is authenticated, and it is a registered actor we can continue
    if (authContext?.actor_id) {
      req_.auth_context = authContext
      return next()
    }

    // If the entity is authenticated, but there is no registered actor yet, we can continue (eg. in the case of a user invite) if allow unregistered is set
    if (authContext?.auth_identity_id && options.allowUnregistered) {
      req_.auth_context = authContext
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
  actorTypes: string[]
): AuthContext | null => {
  if (!authTypes.includes(SESSION_AUTH)) {
    return null
  }

  if (
    session.auth_context &&
    (actorTypes.includes("*") ||
      actorTypes.includes(session.auth_context.actor_type))
  ) {
    return session.auth_context
  }

  return null
}

const getAuthContextFromJwtToken = (
  authHeader: string | undefined,
  jwtSecret: string,
  authTypes: AuthType[],
  actorTypes: string[]
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
        if (
          actorTypes.includes("*") ||
          actorTypes.includes(verified.actor_type)
        ) {
          return verified as AuthContext
        }
      } catch (err) {
        return null
      }
    }
  }

  return null
}
