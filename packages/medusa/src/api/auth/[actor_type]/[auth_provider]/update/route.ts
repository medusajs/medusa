import { AuthenticatedMedusaRequest } from "@medusajs/framework"
import { IAuthModuleService } from "@medusajs/types"
import { MedusaError, Modules } from "@medusajs/utils"
import { MedusaResponse } from "../../../../../types/routing"

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
