import {
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@zjedene-medusa/framework/http"
import type { HttpTypes } from "@zjedene-medusa/framework/types"
import type { AdminImportProductsType } from "../validators"
import { importProductsAsChunksWorkflow } from "@zjedene-medusa/core-flows"

/**
 * @since 2.8.5
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminImportProductsType>,
  res: MedusaResponse<HttpTypes.AdminImportProductResponse>
) => {
  const { result, transaction } = await importProductsAsChunksWorkflow(
    req.scope
  ).run({
    input: {
      filename: req.validatedBody.originalname,
      fileKey: req.validatedBody.file_key,
    },
  })

  res
    .status(202)
    .json({ transaction_id: transaction.transactionId, summary: result })
}
