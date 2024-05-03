import { updateProductCategoryWorkflow } from "@medusajs/core-flows"
import { AdminProductCategoryResponse } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchEntities } from "../../../utils/refetch-entity"
import {
  AdminProductCategoryParamsType,
  AdminUpdateProductCategoryType,
} from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminProductCategoryParamsType>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const [category] = await refetchEntities(
    "product_category",
    { id: req.params.id, ...req.filterableFields },
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.json({ product_category: category })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateProductCategoryType>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const { id } = req.params

  // TODO: Should be converted to bulk update
  const { errors } = await updateProductCategoryWorkflow(req.scope).run({
    input: { id, data: req.validatedBody },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const [category] = await refetchEntities(
    "product_category",
    { id, ...req.filterableFields },
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_category: category })
}
