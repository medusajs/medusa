import { batchLinkProductsToCategoryWorkflow } from "@zjedene-medusa/core-flows"
import {
  AdminProductCategoryResponse,
  HttpTypes,
} from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@zjedene-medusa/framework/http"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminBatchLink,
    HttpTypes.AdminProductCategoryParams
  >,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const { id } = req.params

  await batchLinkProductsToCategoryWorkflow(req.scope).run({
    input: { id, ...req.validatedBody },
  })

  const category = await refetchEntity({
    entity: "product_category",
    idOrFilter: id,
    scope: req.scope,
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ product_category: category })
}
