import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { AuthMfaCreateFactorRequestType } from "../../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const mfaFactors = await authService.listAuthMfa({
    auth_identity_id: req.auth_context.auth_identity_id,
  })

  return res.status(200).json({ mfa_factors: mfaFactors })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AuthMfaCreateFactorRequestType>,
  res: MedusaResponse
) => {
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const enrollment = await authService.startAuthMfa({
    auth_identity_id: req.auth_context.auth_identity_id,
    provider: req.validatedBody.provider,
    label: req.validatedBody.label,
    issuer: req.validatedBody.issuer,
    metadata: req.validatedBody.metadata,
  })

  return res.status(200).json({
    mfa_factor: enrollment.mfa,
    secret: enrollment.secret,
    otpauth_url: enrollment.otpauth_url,
  })
}
