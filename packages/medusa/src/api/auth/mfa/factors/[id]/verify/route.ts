import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AuthMfaVerifyRequestType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AuthMfaVerifyRequestType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const [factor] = await authService.listAuthMfa({
    id: [id],
    auth_identity_id: req.auth_context.auth_identity_id,
  })

  if (!factor) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `MFA factor with id "${id}" was not found`
    )
  }

  const verifiedFactor = await authService.verifyAuthMfa({
    id,
    code: req.validatedBody.code,
  })

  return res.status(200).json({ mfa_factor: verifiedFactor })
}
