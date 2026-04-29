import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { StoreProductTagResponse } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

import { StoreProductTagParamsType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreProductTagParamsType>,
  res: MedusaResponse<StoreProductTagResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph(
    {
      entity: "product_tag",
      filters: {
        id: req.params.id,
      },
      fields: req.queryConfig.fields,
    },
    {
      locale: req.locale,
    }
  )

  if (!data.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product tag with id: ${req.params.id} was not found`
    )
  }

  const productTag = data[0]

  res.json({ product_tag: productTag })
}
