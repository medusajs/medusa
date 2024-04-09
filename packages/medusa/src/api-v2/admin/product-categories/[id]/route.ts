import { AdminProductCategoryResponse } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminProductCategoryParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminProductCategoryParamsType>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_category",
    variables: {
      filters: req.filterableFields,
      id: req.params.id,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [product_category] = await remoteQuery(queryObject)

  res.json({ product_category })
}
