import { createProductCategoryWorkflow } from "@medusajs/core-flows"
import {
  AdminProductCategoryListResponse,
  AdminProductCategoryResponse,
} from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchEntities } from "../../utils/refetch-entity"
import {
  AdminCreateProductCategoryType,
  AdminProductCategoriesParamsType,
} from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminProductCategoriesParamsType>,
  res: MedusaResponse<AdminProductCategoryListResponse>
) => {
  const { rows: product_categories, metadata } = await refetchEntities(
    "product_category",
    req.filterableFields,
    req.scope,
    req.remoteQueryConfig.fields,
    req.remoteQueryConfig.pagination
  )

  res.json({
    product_categories,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateProductCategoryType>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const { result } = await createProductCategoryWorkflow(req.scope).run({
    input: { product_category: req.validatedBody },
  })

  const [category] = await refetchEntities(
    "product_category",
    { id: result.id, ...req.filterableFields },
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_category: category })
}
