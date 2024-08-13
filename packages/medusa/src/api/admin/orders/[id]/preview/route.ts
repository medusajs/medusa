import { ModuleRegistrationName } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminOrderPreviewResponse>
) => {
  const { id } = req.params

  // NOTE: Consider replacing with remoteQuery when possible
  const orderModuleService = req.scope.resolve(ModuleRegistrationName.ORDER)

  const order = (await orderModuleService.previewOrderChange(
    id
  )) as unknown as HttpTypes.AdminOrderPreview

  res.status(200).json({ order })
}
