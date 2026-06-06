import {
  removeDraftOrderShippingMethodWorkflow,
  updateDraftOrderShippingMethodWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/types"
import { AdminUpdateDraftOrderShippingMethodType } from "../../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateDraftOrderShippingMethodType>,
  res: MedusaResponse
) => {
  const { id, method_id } = req.params

  const { result } = await updateDraftOrderShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      data: { shipping_method_id: method_id, ...req.validatedBody },
      order_id: id,
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
  const { id, method_id } = req.params

  const { result } = await removeDraftOrderShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      order_id: id,
      shipping_method_id: method_id,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminDraftOrderPreview,
  })
}
