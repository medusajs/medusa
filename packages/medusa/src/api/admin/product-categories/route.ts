import { createProductCategoriesWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
} from "@zjedene-medusa/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductCategoryListParams>,
  res: MedusaResponse<HttpTypes.AdminProductCategoryListResponse>
) => {
  const { data: product_categories, metadata } = await refetchEntities({
    entity: "product_category",
    idOrFilter: req.filterableFields,
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    product_categories,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateProductCategory,
    HttpTypes.AdminProductCategoryParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductCategoryResponse>
) => {
  const { result } = await createProductCategoriesWorkflow(req.scope).run({
    input: { product_categories: [req.validatedBody] },
  })

  const {
    data: [category],
  } = await refetchEntities({
    entity: "product_category",
    idOrFilter: { id: result[0].id, ...req.filterableFields },
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({ product_category: category })
}
