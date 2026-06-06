import { beginOrderEditOrderWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { AdminPostOrderEditsReqSchemaType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostOrderEditsReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminOrderEditResponse>
) => {
  const input = req.validatedBody as AdminPostOrderEditsReqSchemaType

  const workflow = beginOrderEditOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  res.json({
    order_change: result as unknown as HttpTypes.AdminOrderChange,
  })
}
