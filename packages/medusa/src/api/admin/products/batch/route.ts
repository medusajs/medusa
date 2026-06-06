import { batchProductsWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchBatchProducts, remapProductResponse } from "../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminBatchProductRequest,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminBatchProductResponse>
) => {
  const { result } = await batchProductsWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  const batchResults = await refetchBatchProducts(
    result,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({
    created: batchResults.created.map(remapProductResponse),
    updated: batchResults.updated.map(remapProductResponse),
    deleted: batchResults.deleted,
  })
}
