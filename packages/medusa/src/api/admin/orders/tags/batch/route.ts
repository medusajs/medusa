import { bulkTagOrdersWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminBulkTagOrdersType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminBulkTagOrdersType>,
  res: MedusaResponse<{ order_ids: string[] }>
) => {
  const { order_ids, add, remove } = req.validatedBody

  await bulkTagOrdersWorkflow(req.scope).run({
    input: { order_ids, add, remove },
  })

  res.status(200).json({ order_ids })
}
