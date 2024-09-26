import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ConfigModule, IAuthModuleService } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { decode, JwtPayload, verify } from "jsonwebtoken"

// Middleware to validate that a token is valid
export const validateToken = () => {
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const { actor_type, auth_provider } = req.params
    const { token } = req.query

    const req_ = req as AuthenticatedMedusaRequest

    if (!token) {
      return next()
    }

    // @ts-ignore
    const { http } = req_.scope.resolve<ConfigModule>(
      ContainerRegistrationKeys.CONFIG_MODULE
    ).projectConfig

    const authModule = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

    const decoded = decode(token as string) as JwtPayload

    const [providerIdentity] = await authModule.listProviderIdentities(
      {
        entity_id: decoded.entity_id,
        provider: auth_provider,
      },
      {
        select: ["provider_metadata", "auth_identity_id", "entity_id"],
      }
    )

    if (!providerIdentity) {
      return res.status(401).json({ message: "Invalid token" })
    }

    let verified: JwtPayload | null = null

    try {
      verified = verify(token as string, http.jwtSecret as string) as JwtPayload
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req_.auth_context = {
      actor_type,
      auth_identity_id: verified.auth_identity_id!,
      actor_id: providerIdentity.entity_id,
      app_metadata: {},
    }

    return next()
  }
}
