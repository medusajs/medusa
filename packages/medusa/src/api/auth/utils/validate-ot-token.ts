import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { ConfigModule, IAuthModuleService } from "@medusajs/types"
import { NextFunction, RequestHandler } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
} from "../../../../../core/utils/dist"

type TokenPayload = {
  provider_identity_id: string
  actor_type: string
}

export const authenticateOneTimeToken = (
  actorType: string | string[]
): RequestHandler => {
  const handler = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: NextFunction
  ): Promise<void> => {
    const actorTypes = Array.isArray(actorType) ? actorType : [actorType]
    const req_ = req as AuthenticatedMedusaRequest
    const { token } = req.query

    const {
      // @ts-ignore
      projectConfig: { http },
    } = req.scope.resolve<ConfigModule>(ContainerRegistrationKeys.CONFIG_MODULE)

    // We try to extract the auth context either from the session or from a JWT token
    let decodedToken: TokenPayload | null = getIdentityFromOTToken(
      token as string,
      "secret", // Question: Where do we want to configure the secret?
      actorTypes
    )

    if (decodedToken) {
      const authService = req.scope.resolve<IAuthModuleService>(
        ModuleRegistrationName.AUTH
      )

      const providerIdentity = await authService.retrieveProviderIdentity(
        decodedToken?.provider_identity_id,
        {
          select: ["entity_id"],
          relations: ["auth_identity"],
        }
      )

      if (providerIdentity) {
        req_.auth_context = {
          actor_id: providerIdentity.entity_id,
          actor_type: decodedToken.actor_type,
          auth_identity_id: providerIdentity.auth_identity!.id,
          app_metadata: {},
        }

        console.log("REQ AUTH CONTEXT", req_.auth_context)
        return next()
      }
    }

    res.status(401).json({ message: "Unauthorized" })
  }

  return handler as unknown as RequestHandler
}

const getIdentityFromOTToken = (
  token: string,
  secret: string,
  actorTypes: string[]
): TokenPayload | null => {
  try {
    const verified = verify(token, secret) as JwtPayload

    if (actorTypes.includes("*") || actorTypes.includes(verified.actor_type)) {
      return verified as TokenPayload
    }
  } catch (err) {
    console.log("ERROR", err)
    return null
  }

  return null
}
