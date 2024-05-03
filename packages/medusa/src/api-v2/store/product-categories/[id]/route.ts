import { StoreProductCategoryResponse } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchEntities } from "../../../utils/refetch-entity"
import { StoreProductCategoryParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreProductCategoryParamsType>,
  res: MedusaResponse<StoreProductCategoryResponse>
) => {
  const category = await refetchEntities(
    "product_category",
    { id: req.params.id, ...req.filterableFields },
    req.scope,
    req.remoteQueryConfig.fields,
    req.remoteQueryConfig.pagination
  )

  if (!category) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product category with id: ${req.params.id} was not found`
    )
  }
  res.json({ product_category: category })
}
