import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ConfigModule } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { isAuthProviderAllowedForActor } from "./auth-methods-per-actor"

// Middleware to validate that a scope is associated with a provider
export const validateScopeProviderAssociation = () => {
  return async (
    req: MedusaRequest,
    _: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const { actor_type, auth_provider } = req.params
    const config: ConfigModule = req.scope.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    if (!isAuthProviderAllowedForActor(config, actor_type, auth_provider)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The actor type ${actor_type} is not allowed to use the auth provider ${auth_provider}`
      )
    }

    next()
  }
}
