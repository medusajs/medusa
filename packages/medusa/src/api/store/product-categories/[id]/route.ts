import { StoreProductCategoryResponse } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import { StoreProductCategoryParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreProductCategoryParamsType>,
  res: MedusaResponse<StoreProductCategoryResponse>
) => {
  const category = await refetchEntity(
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
