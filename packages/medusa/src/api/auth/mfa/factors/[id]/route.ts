import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { AuthMfaDisableFactorRequestType } from "../../../validators"

export const DELETE = async (
  req: AuthenticatedMedusaRequest<AuthMfaDisableFactorRequestType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

  await authService.retrieveAuthMfa({
    id,
    auth_identity_id: req.auth_context.auth_identity_id,
  })

  const disabledFactor = await authService.disableAuthMfa({
    id,
    method: req.validatedBody.method,
    code: req.validatedBody.code,
  })

  return res.status(200).json({ mfa_factor: disabledFactor })
}
