import { IAuthModuleService } from "@medusajs/types"
import { MedusaError, ModuleRegistrationName } from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { auth_provider } = req.params

  const service: IAuthModuleService = req.scope.resolve(
    ModuleRegistrationName.AUTH
  )

  const { success, error } = await service.updateProviderData(
    auth_provider,
    req.body as Record<string, unknown>
  )

  if (success) {
    return res.status(200).json({ success: true })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Auth provider update failed"
  )
}
