import { addDraftOrderShippingMethodsWorkflow } from "@zjedene-medusa/core-flows"
import { AuthenticatedMedusaRequest, MedusaResponse } from "@zjedene-medusa/framework"
import { HttpTypes } from "@zjedene-medusa/types"
import { AdminAddDraftOrderShippingMethodType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminAddDraftOrderShippingMethodType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const { result } = await addDraftOrderShippingMethodsWorkflow(req.scope).run({
    input: {
      order_id: id,
      ...req.validatedBody,
    },
  })

  res.json({
    draft_order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
