import { exportCustomersWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { FilterableCustomerProps, HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminExportCustomerRequest,
    HttpTypes.AdminCustomerFilters
  >,
  res: MedusaResponse<HttpTypes.AdminExportCustomerResponse>
) => {
  const selectFields = req.queryConfig.fields ?? []

  const input = {
    select: selectFields,
    filter: req.filterableFields as FilterableCustomerProps,
    format: req.validatedBody?.format,
    batch_size: req.validatedBody?.batch_size,
    to: req.auth_context.actor_id,
  }

  const { transaction } = await exportCustomersWorkflow(req.scope).run({
    input,
  })

  res.status(202).json({ transaction_id: transaction.transactionId })
}
