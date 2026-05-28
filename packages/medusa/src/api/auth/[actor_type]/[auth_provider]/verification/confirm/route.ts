import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { VerificationConfirmRequestType } from "../../../../validators"

export const POST = async (
  req: MedusaRequest<VerificationConfirmRequestType>,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params
  const { token: verificationToken } = req.validatedBody

  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)
  const confirmInput: Parameters<
    IAuthModuleService["confirmAuthVerification"]
  >[0] & { provider: string } = {
    token: verificationToken,
    provider: auth_provider,
  }
  const result = await authService.confirmAuthVerification(confirmInput)

  return res.status(200).json({
    entity_id: result.entity_id,
    verified: result.verified,
  })
}
