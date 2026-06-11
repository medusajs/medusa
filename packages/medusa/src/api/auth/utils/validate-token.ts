import {
  AuthenticatedMedusaRequest,
  getAuthContextFromJwtToken,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ConfigModule, IAuthModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/types"

export interface UpdateProviderJwtPayload {
  entity_id: string
  actor_type: string
  provider: string
  purpose?: string
  jti?: string
}

// Middleware to validate that a token is valid
export const validateToken = () => {
  return async (
    req: MedusaRequest<HttpTypes.AdminUpdateProvider>,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const { actor_type, auth_provider } = req.params

    const req_ = req as AuthenticatedMedusaRequest

    const { http } = req_.scope.resolve<ConfigModule>(
      ContainerRegistrationKeys.CONFIG_MODULE
    ).projectConfig

    const token = getAuthContextFromJwtToken(
      req.headers.authorization,
      http.jwtSecret!,
      ["bearer"],
      [actor_type],
      http.jwtPublicKey,
      http.jwtVerifyOptions ?? http.jwtOptions
    ) as UpdateProviderJwtPayload | null

    const errorObject = new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      `Invalid token`
    )

    if (!token || !token.entity_id) {
      return next(errorObject)
    }

    // The password-update route must only accept tokens issued by the
    // reset-password flow. Reject session bearer tokens (no purpose claim)
    // and unbound tokens (no jti).
    if (token.purpose !== "reset" || !token.jti) {
      return next(errorObject)
    }

    const authModule = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

    try {
      // Atomically verify and delete the single-use token row. Storing the
      // fingerprint on a dedicated table (not on provider_metadata) keeps it
      // safe from the password provider's metadata-merge on write.
      await authModule.consumePasswordResetToken({
        jti: token.jti,
        provider: auth_provider,
        entity_id: token.entity_id,
      })
    } catch {
      return next(errorObject)
    }

    const [providerIdentity] = await authModule.listProviderIdentities(
      {
        entity_id: token.entity_id,
        provider: auth_provider,
      },
      {
        select: [
          "provider_metadata",
          "auth_identity_id",
          "entity_id",
          "user_metadata",
        ],
      }
    )

    if (!providerIdentity) {
      return next(errorObject)
    }

    req_.auth_context = {
      actor_type,
      auth_identity_id: providerIdentity.auth_identity_id!,
      actor_id: providerIdentity.entity_id,
      app_metadata: {},
      user_metadata: providerIdentity.user_metadata ?? {},
    }

    return next()
  }
}
