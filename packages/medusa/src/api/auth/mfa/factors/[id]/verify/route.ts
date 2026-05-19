import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { AuthMfaVerifyFactorRequestType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AuthMfaVerifyFactorRequestType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

  const verifiedFactor = await authService.verifyAuthMfa({
    id,
    auth_identity_id: req.auth_context.auth_identity_id,
    code: req.validatedBody.code,
  })

  return res.status(200).json({ mfa_factor: verifiedFactor })
}
