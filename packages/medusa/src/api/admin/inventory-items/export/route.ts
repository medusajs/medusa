import { exportInventoryItemsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.AdminInventoryItemExportParams>,
  res: MedusaResponse<HttpTypes.AdminExportInventoryItemResponse>
) => {
  const input = {
    select: req.queryConfig.fields ?? [],
    filter: req.filterableFields,
  }

  const { transaction } = await exportInventoryItemsWorkflow(req.scope).run({
    input,
  })

  res.status(202).json({ transaction_id: transaction.transactionId })
}
