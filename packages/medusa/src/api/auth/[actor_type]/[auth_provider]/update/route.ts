import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params

  const authService = req.scope.resolve<IAuthModuleService>(Modules.AUTH)

  const { authIdentity, success, error } = await authService.updateProvider(
    auth_provider,
    req.body as Record<string, unknown>
  )

  if (success && authIdentity) {
    return res.status(200).json({ success: true })
  }

  throw new MedusaError(MedusaError.Types.UNAUTHORIZED, error || "Unauthorized")
}
