import { confirmOrderEditRequestWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminOrderEditPreviewResponse>
) => {
  const { id } = req.params

  const { result } = await confirmOrderEditRequestWorkflow(req.scope).run({
    input: { order_id: id },
  })

  res.json({
    order_preview: result,
  })
}
