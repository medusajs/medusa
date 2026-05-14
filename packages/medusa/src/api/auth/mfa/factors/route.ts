import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { AuthMfaStartRequestType } from "../../validators"

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
  req: AuthenticatedMedusaRequest<AuthMfaStartRequestType>,
  res: MedusaResponse
) => {
  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const setup = await authService.startAuthMfa({
    auth_identity_id: req.auth_context.auth_identity_id,
    provider: req.validatedBody.provider,
    label: req.validatedBody.label,
    issuer: req.validatedBody.issuer,
    metadata: req.validatedBody.metadata,
  })

  return res.status(200).json({
    mfa_factor: setup.mfa,
    secret: setup.secret,
    otpauth_url: setup.otpauth_url,
  })
}
