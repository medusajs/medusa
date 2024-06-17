import {
  deleteProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
} from "@medusajs/core-flows"
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
import { MedusaError } from "@medusajs/utils"

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

  if (!category) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product category with id: ${req.params.id} was not found`
    )
  }

  res.json({ product_category: category })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateProductCategoryType>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const { id } = req.params

  await updateProductCategoriesWorkflow(req.scope).run({
    input: { selector: { id }, update: req.validatedBody },
  })

  const [category] = await refetchEntities(
    "product_category",
    { id, ...req.filterableFields },
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_category: category })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
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
