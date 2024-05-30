import {
  ContainerRegistrationKeys,
  isPresent,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { wrapVariantsWithInventoryQuantity } from "./helpers"
import { StoreGetProductsParamsType } from "./validators"

export const GET = async (
  req: MedusaRequest<StoreGetProductsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const context: object = {}

  if (isPresent(req.pricingContext)) {
    context["variants.calculated_price"] = {
      context: req.pricingContext,
    }
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
      ...context,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: products, metadata } = await remoteQuery(queryObject)

  if (req.context?.with_inventory_quantity) {
    await wrapVariantsWithInventoryQuantity(
      req,
      products.map((product) => product.variants).flat(1)
    )
  }

  res.json({
    products,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
