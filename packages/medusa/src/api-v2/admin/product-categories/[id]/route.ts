import { AdminProductCategoryResponse } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminProductCategoryParamsType } from "../validators"
import { refetchCategory } from "../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminProductCategoryParamsType>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const category = await refetchCategory(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.json({ product_category: category })
}
