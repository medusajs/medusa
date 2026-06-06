import {
  deleteProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AdminProductCategoryResponse,
  HttpTypes,
} from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntities,
} from "@zjedene-medusa/framework/http"
import { MedusaError } from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminProductCategoryListParams
  >,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const {
    data: [category],
  } = await refetchEntities({
    entity: "product_category",
    idOrFilter: { id: req.params.id, ...req.filterableFields },
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  if (!category) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product category with id: ${req.params.id} was not found`
    )
  }

  res.json({ product_category: category })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateProductCategory,
    HttpTypes.AdminProductCategoryParams
  >,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const { id } = req.params

  await updateProductCategoriesWorkflow(req.scope).run({
    input: { selector: { id }, update: req.validatedBody },
  })

  const {
    data: [category],
  } = await refetchEntities({
    entity: "product_category",
    idOrFilter: { id, ...req.filterableFields },
    scope: req.scope,
    fields: req.queryConfig.fields,
    pagination: req.queryConfig.pagination,
  })

  res.status(200).json({ product_category: category })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminProductCategoryDeleteResponse>
) => {
  const id = req.params.id

  await deleteProductCategoriesWorkflow(req.scope).run({
    input: [id],
  })

  res.status(200).json({
    id,
    object: "product_category",
    deleted: true,
  })
}
