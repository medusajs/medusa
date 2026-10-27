import { bulkFulfillOrdersWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminBulkFulfillOrdersType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminBulkFulfillOrdersType>,
  res: MedusaResponse<{
    succeeded: string[]
    failed: { order_id: string; error: string }[]
  }>
) => {
  const { order_ids } = req.validatedBody

  const { result } = await bulkFulfillOrdersWorkflow(req.scope).run({
    input: { order_ids },
  })

  res.status(200).json(result)
}
