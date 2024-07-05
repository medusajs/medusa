import { batchProductVariantsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import {
  AdminBatchUpdateProductVariantType,
  AdminCreateProductType,
} from "../../../validators"
import { BatchMethodRequest } from "@medusajs/types"
import { refetchBatchVariants, remapVariantResponse } from "../../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<
      AdminCreateProductType,
      AdminBatchUpdateProductVariantType
    >
  >,
  res: MedusaResponse
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
    // TODO: Fix types
  } as any

  const { result, errors } = await batchProductVariantsWorkflow(req.scope).run({
    input: normalizedInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

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
