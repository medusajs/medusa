import { requestOrderEditRequestWorkflow } from "@medusajs/core-flows"
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

  const { result } = await requestOrderEditRequestWorkflow(req.scope).run({
    input: {
      order_id: id,
      requested_by: req.auth_context.actor_id,
    },
  })

  res.json({
    order_preview: result,
  })
}
