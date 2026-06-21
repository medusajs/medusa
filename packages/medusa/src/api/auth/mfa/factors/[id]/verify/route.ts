import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { AuthEvents, Modules } from "@medusajs/framework/utils"
import { AuthMfaVerifyFactorRequestType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AuthMfaVerifyFactorRequestType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

  // Capture the previous status to emit the lifecycle event only on transition.
  const factor = await authService.retrieveAuthMfa({
    id,
    auth_identity_id: req.auth_context.auth_identity_id,
  })

  const verifiedFactor = await authService.verifyAuthMfa({
    id,
    auth_identity_id: req.auth_context.auth_identity_id,
    code: req.validatedBody.code,
  })

  if (factor.status !== "enabled" && verifiedFactor.status === "enabled") {
    await req.scope.resolve(Modules.EVENT_BUS).emit({
      name: AuthEvents.MFA_ENABLED,
      data: {
        auth_identity_id: verifiedFactor.auth_identity_id,
        mfa_id: verifiedFactor.id,
        provider: verifiedFactor.provider,
      },
    })
  }

  return res.status(200).json({ mfa_factor: verifiedFactor })
}
