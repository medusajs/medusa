import { addDraftOrderItemsWorkflow } from "@zjedene-medusa/core-flows"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@zjedene-medusa/framework"
import { HttpTypes } from "@zjedene-medusa/types"
import { AdminAddDraftOrderItemsType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminAddDraftOrderItemsType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const { result } = await addDraftOrderItemsWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      order_id: id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
