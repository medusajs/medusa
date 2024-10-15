import { batchLinkProductsToCategoryWorkflow } from "@medusajs/core-flows"
import {
  AdminProductCategoryResponse,
  LinkMethodRequest,
} from "@medusajs/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const { id } = req.params

  await batchLinkProductsToCategoryWorkflow(req.scope).run({
    input: { id, ...req.validatedBody },
  })

  const category = await refetchEntity(
    "product_category",
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_category: category })
}
