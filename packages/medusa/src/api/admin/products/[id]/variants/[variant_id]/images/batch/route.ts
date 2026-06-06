import { batchVariantImagesWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"

/**
 * @since 2.11.2
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminBatchVariantImagesRequest>,
  res: MedusaResponse<HttpTypes.AdminBatchVariantImagesResponse>
) => {
  const variantId = req.params.variant_id

  const { result } = await batchVariantImagesWorkflow(req.scope).run({
    input: {
      variant_id: variantId,
      add: req.validatedBody.add,
      remove: req.validatedBody.remove,
    },
  })

  res.status(200).json({
    added: result.added,
    removed: result.removed,
  })
}
