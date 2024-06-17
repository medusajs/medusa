import { batchProductsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchBatchProducts, remapProductResponse } from "../helpers"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminBatchProductRequest>,
  res: MedusaResponse<HttpTypes.AdminBatchProductResponse>
) => {
  const { result } = await batchProductsWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  const batchResults = await refetchBatchProducts(
    result,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    created: batchResults.created.map(remapProductResponse),
    updated: batchResults.updated.map(remapProductResponse),
    deleted: batchResults.deleted,
  })
}
