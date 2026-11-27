import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { AuthEvents, MedusaError, Modules } from "@medusajs/framework/utils"
import { AuthMfaGenerateRecoveryCodesRequestType } from "../../validators"

/**
 * @since 2.15.3
 */
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
    // Replacing recovery codes needs a current code, so a stolen token alone
    // can't mint codes that get past MFA.
    method: req.validatedBody.method,
    code: req.validatedBody.code,
  })

  await req.scope.resolve(Modules.EVENT_BUS).emit({
    name: AuthEvents.MFA_RECOVERY_CODES_GENERATED,
    data: {
      auth_identity_id: req.auth_context.auth_identity_id,
      count: codes.length,
    },
  })

  return res.status(200).json({ recovery_codes: codes })
}
