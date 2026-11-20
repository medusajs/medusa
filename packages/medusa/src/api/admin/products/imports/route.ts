import {
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import type { HttpTypes } from "@medusajs/framework/types"
import type { AdminImportProductsType } from "../validators"
import { importProductsAsChunksWorkflow } from "@medusajs/core-flows"

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
      to: req.auth_context.actor_id,
    },
  })

  res
    .status(202)
    .json({ transaction_id: transaction.transactionId, summary: result })
}
