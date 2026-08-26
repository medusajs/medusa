import { AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"

/**
 * Enrolling a factor is the one MFA mutation reachable with an actorless token,
 * because it happens during registration and verification flows where the actor
 * does not exist yet. It is only safe while the identity has nothing to bypass:
 * once a factor is enabled, the actorless token in play is the pre-MFA login
 * token, and letting it enroll a factor would turn the password alone into a
 * second factor.
 */
export async function assertMfaEnrollmentAllowed(
  req: AuthenticatedMedusaRequest
) {
  if (req.auth_context.actor_id) {
    return
  }

  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const enabledFactors = await authService.listAuthMfa({
    auth_identity_id: req.auth_context.auth_identity_id,
    status: "enabled",
  })

  if (enabledFactors.length) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "Enrolling an MFA factor while MFA is enabled requires a fully authenticated session"
    )
  }
}
