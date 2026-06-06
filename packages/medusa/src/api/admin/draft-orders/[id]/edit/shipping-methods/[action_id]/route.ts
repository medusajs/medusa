import {
  removeDraftOrderActionShippingMethodWorkflow,
  updateDraftOrderActionShippingMethodWorkflow,
} from "@zjedene-medusa/core-flows"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@zjedene-medusa/framework"
import { HttpTypes } from "@zjedene-medusa/types"
import { AdminUpdateDraftOrderActionShippingMethodType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateDraftOrderActionShippingMethodType>,
  res: MedusaResponse
) => {
  const { id, action_id } = req.params

  const { result } = await updateDraftOrderActionShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      data: { ...req.validatedBody },
      order_id: id,
      action_id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminDraftOrderPreview,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id, action_id } = req.params

  const { result } = await removeDraftOrderActionShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      order_id: id,
      action_id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminDraftOrderPreview,
  })
}
