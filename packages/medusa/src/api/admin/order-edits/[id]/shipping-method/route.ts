import { createOrderEditShippingMethodWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { AdminPostOrderEditsShippingReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostOrderEditsShippingReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminOrderEditPreviewResponse>
) => {
  const { id } = req.params

  const { result } = await createOrderEditShippingMethodWorkflow(req.scope).run(
    {
      input: { ...req.validatedBody, order_id: id },
    }
  )

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
