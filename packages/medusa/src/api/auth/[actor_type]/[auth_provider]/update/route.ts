import { MedusaResponse } from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { AuthEvents, MedusaError, Modules } from "@medusajs/framework/utils"
import { ResetPasswordRequest } from "../../../utils/validate-token"

export const POST = async (req: ResetPasswordRequest, res: MedusaResponse) => {
  const { auth_provider } = req.params

  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

  const updateData = {
    ...(req.body as Record<string, unknown>),
    entity_id: req.reset_password_entity_id,
  }

  const { authIdentity, success, error } = await authService.updateProvider(
    auth_provider,
    updateData
  )

  if (success && authIdentity) {
    await req.scope.resolve(Modules.EVENT_BUS).emit({
      name: AuthEvents.CREDENTIALS_UPDATED,
      data: { auth_identity_id: authIdentity.id, provider: auth_provider },
    })

    return res.status(200).json({ success: true })
  }

  throw new MedusaError(MedusaError.Types.UNAUTHORIZED, error || "Unauthorized")
}
