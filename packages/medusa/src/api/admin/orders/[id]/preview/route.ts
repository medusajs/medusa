import { HttpTypes } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminOrderPreviewResponse>
) => {
  const { id } = req.params

  // NOTE: Consider replacing with remoteQuery when possible
  const orderModuleService = req.scope.resolve(Modules.ORDER)

  const order = (await orderModuleService.previewOrderChange(
    id
  )) as unknown as HttpTypes.AdminOrderPreview

  res.status(200).json({ order })
}
