import { batchProductVariantsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { refetchBatchVariants, remapVariantResponse } from "../../../helpers"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminBatchProductVariantRequest>,
  res: MedusaResponse<HttpTypes.AdminBatchProductVariantResponse>
) => {
  const productId = req.params.id

  const normalizedInput = {
    create: req.validatedBody.create?.map((c) => ({
      ...c,
      product_id: productId,
    })),
    update: req.validatedBody.update?.map((u) => ({
      ...u,
      product_id: productId,
    })),
    delete: req.validatedBody.delete,
  }

  const { result } = await batchProductVariantsWorkflow(req.scope).run({
    input: normalizedInput,
  })

  const batchResults = await refetchBatchVariants(
    result,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    created: batchResults.created.map(remapVariantResponse),
    updated: batchResults.updated.map(remapVariantResponse),
    deleted: batchResults.deleted,
  })
}
