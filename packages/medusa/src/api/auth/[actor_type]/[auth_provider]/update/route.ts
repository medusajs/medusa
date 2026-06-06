import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { IAuthModuleService } from "@zjedene-medusa/framework/types"
import { MedusaError, Modules } from "@zjedene-medusa/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params

  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

  const updateData = {
    ...(req.body as Record<string, unknown>),
    entity_id: req.auth_context.actor_id, // comes from the validated token
  }

  const { authIdentity, success, error } = await authService.updateProvider(
    auth_provider,
    updateData
  )

  if (success && authIdentity) {
    return res.status(200).json({ success: true })
  }

  throw new MedusaError(MedusaError.Types.UNAUTHORIZED, error || "Unauthorized")
}
