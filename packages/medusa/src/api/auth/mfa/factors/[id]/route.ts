import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AuthMfaDisableRequestType } from "../../../validators"

export const DELETE = async (
  req: AuthenticatedMedusaRequest<AuthMfaDisableRequestType>,
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

  const disabledFactor = await authService.disableAuthMfa({
    id,
    provider: req.validatedBody.provider,
    code: req.validatedBody.code,
  })

  return res.status(200).json({ mfa_factor: disabledFactor })
}
