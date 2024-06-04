import { batchProductsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import {
  AdminBatchUpdateProductType,
  AdminCreateProductType,
} from "../validators"
import { BatchMethodRequest } from "@medusajs/types"
import { refetchBatchProducts, remapProductResponse } from "../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<AdminCreateProductType, AdminBatchUpdateProductType>
  >,
  res: MedusaResponse
) => {
  // TODO: Fix types
  const input = req.validatedBody as any

  const { result } = await batchProductsWorkflow(req.scope).run({
    input,
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
