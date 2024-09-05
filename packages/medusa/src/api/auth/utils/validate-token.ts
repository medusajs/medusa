import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { ConfigModule, IAuthModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
} from "@medusajs/utils"
import { JwtPayload, verify } from "jsonwebtoken"

// Middleware to validate that a token is valid
export const validateToken = () => {
  return async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const { actor_type } = req.params
    const { token } = req.query

    const req_ = req as AuthenticatedMedusaRequest

    if (!token) {
      return next()
    }

    // @ts-ignore
    const { http } = req_.scope.resolve<ConfigModule>(
      ContainerRegistrationKeys.CONFIG_MODULE
    ).projectConfig

    let verified: JwtPayload | null = null

    try {
      verified = verify(token as string, http.jwtSecret!) as JwtPayload
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" })
    }

    if (!verified || !verified.auth_identity_id) {
      return res.status(401).json({ message: "Invalid token" })
    }

    const authModule = req.scope.resolve<IAuthModuleService>(
      ModuleRegistrationName.AUTH
    )

    try {
      const [providerIdentity] = await authModule.listProviderIdentities(
        { auth_identity_id: verified.auth_identity_id },
        {
          select: ["auth_identity_id", "entity_id"],
        }
      )

      req_.auth_context = {
        actor_type,
        auth_identity_id: verified.auth_identity_id!,
        actor_id: providerIdentity.entity_id,
        app_metadata: {},
      }
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    return next()
  }
}
