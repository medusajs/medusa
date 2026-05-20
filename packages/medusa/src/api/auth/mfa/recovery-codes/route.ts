import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AuthMfaGenerateRecoveryCodesRequestType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AuthMfaGenerateRecoveryCodesRequestType>,
  res: MedusaResponse
) => {
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const factors = await authService.listAuthMfa({
    auth_identity_id: req.auth_context.auth_identity_id,
    status: "enabled",
  })

  if (!factors.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Recovery codes require an enabled MFA factor"
    )
  }

  const { codes } = await authService.generateAuthMfaRecoveryCodes({
    auth_identity_id: req.auth_context.auth_identity_id,
    count: req.validatedBody.count,
  })

  return res.status(200).json({ recovery_codes: codes })
}
