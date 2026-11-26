import {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ConfigModule } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { assertKnownActorType } from "./auth-methods-per-actor"

/**
 * Middleware that rejects an `actor_type` path param the app doesn't know
 * (see `isKnownActorType`). Routes that also carry an `auth_provider` use
 * `validateScopeProviderAssociation`, which checks this too.
 */
export const validateActorType = () => {
  return async (
    req: MedusaRequest,
    _: MedusaResponse,
    next: MedusaNextFunction
  ) => {
    const config: ConfigModule = req.scope.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    assertKnownActorType(config, req.params.actor_type)

    next()
  }
}
