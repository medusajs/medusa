import { IAuthModuleService } from "@medusajs/types"
import { MedusaError, ModuleRegistrationName } from "@medusajs/utils"
import { z } from "zod"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

export const AdminResetPasswordReq = z.object({
  update: z.record(z.unknown()),
  // entity_id: z.string(),
})

export type AdminResetPasswordReqType = z.infer<typeof AdminResetPasswordReq>

export const POST = async (
  req: MedusaRequest<AdminResetPasswordReqType>,
  res: MedusaResponse
) => {
  const { auth_provider } = req.params

  const service: IAuthModuleService = req.scope.resolve(
    ModuleRegistrationName.AUTH
  )

  const { success, error } = await service.updateProviderData(
    auth_provider,
    req.validatedBody
  )

  if (success) {
    return res.status(200).json({ success: true })
  }

  throw new MedusaError(
    MedusaError.Types.UNAUTHORIZED,
    error || "Auth provider update failed"
  )
}
