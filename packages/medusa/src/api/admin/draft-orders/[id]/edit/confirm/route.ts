import { confirmDraftOrderEditWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/types"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  const { result } = await confirmDraftOrderEditWorkflow(req.scope).run({
    input: {
      order_id: id,
      confirmed_by: req.auth_context.actor_id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
