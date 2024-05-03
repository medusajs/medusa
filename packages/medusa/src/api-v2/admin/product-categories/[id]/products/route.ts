import { batchLinkProductsToCategoryWorkflow } from "@medusajs/core-flows"
import {
  AdminProductCategoryResponse,
  LinkMethodRequest,
} from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { refetchEntity } from "../../../../utils/refetch-entity"

export const POST = async (
  req: AuthenticatedMedusaRequest<LinkMethodRequest>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const { id } = req.params

  const { errors } = await batchLinkProductsToCategoryWorkflow(req.scope).run({
    input: { id, ...req.validatedBody },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const category = await refetchEntity(
    "product_category",
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ product_category: category })
}
