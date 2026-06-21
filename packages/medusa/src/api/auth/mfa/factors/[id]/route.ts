import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { AuthEvents, Modules } from "@medusajs/framework/utils"
import { AuthMfaDisableFactorRequestType } from "../../../validators"

export const DELETE = async (
  req: AuthenticatedMedusaRequest<AuthMfaDisableFactorRequestType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

  const factor = await authService.retrieveAuthMfa({
    id,
    auth_identity_id: req.auth_context.auth_identity_id,
  })

  const disabledFactor = await authService.disableAuthMfa({
    id,
    method: req.validatedBody.method,
    code: req.validatedBody.code,
  })

  if (factor.status !== "disabled" && disabledFactor.status === "disabled") {
    await req.scope.resolve(Modules.EVENT_BUS).emit({
      name: AuthEvents.MFA_DISABLED,
      data: {
        auth_identity_id: disabledFactor.auth_identity_id,
        mfa_id: disabledFactor.id,
        provider: disabledFactor.provider,
      },
    })
  }

  return res.status(200).json({ mfa_factor: disabledFactor })
}
