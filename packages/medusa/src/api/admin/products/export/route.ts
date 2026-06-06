import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { remapKeysForProduct } from "../helpers"
import { exportProductsWorkflow } from "@zjedene-medusa/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.AdminProductExportParams>,
  res: MedusaResponse<HttpTypes.AdminExportProductResponse>
) => {
  const selectFields = remapKeysForProduct(req.queryConfig.fields ?? [])
  const input = { select: selectFields, filter: req.filterableFields }

  const { transaction } = await exportProductsWorkflow(req.scope).run({
    input,
  })

  res.status(202).json({ transaction_id: transaction.transactionId })
}
