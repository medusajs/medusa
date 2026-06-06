import { orderEditAddNewItemWorkflow } from "@zjedene-medusa/core-flows"

import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { AdminPostOrderEditsAddItemsReqSchemaType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostOrderEditsAddItemsReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminOrderEditPreviewResponse>
) => {
  const { id } = req.params

  const { result } = await orderEditAddNewItemWorkflow(req.scope).run({
    input: { ...req.validatedBody, order_id: id },
  })

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
  })
}
