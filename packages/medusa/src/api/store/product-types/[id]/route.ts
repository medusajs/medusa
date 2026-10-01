import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { StoreProductTypeResponse } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

import { StoreProductTypeParamsType } from "../validators"
import { publishedProductsContext } from "../../utils/published-products-context"

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreProductTypeParamsType>,
  res: MedusaResponse<StoreProductTypeResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph(
    {
      entity: "product_type",
      filters: {
        id: req.params.id,
      },
      fields: req.queryConfig.fields,
      context: publishedProductsContext(),
    },
    {
      locale: req.locale,
    }
  )

  if (!data.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product type with id: ${req.params.id} was not found`
    )
  }

  const productType = data[0]

  res.json({ product_type: productType })
}
